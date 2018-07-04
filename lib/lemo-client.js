/*!
 * lemo-client - Lemochain JavaScript API
 *
 * @license lgpl-3.0
*/

/*
 * This file is part of lemo-client.
 *
 * lemo-client is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * lemo-client is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with lemo-client.  If not, see <http://www.gnu.org/licenses/>.
 */

var RequestManager = require('./lemo-client/requestmanager');
var Iban = require('./lemo-client/iban');
var Lemo = require('./lemo-client/methods/lemo');
var DB = require('./lemo-client/methods/db');
var Net = require('./lemo-client/methods/net');
var Personal = require('./lemo-client/methods/personal');
var Settings = require('./lemo-client/settings');
var version = require('./version.json');
var utils = require('./utils/utils');
var sha3 = require('./utils/sha3');
var extend = require('./lemo-client/extend');
var Batch = require('./lemo-client/batch');
var Property = require('./lemo-client/property');
var HttpProvider = require('./lemo-client/httpprovider');
var IpcProvider = require('./lemo-client/ipcprovider');
var BigNumber = require('bignumber.js');



function LemoClient (provider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this.lemo = new Lemo(this);
    this.db = new DB(this);
    this.net = new Net(this);
    this.personal = new Personal(this);
    this.settings = new Settings();
    this.version = {
        api: version.version
    };
    this.providers = {
        HttpProvider: HttpProvider,
        IpcProvider: IpcProvider
    };
    this._extend = extend(this);
    this._extend({
        properties: properties()
    });
}

// expose providers on the class
LemoClient.providers = {
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider
};

LemoClient.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

LemoClient.prototype.reset = function (keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
};

LemoClient.prototype.BigNumber = BigNumber;
LemoClient.prototype.toHex = utils.toHex;
LemoClient.prototype.toAscii = utils.toAscii;
LemoClient.prototype.toUtf8 = utils.toUtf8;
LemoClient.prototype.fromAscii = utils.fromAscii;
LemoClient.prototype.fromUtf8 = utils.fromUtf8;
LemoClient.prototype.toDecimal = utils.toDecimal;
LemoClient.prototype.fromDecimal = utils.fromDecimal;
LemoClient.prototype.toBigNumber = utils.toBigNumber;
LemoClient.prototype.toWei = utils.toWei;
LemoClient.prototype.fromWei = utils.fromWei;
LemoClient.prototype.isAddress = utils.isAddress;
LemoClient.prototype.isChecksumAddress = utils.isChecksumAddress;
LemoClient.prototype.toChecksumAddress = utils.toChecksumAddress;
LemoClient.prototype.isIBAN = utils.isIBAN;
LemoClient.prototype.padLeft = utils.padLeft;
LemoClient.prototype.padRight = utils.padRight;


LemoClient.prototype.sha3 = function(string, options) {
    return '0x' + sha3(string, options);
};

/**
 * Transforms direct icap to address
 */
LemoClient.prototype.fromICAP = function (icap) {
    var iban = new Iban(icap);
    return iban.address();
};

var properties = function () {
    return [
        new Property({
            name: 'version.node',
            getter: 'lemoClient_clientVersion'
        }),
        new Property({
            name: 'version.network',
            getter: 'net_version',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.lemochain',
            getter: 'lemo_protocolVersion',
            inputFormatter: utils.toDecimal
        })
    ];
};

LemoClient.prototype.isConnected = function(){
    return (this.currentProvider && this.currentProvider.isConnected());
};

LemoClient.prototype.createBatch = function () {
    return new Batch(this);
};

module.exports = LemoClient;

