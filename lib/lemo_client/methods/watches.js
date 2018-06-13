/*
    This file is part of lemo_client.

    lemo_client is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    lemo_client is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with lemo_client.  If not, see <http://www.gnu.org/licenses/>.
*/

var Method = require('../method');

/// @returns an array of objects describing lemoClient.lemo.filter api methods
var lemo = function () {
    var newFilterCall = function (args) {
        var type = args[0];

        switch(type) {
            case 'latest':
                args.shift();
                this.params = 0;
                return 'lemo_newBlockFilter';
            case 'pending':
                args.shift();
                this.params = 0;
                return 'lemo_newPendingTransactionFilter';
            default:
                return 'lemo_newFilter';
        }
    };

    var newFilter = new Method({
        name: 'newFilter',
        call: newFilterCall,
        params: 1
    });

    var uninstallFilter = new Method({
        name: 'uninstallFilter',
        call: 'lemo_uninstallFilter',
        params: 1
    });

    var getLogs = new Method({
        name: 'getLogs',
        call: 'lemo_getFilterLogs',
        params: 1
    });

    var poll = new Method({
        name: 'poll',
        call: 'lemo_getFilterChanges',
        params: 1
    });

    return [
        newFilter,
        uninstallFilter,
        getLogs,
        poll
    ];
};

/// @returns an array of objects describing lemoClient.shh.watch api methods
var shh = function () {

    return [
        new Method({
            name: 'newFilter',
            call: 'shh_newMessageFilter',
            params: 1
        }),
        new Method({
            name: 'uninstallFilter',
            call: 'shh_deleteMessageFilter',
            params: 1
        }),
        new Method({
            name: 'getLogs',
            call: 'shh_getFilterMessages',
            params: 1
        }),
        new Method({
            name: 'poll',
            call: 'shh_getFilterMessages',
            params: 1
        })
    ];
};

module.exports = {
    lemo: lemo,
    shh: shh
};

