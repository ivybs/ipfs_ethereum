import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Meme from '../abis/Meme.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host:'ipfs.infura.io',port:5001,protocol:'https'})

class App extends Component {
  // this function happens before the render function and after the constractor function
  // see the react life cyc
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  // get the account
  // get the network
  // get smart contract
  // --> ABI  which is same after smart contract is complied   Meme.abi
  // --> Address  mean which chain we're going to connect      networkData.address
  //     in abi file:   "networks":{"networkid":{"address":"0x69C4a933F2E262E550478eBAFb51D5a15c18f0BD"}}
  // get meme hash
  async loadBlockchainData(){
    const web3 = window.web3
    const account = await web3.eth.getAccounts()
    console.log(account)
    this.setState({account:account[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if (networkData){
      // fetch the contract
      const abi = Meme.abi
      const address = networkData.address
      const contract = web3.eth.Contract(Meme.abi,networkData.address)
      this.setState({contract: contract})
      // 等于是 将文件哈希放在了智能合约里面，智能合约又是部署在区块链上的
      // 也就是说将数据存在了区块链上
      const memeHash = await contract.methods.get().call()
      this.setState({memeHash:memeHash})
    }else{
      window.alert('Smart contract not deployed to detected network')
    }
  }


  //构造器
  constructor(props){
    super(props);
    this.state = {
      buffer: null,
      memeHash:'',
      account:'',
      contract: null
    };
  }
  // 在浏览器中加载web3实例
  async loadWeb3(){
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('Please use metamask')
    }
  }

  captureFile = (event) => {
    // event都有自己的默认处理
    // event.preventDefault() 将不调用默认使用的处理方式
    // overwrite一下event的处理方式
    event.preventDefault()
    // process file for ipfs
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      // console.log('buffer',Buffer(reader.result))
      this.setState({buffer:Buffer(reader.result)})
    }
  }

  // Example hash: QmbiAU7SqLQWR6n1mg2FDEv4of6r4co3LgvmPLqXNtkCrs
  // Example url: https://ipfs.infura.io/ipfs/QmbiAU7SqLQWR6n1mg2FDEv4of6r4co3LgvmPLqXNtkCrs
  submitFile = (event) => {
    event.preventDefault()
    // console.log('submitting')
    // add file to ipfs
    ipfs.add(this.state.buffer,(err,res)=>{
      // do stuff here
      const memeHash = res[0].hash
      this.setState({memeHash: memeHash})
      if (err){
        console.log(err)
        return
      }

      //Step2: store file on blockchain
      let accountI = this.state.account
      console.log('submittin')
      console.log(accountI)
      this.state.contract.methods.set(memeHash).send({from: accountI})
          .then((r) => {
            this.setState({memeHash:memeHash})
          })
    })

  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>

            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} className="App-logo" alt="logo" />
                </a>
                <p>&nbsp;</p>
                <h2>Change meme</h2>
                <form onSubmit={this.submitFile}>
                  <input type='file' onChange={this.captureFile}></input>
                  <input type='submit' ></input>
                </form>
   
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
