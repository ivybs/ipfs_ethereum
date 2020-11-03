// the file name need to notice the number 2,since the file will be excute after 1_initial_migration.js
// tell truffle to put the meme smart contract on the blockchain
const Meme = artifacts.require("Meme");

module.exports = function(deployer) {
    deployer.deploy(Meme);
};
