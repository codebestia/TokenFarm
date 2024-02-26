// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable{
    //Stake Token
    // Issue Farm Token
    // Unstake Token
    // get Token Value
    // add Accepted Token

    address[] public acceptedTokens;
    mapping(address => uint256) uniqueTokenStaked;
    address[] public stakers;
    mapping(address => mapping(address => uint256)) stakerTokenBalance;
    mapping(address => address) tokenToPriceFeed;
    uint256 rewardDistributionCounter;
    IERC20 public farmToken;

    //Events
    event rewardDistributionCounterEvent(uint256, uint256);

    constructor (address _farmTokenAddress) public {
        farmToken = IERC20(_farmTokenAddress);
        rewardDistributionCounter = 0;
    }
    function stakeToken(address _tokenAddress, uint256 _tokenAmount) public{
        // Check whether token is in allowed tokens
        // Add unique token
        require(tokenIsAccepted(_tokenAddress),"Token is not accepted ");
        require(_tokenAmount > 0,"Token amount must be more than 0");
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this),_tokenAmount);
        updateUniqueToken(msg.sender,_tokenAddress);
        stakerTokenBalance[msg.sender][_tokenAddress]  = stakerTokenBalance[msg.sender][_tokenAddress] + _tokenAmount;
        if(uniqueTokenStaked[msg.sender] == 1){
            stakers.push(msg.sender);
        }

    }
    function issueTokens() public onlyOwner {
        // get the priice value all user's staked token
        // issue farmtoken amount that matches the price staked
        uint256 amountOfTokenIssued = 0;
        for(uint256 stakersIndex = 0; stakersIndex < stakers.length; stakersIndex++){
            uint256 totalStakedValue = getStakerTokensValue(stakers[stakersIndex]);
            farmToken.approve(stakers[stakersIndex],totalStakedValue);
            farmToken.transfer(stakers[stakersIndex], totalStakedValue);
            amountOfTokenIssued = amountOfTokenIssued + totalStakedValue;
        }
        rewardDistributionCounter = rewardDistributionCounter + 1;
        emit rewardDistributionCounterEvent(rewardDistributionCounter,amountOfTokenIssued);
    }

    function unStakeToken(address _tokenAddress) public {
        // check whether user token exists
        require(stakerTokenBalance[msg.sender][_tokenAddress] > 0, "User Token not found");
        IERC20(_tokenAddress).approve(msg.sender,stakerTokenBalance[msg.sender][_tokenAddress]);
        IERC20(_tokenAddress).transfer(msg.sender,stakerTokenBalance[msg.sender][_tokenAddress]);
        stakerTokenBalance[msg.sender][_tokenAddress] = 0;
        uniqueTokenStaked[msg.sender] = uniqueTokenStaked[msg.sender] - 1;
        if (uniqueTokenStaked[msg.sender] == 0) {
            for (
                uint256 stakersIndex = 0;
                stakersIndex < stakers.length;
                stakersIndex++
            ) {
                if (stakers[stakersIndex] == msg.sender) {
                    stakers[stakersIndex] = stakers[stakers.length - 1];
                    stakers.pop();
                }
            }
        }
    }
    function getStakedTokenAmount(address _user, address _token) public view returns (uint256){
        return stakerTokenBalance[_user][_token];
    }
    function getStakerTokensValue(address _user) public view returns(uint256) {
        uint256 amount = 0;
        if(uniqueTokenStaked[_user] <= 0){
            return amount;
        }
        for (uint256 tokenIndex = 0; tokenIndex < acceptedTokens.length; tokenIndex++){
            amount += getStakerSingleTokenValue(_user,acceptedTokens[tokenIndex]);
        }
        return amount;
    }
    function getStakerSingleTokenValue(address _user, address _token) public view returns(uint256) {
        uint256 tokenAmount = stakerTokenBalance[_user][_token];
        (uint256 tokenPrice, uint256 tokenDecimal) = getTokenValue(_token);

        uint256 tokenValue = tokenAmount * (tokenPrice / (10 ** tokenDecimal));
        return tokenValue;

    }
    function getAcceptedTokens() public view returns(address[] memory){
        return acceptedTokens;
    }
    function getStakers() public view returns(address[] memory){
        return stakers;
    }
    function updateUniqueToken(address _user, address _token) internal {
        if(stakerTokenBalance[_user][_token] <= 0){
            uniqueTokenStaked[_user] = uniqueTokenStaked[_user] + 1;
        }
    }
    function addPriceFeedAddress(address _tokenAddress, address _priceFeedAddress) internal  {
        tokenToPriceFeed[_tokenAddress] = _priceFeedAddress;
    }
    function getTokenValue(address _tokenAddress) public view returns(uint256, uint256) {
        address aggregatorAddress = tokenToPriceFeed[_tokenAddress];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(aggregatorAddress);
        (,int256 answer,,,)= priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(answer), decimals);
    }

    /*  
        a
    */
    function addAcceptedToken(address _tokenAddress, address _priceFeedAddress) public onlyOwner {
        acceptedTokens.push(_tokenAddress);
        addPriceFeedAddress(_tokenAddress, _priceFeedAddress);
    }
    function tokenIsAccepted(address _tokenAddress) public view returns(bool) {
        for(uint256 tokenIndex = 0; tokenIndex < acceptedTokens.length; tokenIndex++){
            if (acceptedTokens[tokenIndex] == _tokenAddress){
                return true;
            }
        }
        return false;
    }
    
}