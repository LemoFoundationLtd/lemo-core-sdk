pragma solidity ^0.4.6;

contract test {
    function take(uint[] a, uint b) public pure returns (uint d) {
        return a[b];
    }
}
