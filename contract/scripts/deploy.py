from brownie import network, config, TokenFarm, FarmToken
from scripts.helpers import get_account, LOCAL_DEVELOPEMENT_ENV
from scripts.update_frontend_data import create_context, update_frontend
from web3 import Web3


def deploy():
    """
    Steps for Deployment:
    - get account
    - deploy farmtoken
    - deploy tokenfarm
    - transfer farmtokens to tokenfarm contract
    - update frontend data if network is not development
    """
    account = get_account()
    verify = config["networks"][network.show_active()]["verify"]
    # Deploy Farm token
    print("Deploying Farm Token")
    farm_token = FarmToken.deploy({'from':account})
    print(f"Deployed FarmToken at {farm_token.address}")

    print("Deploying TokenFarm Contract")
    token_farm = TokenFarm.deploy(farm_token.address,{'from':account})
    print(f"Deployed TokenFarm Contract at {token_farm.address}")
    
    amount_to_keep = Web3.toWei(100,"ether")
    amount_to_transfer = farm_token.totalSupply() - amount_to_keep

    print(f"Transferring {Web3.fromWei(amount_to_transfer,'ether')} FarmToken to TokenFarm Contract")
    tx = farm_token.transfer(token_farm.address,amount_to_transfer,{"from":account})
    tx.wait(1)
    print("Transfer Successful")
    if network.show_active() not in LOCAL_DEVELOPEMENT_ENV:
        print("Updating Frontend Data....")
        context = create_context(token_farm,farm_token)
        path = update_frontend(context)
        print(f"Frontend Data Updated at {path}")
    print("Deploy Program Executed")
    return token_farm


def main():
    deploy()