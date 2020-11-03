import React, { Component } from 'react';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host:'ipfs.infura.io',port:5001,protocol:'https'})

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      buffer: null,
      memeHash:'QmbiAU7SqLQWR6n1mg2FDEv4of6r4co3LgvmPLqXNtkCrs'
    };
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
