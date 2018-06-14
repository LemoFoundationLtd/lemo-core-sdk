/*
    This file is part of lemo-client.

    lemo-client is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    lemo-client is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with lemo-client.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Utils
 *
 * @module utils
 */

/**
 * Utility functions
 *
 * @class [utils] config
 * @constructor
 */


/// required to define ETH_BIGNUMBER_ROUNDING_MODE
var BigNumber = require('bignumber.js');

var ETH_UNITS = [
    'wei',
    'kwei',
    'Mwei',
    'Gwei',
    'szabo',
    'finney',
    'femtolemo',
    'picolemo',
    'nanolemo',
    'microlemo',
    'millilemo',
    'nano',
    'micro',
    'milli',
    'lemo',
    'grand',
    'Mlemo',
    'Glemo',
    'Tlemo',
    'Plemo',
    'Elemo',
    'Zlemo',
    'Ylemo',
    'Nlemo',
    'Dlemo',
    'Vlemo',
    'Ulemo'
];

module.exports = {
    ETH_PADDING: 32,
    ETH_SIGNATURE_LENGTH: 4,
    ETH_UNITS: ETH_UNITS,
    ETH_BIGNUMBER_ROUNDING_MODE: { ROUNDING_MODE: BigNumber.ROUND_DOWN },
    ETH_POLLING_TIMEOUT: 1000/2,
    defaultBlock: 'latest',
    defaultAccount: undefined
};

