const Meme = artifacts.require("Meme")

require('chai')
    .use(require('chai-as-promised'))
    .should()
contract('Meme',(account) => {
    // write test here
    let meme

    // exceute before every test
    before(async () => {
        meme = await Meme.deployed()
    })
    describe('deployment', async () =>{
        it('deploys successfully', async () => {
            const address = meme.address
            assert.notEqual(address,'')
        });

    })


    describe('storage', async () =>{
        it('updates the memeHash', async ()=>{
            let memeHash
            memeHash = 'abc123'
            await meme.set(memeHash)
            const result = await meme.get()
            assert.equal(result,memeHash)

        });
    })
})