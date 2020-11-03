pragma solidity ^0.5.0;

contract Meme{
    // Smart Contract Code Goes Here
    string memeHash;
    // Read Function
    function set(string memory _memeHash) public {
        memeHash = _memeHash;
    }
    // Write Function
    function get() public view returns(string memory){
        return memeHash;
    }


}