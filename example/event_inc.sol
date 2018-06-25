pragma solidity ^0.4.6;

contract Contract {
    uint public x;

    event Incremented(bool indexed odd, uint x);

    constructor() public {
        x = 70;
    }

    function inc() public {
        ++x;
        emit Incremented(x % 2 == 1, x);
    }
}
