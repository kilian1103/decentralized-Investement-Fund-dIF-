//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract dInvestmentFund {
  
  
  address payable[] public owners;
  string public strategy;

  constructor() payable {
    // require(msg.value >= 0.01 ether, "You have to invest at least 0.01 ETH");
    owners.push(payable(msg.sender));
    
  }

  function changeStrategy(string memory _strategy) external {
    strategy = _strategy;
  }

  function listInvestmentOptions() pure external returns(string memory) {
    return "No coins to buy yet";
  }




  // fallback function
  receive() external payable {}
}