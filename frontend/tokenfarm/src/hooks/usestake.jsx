import { constants, utils, Contract } from "ethers";
import token_data from "../tokenfarm_data.json";
import { useEthers, useTokenBalance, useContractFunction, useCall } from "@usedapp/core";
import { useState, useEffect } from "react";
import { message } from "antd";

const tokenFarmAbi = token_data.token_farm.abi;
const tokenFarmAddress = token_data.token_farm.address;
const tokenFarmInterface = new utils.Interface(tokenFarmAbi);
const tokenFarmContract = new Contract(tokenFarmAddress,tokenFarmInterface);

export const useStakeTokens = (tokenAddress)=>{
    // abi
    //address
    // approve tokens
    // stake token
    const erc20Abi = token_data.erc20_abi;
    const erc20Interface = new utils.Interface(erc20Abi);
    const erc20Contract = new Contract(tokenAddress,erc20Interface);

    const [stakingAmount, setStakingAmount] = useState(0);
    

    const {send: approveErc20Send, state: approveErc20State} = useContractFunction(erc20Contract,"approve",
    {transactionName:"Approve ERC20 transfer"});
    const {send: stakeSend, state: stakeState} = useContractFunction(tokenFarmContract,"stakeToken",
    {transactionName:"Stake Token"});

    const approve = (amount)=>{
        setStakingAmount(amount);
        return approveErc20Send(tokenFarmAddress,amount);
    }
    useEffect(()=>{
        if(approveErc20State.status == "Success"){
            stakeSend(tokenAddress,stakingAmount,{gasLimit: 1000000,gasPrice: 100000});
        }
    },[approveErc20State])
    return {approve,approveErc20State}
}

export const useGetStakedToken = (tokenAddress)=>{
    const {account} = useEthers();
    const [stakedAmount, setStakedAmount] = useState(undefined);
    const {value,error} = useCall(tokenAddress && {
        contract: tokenFarmContract,
        method: "getStakedTokenAmount",
        args: [account,tokenAddress]
      }) ?? {}
      if(error){
        message.error("Error occurred in getting balance")
      }
    return {value}   
}
export const useUnStakeToken = (tokenAddress)=>{
    const {send: unStake, state: stakeState} = useContractFunction(tokenFarmContract,"unStakeToken",
    {transactionName:"Stake Token"});
    const unStakeToken = ()=>{
        unStake(tokenAddress);
    }
    
    return {unStakeToken,stakeState}
}