from brownie import network, config, TokenFarm, FarmToken
import os
import json
def create_context(token_farm,farm_token):
    token_farm_abi = token_farm.abi
    token_farm_address = token_farm.address
    farm_token_abi = farm_token.abi
    farm_token_address = farm_token.address
    erc20_abi = get_erc20_abi()

    weth_address = config["networks"][network.show_active()]["weth_token"]
    dai_address = config["networks"][network.show_active()]["dai_token"]
    context = {
        "token_farm": {
            "abi":token_farm_abi,
            "address": token_farm_address
        },
        "farm_token":{
            "abi":farm_token_abi,
            "address": farm_token_address
        },
        "weth":weth_address,
        "dai": dai_address,
        "erc20_abi": erc20_abi
    }
    return context
def get_erc20_abi():
    path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "build/contracts/dependencies/OpenZeppelin/openzeppelin-contracts@4.2.0/ERC20.json")
    with open(path,"r") as file:
        data = json.loads(file.read())
    return data["abi"]

def update_frontend(context):
    filename = "tokenfarm_data.json"
    path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),'frontend',"tokenfarm",'src')
    if os.path.exists(path):
        with open(os.path.join(path,filename),"w") as file:
            json.dump(context,file)
    return os.path.join(path,filename)
def main():
    token_farm = TokenFarm[-1]
    farm_token = FarmToken[-1]
    context = create_context(token_farm,farm_token)
    update_frontend(context)