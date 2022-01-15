//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface Router {
  function swapExactTokensForTokens(
    uint amountIn,
    uint amountOutMin,
    address[] calldata path,
    address to,
    uint deadline
  ) external returns (uint[] memory amounts);
  function getAmountsOut(
    uint amountIn, 
    address[] memory path
  )
    external
    view
    returns (uint[] memory amounts);
}

contract ERC20 {
  function deposit() public payable {}
  function approve(address spender, uint amount) external {}
  function allowance(address owner, address spender) external view returns(uint) {}
  function balanceOf(address owner) external view returns(uint) {}
  function withdraw(uint wad) public {}
}



contract dInvestmentFund {

  event Deposit();
  event Withdraw();
  
  address private ROUTER_ADDRESS = address(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  address private WETH_ADDRESS = address(0xc778417E063141139Fce010982780140Aa0cD5Ab);
  address payable[] public owners;
  string public strategy;

  mapping (address => uint) public balance;

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

  function tokenBalance (address COIN_ADDRESS) public view returns (uint){
    return ERC20(COIN_ADDRESS).balanceOf(address(this));
  }

  function buyCoin(address COIN_ADDRESS, uint amountIn) public {
      ERC20 weth = ERC20(WETH_ADDRESS);
      Router router = Router(ROUTER_ADDRESS);

      weth.deposit{value: amountIn}();
      weth.approve(ROUTER_ADDRESS, amountIn);

      address[] memory pair_address = new address[](2);
      pair_address[0] = WETH_ADDRESS;
      pair_address[1] = COIN_ADDRESS;


      
      uint[] memory amountsOut = router.getAmountsOut(amountIn, pair_address);

      uint amountOutMin = amountsOut[1]*9/10;


      router.swapExactTokensForTokens(
        amountIn, 
        amountOutMin,
        pair_address,
        address(this),
        block.timestamp + 60 * 10
      );

      balance[COIN_ADDRESS] += amountsOut[1];
      emit Deposit();
  }

  function sellCoin(address COIN_ADDRESS, uint amountIn) public {
    require(amountIn >= balance[COIN_ADDRESS], "You don't own that many tokens");

    ERC20 weth = ERC20(WETH_ADDRESS);
    ERC20 coin = ERC20(COIN_ADDRESS);
    Router router = Router(ROUTER_ADDRESS);

   
    coin.approve(ROUTER_ADDRESS, amountIn);

    address[] memory pair_address = new address[](2);
    pair_address[0] = COIN_ADDRESS;
    pair_address[1] = WETH_ADDRESS;
    uint[] memory amountsOut = router.getAmountsOut(amountIn, pair_address);

    uint amountOutMin = amountsOut[1]*9/10;


    router.swapExactTokensForTokens(
      amountIn, 
      amountOutMin,
      pair_address,
      address(this),
      block.timestamp + 60 * 10
    );


    uint wethbalance = amountsOut[1];
    weth.withdraw(wethbalance);
    balance[COIN_ADDRESS] = ERC20(COIN_ADDRESS).balanceOf(address(this));
    emit Withdraw();
  }

  function CashOutAndDestroy() public { 
    require(msg.sender == owners[0], 'Only the OG deployer can call this function');
    selfdestruct(owners[0]); 
 }

  // fallback function
  receive() external payable {}
}