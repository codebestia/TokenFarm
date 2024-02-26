from brownie import network, config, TokenFarm, FarmToken, interface
from scripts.helpers import get_account, LOCAL_DEVELOPEMENT_ENV, deploy_mocks
from scripts.deploy import deploy
from web3 import Web3
"""
In this script, we are going to interact with the deployed contract. 
"""

def add_accepted_tokens():
    """
    This will interact with the addAcceptedToken function of the TokenFarm Contract
    Steps:
    - get addresses for dai and weth tokens
    - get or deploy tokenfarm contract
    - add address to addAcceptedToken function of the TokenFarm Contract
    - show acceptedToken list from TokenFarm Contract
    """
    print("Add Accepted Tokens Program".center(20,"-"))
    account = get_account()

    if network.show_active() in LOCAL_DEVELOPEMENT_ENV:
        mock_contracts = deploy_mocks()
        dai_token_address = mock_contracts['dai']
        dai_aggregator = mock_contracts['dai_aggregator']
        weth_token_address = mock_contracts['weth']
        weth_aggregator = mock_contracts['weth_aggregator']
    else:

        dai_token_address = config['networks'][network.show_active()]['dai_token']
        dai_aggregator = config['networks'][network.show_active()]['dai_usd_price_feed']
        weth_token_address = config['networks'][network.show_active()]['weth_token']
        weth_aggregator = config['networks'][network.show_active()]['eth_usd_price_feed']
    
    addresses = {"dai":[dai_token_address,dai_aggregator], "weth":[weth_token_address,weth_aggregator]}
    if len(TokenFarm) == 0:
        print("Deploying TokenFarm Contract")
        tokenfarm = deploy()
    else:
        tokenfarm = TokenFarm[-1]
    for address in addresses:
        print(f"Adding {address} token address to accepted token addresses of TokenFarm")
        tx = tokenfarm.addAcceptedToken(*addresses[address],{"from":account})
        tx.wait(1)
        print(f"{address} token address added")
    
    print("Showing List of Accepted token addresses")
    print(tokenfarm.getAcceptedTokens())

def stake_tokens():
    """
    This will interact with the stakeToken function of the TokenFarm Contract
    Steps:
    - get addresses for dai and weth tokens
    - get or deploy tokenfarm contract
    - add token in staking pool
    """
    print("Stake Token Program".center(20,"-"))
    account = get_account()
    if network.show_active() in LOCAL_DEVELOPEMENT_ENV:
        mock_contracts = deploy_mocks()
        dai_token_address = mock_contracts['dai']
        weth_token_address = mock_contracts['weth']
    else:
        dai_token_address = config['networks'][network.show_active()]['dai_token'] 
        weth_token_address = config['networks'][network.show_active()]['weth_token']
    
    addresses = {"dai":[dai_token_address, Web3.toWei(0.1,"ether")], "weth":[weth_token_address,Web3.toWei(1,"ether")]}
    if len(TokenFarm) == 0:
        print("Deploying TokenFarm Contract")
        tokenfarm = deploy()
    else:
        tokenfarm = TokenFarm[-1]

    # Stake all the tokens to the staking pool
    for address in addresses:
        print(f"staking {addresses[address][1]} of {address} token to tokenFarm")
        print(f"Approving Token Transfer")
        erctx = interface.IERC20(addresses[address][0]).approve(tokenfarm.address,addresses[address][1],{"from":account})
        erctx.wait(1)
        print("Approved")
        print("Staking Token")
        tx = tokenfarm.stakeToken(*addresses[address],{"from":account})
        tx.wait(1)
        print(f"{address} staked")
    
    # get the staked amount from the smart contract
    print("Getting all staked token balance")
    for address in addresses:
        amount = get_staked_amount(tokenfarm,addresses[address][0],account)
        print(f"{amount} of {address} staked")
    
def unstake_tokens():
    """
    This will interact with the unStakeToken function of the TokenFarm Contract
    Steps:
    - get addresses for dai and weth tokens
    - get or deploy tokenfarm contract
    - remove token in staking pool
    """
    print("Unstake Token Program".center(20,"-"))
    account = get_account()
    if network.show_active() in LOCAL_DEVELOPEMENT_ENV:
        mock_contracts = deploy_mocks()
        dai_token_address = mock_contracts['dai']
        weth_token_address = mock_contracts['weth']
    else:
        dai_token_address = config['networks'][network.show_active()]['dai_token'] 
        weth_token_address = config['networks'][network.show_active()]['weth_token']
    addresses = {"dai":dai_token_address, "weth":weth_token_address}
    if len(TokenFarm) == 0:
        print("Deploying TokenFarm Contract")
        tokenfarm = deploy()
    else:
        tokenfarm = TokenFarm[-1]
    for address in addresses:
        print(f"Unstaking {address} token from staking pool")
        tx = tokenfarm.unStakeToken(addresses[address],{"from":account})
        tx.wait(1)
        print(f"{address} token unstaked")

    # verify that all the token as been unstaked
    print("Getting all staked token balance")
    for address in addresses:
        amount = get_staked_amount(tokenfarm,addresses[address],account)
        print(f"{amount} of {address} staked")

def issue_farm_token():
    """
    This will interact with the issueToken function of the TokenFarm Contract.
    This is for issuing the farm token for all the users that have staked.
    ### Steps:
    - get  farmtoken contract
    - get or deploy tokenfarm contract
    - get the previous farm token balance of all stakers
    - call the issueToken function of the contract
    - get the new token balance of all stakers.
    """
    print("Issue Token Program".center(20,"-"))
    account = get_account()
    if len(TokenFarm) == 0:
        print("Deploying TokenFarm Contract")
        tokenfarm = deploy()
    else:
        tokenfarm = TokenFarm[-1]
    # get initial staker farm token balance
    stakers = tokenfarm.getStakers()
    for staker in stakers:
        get_stakers_tokens_value(tokenfarm,staker)
    print("Getting FarmToken Balance of all Stakers")
    get_stakers_farm_token_balance(stakers)
    print("Getting Farm token balance of Token Farm contract")
    get_contract_farm_token_balance()
    # issue token
    print("Issuing Token")
    tx = tokenfarm.issueTokens({"from":account})
    tx.wait(1)
    print("FarmTokens Issued")
    print("Getting new FarmToken Balance of all stakers")
    get_stakers_farm_token_balance(stakers)
    
def get_stakers_farm_token_balance(stakers):
    farm_token = FarmToken[-1]
    staker_to_balance = dict()
    for staker in stakers:
        balance = farm_token.balanceOf(staker)
        print(f"The farm token balance of staker with address {staker} is",
              Web3.fromWei(balance,"ether"))
        staker_to_balance[str(staker)] = balance
    return staker_to_balance 

def get_staked_amount(token_farm, token,account):
    amount = token_farm.getStakedTokenAmount(account.address,token)
    return Web3.fromWei(amount,"ether")
def get_stakers_tokens_value(token_farm,staker):
    balance = token_farm.getStakerTokensValue(staker)
    print(f"Balance of Staker {staker} is {Web3.fromWei(balance,'ether')}")
    return balance
def get_contract_farm_token_balance(account = None):
    account = account if account else get_account()
    token_farm = TokenFarm[-1]
    farm_token = FarmToken[-1]
    print("Getting Token Farm Contract Farm Token ")
    balance = farm_token.balanceOf(token_farm.address)
    print(f"The Balance is {Web3.fromWei(balance,'ether')}")
    return balance    

def main():
    add_accepted_tokens()
    stake_tokens()
    issue_farm_token()
    unstake_tokens()
    print("Program successfully completed...")