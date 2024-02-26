# Token Farm

A Decentralized application built with solidity for the smart contracts and react for the frontend. it is an application where users stake any amount of the tokens they have (dai or weth) token and they are given farm token (the native app token) in intervals based on the value of the amount of the token staked. Users can stake both dai and weth. The smart contract of this application is deployed to the goerli blockchain.


## Prerequisites
Please install or have installed the below program:

- [Python and pip](https://nodejs.org/en/download/)
- [nodejs and npm](https://nodejs.org/en/download/)

## Installation

1. [Install Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html), if you haven't already. Here is a simple way to install brownie.

```bash
pip install eth-brownie
```
Or, if that doesn't work, via pipx
```bash
pip install --user pipx
pipx ensurepath
# restart your terminal
pipx install eth-brownie
```
2. Clone this repo
```
# open your terminal
git clone https://github.com/codebestia/TokenFarm.git
cd tokenfarm
cd contract
```

3. [Install ganache-cli](https://www.npmjs.com/package/ganache-cli)

```bash
npm install -g ganache-cli
```
If you want to be able to deploy to testnets, do the following. 

4. Set your environment variables

Set your `WEB3_INFURA_PROJECT_ID`, and `PRIVATE_KEY` [environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html). 

You can get a `WEB3_INFURA_PROJECT_ID` by getting a free trial of [Infura](https://infura.io/). At the moment, it does need to be infura with brownie. You can find your `PRIVATE_KEY` from your ethereum wallet like [metamask](https://metamask.io/). 

You'll also need testnet Goerli ETH and FAU or WETH. You can get ETH into your wallet by using the [Goerli faucets located here](https://faucets.chain.link/goerli). You can get FAU into your wallet by using the [FAU faucets located here](https://erc20faucet.com/).

You'll also want an [Etherscan API Key](https://etherscan.io/apis) to verify your smart contracts. 

Create a .env file in the contract directory and add your environment variables to the `.env` file:

```
export WEB3_INFURA_PROJECT_ID=<PROJECT_ID>
export PRIVATE_KEY=<PRIVATE_KEY>
export ETHERSCAN_TOKEN=<YOUR_TOKEN>
```
> DO NOT SEND YOUR KEYS TO GITHUB
> If you do that, people can steal all your funds. Ideally use an account with no real money in it. 


Then, make sure your `brownie-config.yaml` has:

```
dotenv: .env
```
5. Install the React frontend dependencies
```
# open a terminal in tokenfarm directory
cd tokenfarm
cd frontend
cd tokenfarm
npm install
```


## Usage/Examples
1. In the contract directory, compile the smart contract code
```
brownie compile
```
2. Deploy and run scripts for initial setup
```
brownie run scripts/deploy.py --network goerli
brownie run scripts/add_accepted_tokens.py --network goerli
```
3. Navigate to the frontend/tokenfarm directory and start the frontend
```
cd frontend
cd tokenfarm
npm run dev
```

You can now interact with the dapp application. try staking and unstaking your tokens.

To Issue tokens to Staker run
```
brownie run scripts/issue_tokens.py --network goerli
```
Check the balance of the staker farm token, it should have increased.

*Note*: I am using fau token as my dai token for this project, since it is easy to acquire the faucet.

## Screenshots

![Start Image](https://res.cloudinary.com/ds81lsf2c/image/upload/v1708990378/tokenfarm1_xmwxks.jpg)

![Second Image](https://res.cloudinary.com/ds81lsf2c/image/upload/v1708990378/tokenfarn2_apwjvs.jpg)

![Third Image](https://res.cloudinary.com/ds81lsf2c/image/upload/v1708990378/tokenfarm2_mnqviq.jpg)