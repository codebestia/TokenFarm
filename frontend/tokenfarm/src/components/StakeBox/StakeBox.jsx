import { useEffect, useState } from "react";
import {Card, Tabs, Slider, Button, message} from "antd";
import {  useContractFunction, useTokenBalance, useNotifications } from "@usedapp/core";
import token_data from "../../tokenfarm_data.json";
import {  formatUnits } from '@ethersproject/units';
import { useStakeTokens } from "../../hooks/usestake";
import "./stakebox.css";
import { utils } from "ethers";
const DAIStake = ({account})=>{
    const DAI = {
        address: token_data.dai
      }
      const userBalance = useTokenBalance(DAI.address,account);
    //   console.log(userBalance)
      const [balance, setBalance] = useState(0);
      const [stakeMinAmount, setStakeMinAmount] = useState(0);
      const [stakeMaxAmount, setStakeMaxAmount] = useState(100);
      const [stakeValue, setstakeValue] = useState(0);
      const {approve, approveErc20State} = useStakeTokens(DAI.address);
      const notification = useNotifications()
      
      const handleSubmit = ()=>{
        if(stakeValue <= 0){
            message.error("Staking Amount must be greater than 0");
            return
        }
        const amountInWei = utils.parseEther(stakeValue.toString());
        return approve(amountInWei.toString())
      }
      useEffect(()=>{
        if(userBalance !== undefined){
            setBalance(userBalance);
        setStakeMaxAmount(formatUnits(userBalance,18))
        }
        
    },[userBalance])
    // useEffect(()=>{
    //     if(approveErc20State == "Success"){
    //         s
    //     }
    // },[approveErc20State])
    useEffect(()=>{
        if(notification.notifications.filter((notification)=> notification.type==="transaction.Succeed" && 
        notification.transactionName === "Approve ERC20 transfer").length > 0){
            message.success("Token Transfer Approved");
        }
        if(notification.notifications.filter((notification)=> notification.type==="transaction.Succeed" && 
        notification.transactionName === "Stake Token").length > 0){
            message.success("Token Staked Successfully");
        }
    },[notification.notifications])
    
      return (<>
      <div className="details-box">
          <div>
              <div className="balance"><p>Your DAI Token balance: {userBalance !== undefined ? formatUnits(userBalance,18):0}</p></div>
              <div className="progress">
              <Slider
                  min={stakeMinAmount}
                  max={stakeMaxAmount}
                  onChange={setstakeValue}
                  value={typeof stakeValue === 'number' ? stakeValue : 0}
                  />
              </div>
              <div style={{textAlign:"center"}}>
                  <Button type="primary" onClick={handleSubmit} disabled={stakeValue == 0}> Stake </Button>
              </div>
          </div>
      </div>
      </>)
  
}
const WETHStake = ({account})=>{
    const WETH = {
        address: token_data.weth
      }
      const userBalance = useTokenBalance(WETH.address,account);
    //   console.log(userBalance)
      const [balance, setBalance] = useState(0);
      const [stakeMinAmount, setStakeMinAmount] = useState(0);
      const [stakeMaxAmount, setStakeMaxAmount] = useState(100);
      const [stakeValue, setstakeValue] = useState(0);
      const {approve, approveErc20State} = useStakeTokens(WETH.address);
      const notification = useNotifications()
      
      const handleSubmit = ()=>{
        if(stakeValue <= 0){
            message.error("Staking Amount must be greater than 0");
            return
        }
        const amountInWei = utils.parseEther(stakeValue.toString());
        return approve(amountInWei.toString())
      }
      useEffect(()=>{
        if(userBalance !== undefined){
            setBalance(userBalance);
        setStakeMaxAmount(formatUnits(userBalance,18))
        }
        
    },[userBalance])
    // useEffect(()=>{
    //     if(approveErc20State == "Success"){
    //         s
    //     }
    // },[approveErc20State])
    useEffect(()=>{
        if(notification.notifications.filter((notification)=> notification.type==="transaction.Succeed" && 
        notification.transactionName === "Approve ERC20 transfer").length > 0){
            message.success("Token Transfer Approved");
        }
        if(notification.notifications.filter((notification)=> notification.type==="transaction.Succeed" && 
        notification.transactionName === "Stake Token").length > 0){
            message.success("Token Staked Successfully");
        }
    },[notification.notifications])
    
      return (<>
      <div className="details-box">
          <div>
              <div className="balance"><p>Your WETH Token balance: {userBalance !== undefined ? formatUnits(userBalance,18):0}</p></div>
              <div className="progress">
              <Slider
                  min={stakeMinAmount}
                  max={stakeMaxAmount}
                  onChange={setstakeValue}
                  value={typeof stakeValue === 'number' ? stakeValue : 0}
                  />
              </div>
              <div style={{textAlign:"center"}}>
                  <Button type="primary" onClick={handleSubmit} disabled={stakeValue == 0}> Stake </Button>
              </div>
          </div>
      </div>
      </>);
}
const FarmToken = ({account})=>{
    const FarmTokenDetails = {
        address : token_data.farm_token.address,
    }
    const userBalance = useTokenBalance(FarmTokenDetails.address, account);    
    return (<>
    <div className="details-box">
        <div>
            <div className="balance"><p>Your Farm Token balance: {userBalance !== undefined ? formatUnits(userBalance,18):0}</p></div>
        </div>
    </div>
    </>)
}

const StakeBox = ({account}) => {
    const items = [
        {
          key: '1',
          label: 'DAI',
          children: <DAIStake account={account} />,
        },
        {
          key: '2',
          label: 'Weth',
          children: <WETHStake account={account} />,
        },
        {
          key: '3',
          label: 'FARM',
          children: <FarmToken account={account} />,
        },
      ];
    return (  
        <div>
        <Card
            title="YOUR WALLET"
            bordered={false}
            style={{
            width: "100%",
            padding: 10
            }}

        >
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
        </div>
    );
}
 
export default StakeBox;