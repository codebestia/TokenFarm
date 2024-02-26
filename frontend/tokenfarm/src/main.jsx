import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Goerli } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { getDefaultProvider } from 'ethers';
import './index.css'

const SEPOLIA_PROVIDER = "https://sepolia.infura.io/v3/bca84c0ea3d748b3b0d5c6023e4a3039";
const GOERLI_PROVIDER = "https://goerli.infura.io/v3/bca84c0ea3d748b3b0d5c6023e4a3039";

const config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: GOERLI_PROVIDER,
  },
  notification:{
    checkInterval: 1000,
    expirationPeriod: 1000

  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
)
