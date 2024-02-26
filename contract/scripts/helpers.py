from brownie import network, accounts, config, MockDai,MockWeth, MockV3Aggregator

LOCAL_DEVELOPEMENT_ENV = [
    "development","mainnet-fork"
]


def get_account(env_account = True):
    if network.show_active() == "development":
        account = accounts[0]
    else:
        if env_account:
            account = accounts.add(config['wallets']['from'])
        else:
            account = accounts.load("mainaddress")
    return account

token_mocks = {
    "dai": MockDai,
    "weth": MockWeth
}
aggregator_mocks = {
    "weth_aggregator": MockV3Aggregator,
    "dai_aggregator": MockV3Aggregator,
}
def deploy_token_mocks(account = None):
    account = account if account else get_account()
    print("Deploying Token Mocks")
    deploys = {

    }
    for token_name in token_mocks:
        if len(token_mocks[token_name]) > 0:
            tx = token_mocks[token_name][-1]
        else:
            print(f"Deploying {token_name.upper()} Mock Token")
            tx = token_mocks[token_name].deploy({"from":account})  
            print(f"{token_name} Mock Deployed")
        deploys[token_name] = tx
      
    print("All Token Mocks Deployed")
    return deploys
def deploy_aggregator_mocks(account = None):
    account = account if account else get_account()
    deploys = {
         
    }
    INITIAL_DECIMAL = 8
    INITIAL_PRICE = 100000000000
    for aggregator_name in aggregator_mocks:
        if len(aggregator_mocks[aggregator_name]) > 0:
            tx = aggregator_mocks[aggregator_name][-1]
        else:
            print(f"Deploying {aggregator_name.upper()} Mock Aggregator")
            tx = aggregator_mocks[aggregator_name].deploy(INITIAL_DECIMAL,INITIAL_PRICE,{"from":account})  
            print(f"{aggregator_name} Mock Deployed")
        deploys[aggregator_name] = tx
        
    print("Deploying Aggregator Mocks")
    return deploys

def deploy_mocks(account = None):
    account = account if account else get_account()
    aggregator_mocks = deploy_aggregator_mocks(account)
    token_mocks = deploy_token_mocks(account)
    print("all mocks deployed")
    return {**aggregator_mocks,**token_mocks} 
    