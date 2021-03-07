import {CHAIN_NAME} from '../const'

/**
 * 用于按顺序拉取区块，保证每个区块只拉取一次
 */
class BlockFetcher {
    /**
     * @callback BlockFetchCallback
     * @param {object} block
     * @param {Error} error
     */
    /**
     * @param {Requester} requester
     * @param {BlockFetchCallback} callback
     */
    constructor(requester, callback) {
        this.fetchTasks = [] // 待执行的拉取区块任务列表
        this.runningToken = [{task: null}, {task: null}] // 执行任务所必须的token。有多少个就表示可以并发几个查询请求
        this.callback = callback
        this.requester = requester
    }

    /**
     * 添加拉取区块的任务
     * @param {number} fromHeight
     * @param {number} toHeight
     * @param {boolean} withBody
     */
    addFetchTasks(fromHeight, toHeight, withBody) {
        if (fromHeight > toHeight) {
            return
        }

        // fetchTasks is empty
        if (!this.fetchTasks.length) {
            this.fetchTasks = makeTasks(fromHeight, toHeight, !!withBody)
            this.tryRunNext()
            return
        }

        // fetchTasks is not empty
        const min = Math.min(fromHeight, this.fetchTasks[0].height)
        const max = Math.max(toHeight, this.fetchTasks[this.fetchTasks.length - 1].height)
        let index = 0
        const mergedTasks = makeTasks(min, max, false)
        mergedTasks.forEach(task => {
            if (index < this.fetchTasks.length && this.fetchTasks[index].height === task.height) {
                task.withBody = this.fetchTasks[index].withBody
                index++
            }
            if (task.height >= fromHeight && task.height <= toHeight) {
                task.withBody = task.withBody || !!withBody
            }
        })
        this.fetchTasks = mergedTasks

        this.tryRunNext()
    }

    /**
     * 根据高度拉块
     * @param {object} task
     * @param {number} task.height
     * @param {boolean} task.withBody
     */
    async fetchBlock(task) {
        try {
            const block = await this.requester.send(`${CHAIN_NAME}_getBlockByHeight`, [task.height, task.withBody])
            this.notify(task, block)
        } catch (e) {
            this.notify(task, null, e)
        }
    }

    notify(task, block, error) {
        if (!task.withBody) {
            this.callback({header: block.header}, error)
        } else {
            this.callback(block, error)
        }
    }

    tryRunNext() {
        this.runningToken.forEach(token => {
            if (!token.task) {
                this.next(token)
            }
        })
    }

    async next(token) {
        if (!this.fetchTasks.length) {
            // 执行结束
            token.task = null
            return
        }

        token.task = this.fetchTasks.shift()
        // console.log('run fetch task', JSON.stringify(token.task))

        try {
            await this.fetchBlock(token.task)
        } catch (e) {
            console.error(e)
        }

        // 执行下一个任务
        this.next(token)
    }
}

function makeTasks(fromHeight, toHeight, withBody) {
    const tasks = new Array(toHeight - fromHeight + 1)
    for (let i = fromHeight; i <= toHeight; i++) {
        tasks[i - fromHeight] = {height: i, withBody}
    }
    return tasks
}

export default BlockFetcher
