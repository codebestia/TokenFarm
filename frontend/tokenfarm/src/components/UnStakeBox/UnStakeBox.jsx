import { useEffect, useState } from "react";
import {Card, Tabs, Button, message} from "antd";
import { useTokenBalance, useNotifications } from "@usedapp/core";
import token_data from "../../tokenfarm_data.json";
import {  formatUnits } from '@ethersproject/units';
import { useUnStakeToken, useGetStakedToken } from "../../hooks/usestake";
import "./unstakebox.css";
import { utils } from "ethers";
const DAIStake = ({account})=>{
    const DAI = {
        address: token_data.dai
      }
      const {value} = useGetStakedToken(DAI.address)
      const notification = useNotifications()
      const [unStakeState, setUnStakeState] = useState(null);
      const [disabled, setDIsabled] = useState(true);
      const [loading, setLoading] = useState(false);
      const {unStakeToken,stakeState} = useUnStakeToken(DAI.address);

      const handleSubmit = ()=>{
        setLoading(true);
        unStakeToken()
        setUnStakeState(stakeState);
      }
    useEffect(()=>{
        if(value !== undefined && formatUnits(value[0],18) != 0){
            setDIsabled(false)
        }else{
            setDIsabled(true)
        }
    },[value, unStakeState])
    useEffect(()=>{
        setLoading(false);
        if(unStakeState?.state == "Success"){
            message.success("Unstake Successful");
        }
    },[unStakeState])
    useEffect(()=>{
        if(notification.notifications.filter((notification)=> notification.type==="transaction.Succeed" && 
        notification.transactionName === "Unstake Token").length > 0){
            message.success("Unstake Successful");
        }
    },[notification.notifications])
    
      return (<>
      <div className="details-box">
          <div>
              <div className="balance"><p>Your Staked DAI Token balance: {value !== undefined? formatUnits(value[0],18) :0}</p></div>
              <div style={{textAlign:"center"}}>
                  <Button type="primary" onClick={handleSubmit} loading={loading} disabled={disabled}> UnStake </Button>
              </div>
          </div>
      </div>
      </>)
  
}
const WETHStake = ({account})=>{
    const WETH = {
        address: token_data.weth
      }
      const {value} = useGetStakedToken(WETH.address);
      const notification = useNotifications()
      const [unStakeState, setUnStakeState] = useState(null);
      const [disabled, setDIsabled] = useState(true);
      
    //   console.log(stakedToken)
      const handleSubmit = ()=>{
        const {stakeState} = useUnStakeToken(WETH.address);
        setUnStakeState(stakeState);
      }
    useEffect(()=>{
        if(value !== undefined && formatUnits(value[0],18) != 0){
            setDIsabled(false);
        }
    },[value])
    useEffect(()=>{
        if(unStakeState?.state == "Success"){
            message.success("Unstake Successful");
        }
    },[unStakeState])
    useEffect(()=>{
        if(notification.notifications.filter((notification)=> notification.type==="transaction.Succeed" && 
        notification.transactionName === "Unstake Token").length > 0){
            message.success("Unstake Successful");
        }
    },[notification.notifications])
    
      return (<>
      <div className="details-box">
          <div>
              <div className="balance"><p>Your Staked WETH Token balance: {value !== undefined? formatUnits(value[0],18) :0}</p></div>
              <div style={{textAlign:"center"}}>
                  <Button type="primary" onClick={handleSubmit} disabled={disabled}> UnStake </Button>
              </div>
          </div>
      </div>
      </>)
}

const UnStakeBox = ({account}) => {
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
      ];
    // console.log(account);
    const onChange = ()=>{

    }
    return (  
        <div style={{marginTop: 50}}>
        <Card
            title="YOUR STAKES"
            bordered={false}
            style={{
            width: "100%",
            padding: 10
            }}

        >
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Card>
        </div>
    );
}
 
export default UnStakeBox;