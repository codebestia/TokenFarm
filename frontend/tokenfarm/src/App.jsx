import { useState } from 'react'
import './App.css'
import {Button, Card} from "antd";
import StakeBox from './components/StakeBox/StakeBox';
import { useEtherBalance, useEthers, Goerli, useConfig } from '@usedapp/core'

import {sliceAddress} from "./utils";
import UnStakeBox from './components/UnStakeBox/UnStakeBox';


function App() {
  const { account, deactivate, activateBrowserWallet, chainId, library } = useEthers();
  console.log(library)
  const config = useConfig();
  if(chainId && !config.readOnlyUrls[chainId]){
    <div style={{minHeight:"80vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Card style={{width: 400}}>
            <h2 style={{textAlign:"center"}}>Connect your Wallet. Use Goerli Eth Network</h2>  
          </ Card>
    </div>
  }
  return (
    <div>
      <div className='nav'>
        <div>
          <h2>TOKENFARM</h2>
        </div>
        <div>
          <div>
            {account ? (
              <>
                <Button type='primary' style={{marginRight:10}}>{sliceAddress(account)}</Button>
                <Button type='primary' danger onClick={() => deactivate()} >Disconnect Wallet</Button>
              </>
              
            ):(
              <Button type='primary' onClick={() => activateBrowserWallet()} >Connect Wallet</Button>
            )}
          </div>
          
        </div>
      </div>
      <div className='page-container'>
        {account?(
          <>
            <StakeBox account={account} />
            <UnStakeBox account={account} />
          </>
        ):(
          <div style={{minHeight:"80vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Card style={{width: 400}}>
            <h2 style={{textAlign:"center"}}>Connect your Wallet. Use Goerli Eth Network</h2>  
          </ Card>
          </div>
          
        )}
          
      </div>
    </div>
  )
}

export default App
