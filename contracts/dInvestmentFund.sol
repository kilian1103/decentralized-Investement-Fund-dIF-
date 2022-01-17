//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface Factory {
  function getPair(address tokenA, address tokenB) external view returns (address pair);  
}

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
  function addLiquidity(
    address tokenA,
    address tokenB,
    uint amountADesired,
    uint amountBDesired,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline
  ) external returns (uint amountA, uint amountB, uint liquidity);

  function removeLiquidity(
    address tokenA,
    address tokenB,
    uint liquidity,
    uint amountTokenMin,
    uint amountETHMin,
    address to,
    uint deadline
  ) external returns (uint amountToken, uint amountETH);
}

interface ERC20 {
  function deposit() external payable;
  function approve(address spender, uint amount) external;
  function allowance(address owner, address spender) external view returns(uint);
  function balanceOf(address owner) external view returns(uint);
  function withdraw(uint wad) external;
  function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
  function token0() external view returns (address);
}



contract dInvestmentFund {

  event Deposit();
  event Withdraw();
  event CoinAdded();
  event ChangedMiningState();
  event InvestedAll();
  event CashedOutAndDestroyed();
  
  address private ROUTER_ADDRESS = address(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
  address private FACTORY_ADDRESS = address(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
  address private WETH_ADDRESS = address(0xc778417E063141139Fce010982780140Aa0cD5Ab);
  address payable[] public owners;
  string public strategy;

  mapping (string => uint) public balance;
  mapping(string => address) public coin_addresses;
  mapping(string => uint) public liquidity_coin_balance;
  string[] public coin_names;
  ERC20 private weth = ERC20(WETH_ADDRESS);
  Router private router = Router(ROUTER_ADDRESS);
  Factory private factory = Factory(FACTORY_ADDRESS);

  constructor() payable {
    // require(msg.value >= 0.01 ether, "You have to invest at least 0.01 ETH");
    owners.push(payable(msg.sender));   
  }

  function listInvestments() pure external returns(string memory) {
    return "No coins to buy yet";
  }

  function tokenBalance (string calldata coin_name) public view returns (uint){
    return balance[coin_name];
  }

  function addCoins(string[] calldata _coin_names, address[] calldata COIN_ADDRESSES) public {
    require(_coin_names.length == COIN_ADDRESSES.length, "Please provide a name for each token");
    for (uint i = 0; i < COIN_ADDRESSES.length; i++){
    coin_names.push(_coin_names[i]);
    coin_addresses[_coin_names[i]] = COIN_ADDRESSES[i];
    }
    emit CoinAdded();
  }

  function buyCoin(string memory coin_name, uint amountIn) public returns(uint) {
      weth.deposit{value: amountIn}();
      weth.approve(ROUTER_ADDRESS, amountIn);

      address[] memory pair_address = new address[](2);
      pair_address[0] = WETH_ADDRESS;
      pair_address[1] = coin_addresses[coin_name];


      
      uint[] memory amountsOut = router.getAmountsOut(amountIn, pair_address);

      uint amountOutMin = amountsOut[1]*9/10;


      router.swapExactTokensForTokens(
        amountIn, 
        amountOutMin,
        pair_address,
        address(this),
        block.timestamp + 60 * 10
      );

      balance[coin_name] += amountsOut[1];
      emit Deposit();
      return amountsOut[1];
  }

  function sellCoin(string memory coin_name, uint amountIn) public {
    require(amountIn >= balance[coin_name], "You don't own that many tokens");
    ERC20 coin = ERC20(coin_addresses[coin_name]);
 
    coin.approve(ROUTER_ADDRESS, amountIn);

    address[] memory pair_address = new address[](2);
    pair_address[0] = coin_addresses[coin_name];
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
    balance[coin_name] -= amountsOut[0];
    emit Withdraw();
  }

  
  function startMiningLiquidity(string memory coin_name) public returns(uint){
    ERC20 coin = ERC20(coin_addresses[coin_name]);
    ERC20 coinPair = ERC20(factory.getPair(coin_addresses[coin_name], WETH_ADDRESS));

    (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = coinPair.getReserves();
    uint current_coin_balance = balance[coin_name];
    address current_coin_address = coin_addresses[coin_name];
    coin.approve(ROUTER_ADDRESS, current_coin_balance);
    uint weth_amount;
    if (coinPair.token0() == WETH_ADDRESS){
      weth_amount = current_coin_balance * reserve0 / reserve1;
    }
    else {
      weth_amount = current_coin_balance * reserve1 / reserve0;
    }
    
    weth.deposit{value: weth_amount}();
    weth.approve(ROUTER_ADDRESS, weth_amount);

    (uint amountA, uint amountB, uint liquidity) = router.addLiquidity(
        WETH_ADDRESS,
        current_coin_address,
        weth_amount,
        current_coin_balance,
        weth_amount *9/10,
        current_coin_balance *9/10,
        address(this),
        block.timestamp + 60 * 10
      );
    
    balance[coin_name] -= amountB;
    liquidity_coin_balance[coin_name] += liquidity;

    emit ChangedMiningState();

  }

  function stopMiningLiquidity(string memory coin_name) public {
 
    ERC20 coinPair = ERC20(factory.getPair(coin_addresses[coin_name], WETH_ADDRESS));
    coinPair.approve(ROUTER_ADDRESS,liquidity_coin_balance[coin_name]);
    
    (uint amountA, uint amountB) = router.removeLiquidity(
    coin_addresses[coin_name],
    WETH_ADDRESS,
    liquidity_coin_balance[coin_name],
    0,
    0,
    address(this),
    block.timestamp + 60 * 10);

    liquidity_coin_balance[coin_name] = 0;
    balance[coin_name] += amountA;
    weth.withdraw(amountB);


    emit ChangedMiningState();
  }

  function getAssetList() public returns(string[] memory coin_names, uint[] memory coin_assets, uint[] memory liquidity_coin_assets){
    uint length = coin_names.length;
    uint[] memory coin_assets = new uint[](length);
    uint[] memory liquidity_coin_assets = new uint[](length);
    for (uint i = 0; i < length; i++){
      coin_assets[i] = balance[coin_names[i]];
      liquidity_coin_assets[i] = liquidity_coin_balance[coin_names[i]];
    }

    return (coin_names, coin_assets, liquidity_coin_assets);

  }


  function diversifyAndStake() public {
    uint eth_to_spend = address(this).balance - (1 ether / 100);
    uint eth_per_coin = eth_to_spend / coin_names.length / 2;
    for (uint i = 0; i < coin_names.length; i++){
      string memory coinname = coin_names[i];
      buyCoin(coinname, eth_per_coin);
      startMiningLiquidity(coinname);
    }
    emit InvestedAll();
  }

  
  function cashOutAndDestroy() public { 
    require(msg.sender == owners[0], 'Only the OG deployer can call this function');
    for (uint i = 0; i < coin_names.length; i++){
      if (liquidity_coin_balance[coin_names[i]] > 0){
        string memory coinname = coin_names[i];
        stopMiningLiquidity(coinname);
      }
    }
    for (uint i = 0; i < coin_names.length; i++){
      if (balance[coin_names[i]] > 0){
        string memory coinname = coin_names[i];
        uint coinbalance = balance[coin_names[i]];
        sellCoin(coinname, balance[coin_names[i]]);
      }
    }
    emit CashedOutAndDestroyed();
    selfdestruct(owners[0]); 
 }

  // fallback function
  receive() external payable {}
}