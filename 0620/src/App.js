import React from "react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import abi from "./abi.json";
import abi2 from "./abi2.json";

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [balance, setBalance] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [tBalance, setTbalance] = useState();

  const web3 = new Web3("wss://goerli.infura.io/ws/v3/");
  const web3_2 = new Web3("https://goerli.infura.io/v3/");

  // ERC20 함수이용
  var c_addr = "0xf7389e84220FF1165842e38C8e92772846e61A9d"; // 꽁짜민팅
  var c_addr_2 = "0x127c6Abf99a85f8852352Bf269ad1073b6F21417"; // 유료민팅
  var contract = new web3_2.eth.Contract(abi, c_addr);
  var contract2 = new web3_2.eth.Contract(abi2, c_addr_2);

  console.log("methos are : ", contract.methods);

  async function getTbalance() {
    if (account) {
      try {
        console.log("getting balance");
        var a = await contract2.methods.balanceOf(account).call();
        console.log("the a is : ", a);
        setTbalance(Number(a));
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("connect the wallet");
    }
  }
  getTbalance();

  // 들어온 사용자 메마에 연결하기
  const connect = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(res[0]);
        getBalance();
        getTbalance();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Install Metamask");
    }
  };

  // 초기 블록 업데이트
  useEffect(() => {
    async function getBlock() {
      const blockNumber = await web3.eth.getBlockNumber();
      setBlockNumber(Number(blockNumber));
    }

    getBlock();
  });

  async function getBalance() {
    const res = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (account) {
      const _balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [res[0].toString(), "latest"],
      });

      setBalance(ethers.formatEther(_balance));
    } else {
      console.log("wallet is not connected");
    }
  }

  /*
  // web3를 이용하기때문에 위에 비해서 느림
  async function getBalance() {
    if (account) {
      const _balance = await web3.eth.getBalance(account);
      setBalance(ethers.formatEther(_balance));
    } else {
      console.log("wallet is not connected");
    }
  }
  */

  // 잔고 불러오기
  useEffect(() => {
    async function subscribeBlock() {
      const subscription = await web3.eth.subscribe("newHeads");
      subscription.on("data", async (blockHead) => {
        setBlockNumber(Number(blockHead.number));
      });
    }
    subscribeBlock();
  });

  // 네트워크 이름 가져오기
  async function getChainId() {
    if (window.ethereum) {
      const ID = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(ID);
    }
  }

  getChainId();

  // 네트워크가 변경되면 모두 초기화
  async function chainChanged() {
    if (window.ethereum) {
      setAccount(null);
      setBalance(null);
      connect();
      getChainId();
    }
  }

  // 만약 네트워크가 바뀌면 실행
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", chainChanged);
    }
  });

  // 만약 게정이 바뀌면 실행
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", connect);
    }
  });

  /*
  // 코인 보내기
  // https://docs.metamask.io/wallet/reference/eth_sendtransaction/
  async function sendTx(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        { from: account, to: data.get("address"), value: data.get("amount") },
      ],
    });
  }
  */

  /* !런타임 에러
  // 코인 보내기
  async function sendTx(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const params = {
      from: account,
      to: data.get("address"), // address(밑 input)라는 이름으로부터 get
      value: data.get("amount"), // amount(밑 input)라는 이름으로부터 get
    };
    await web3.eth.sendTransaction(params);
  }
  */

  // ERC20에서 이더리움 보내기
  async function sendTx(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(typeof data.get("amount"));
    /*var a = Number(data.get("amount"));
    a = web3.utils.numberToHex(a);*/
    var a = web3.utils.numberToHex(Number(data.get("amount")));
    console.log(a, typeof a);

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{ from: account, to: data.get("address"), value: a }], // 진짜 보내는사람, 받는사람, 값
    });
  }

  // ERC20 토큰 보내보기
  async function sendERC(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(typeof data.get("amount_2"));
    /*var a = Number(data.get("amount"));
    a = web3.utils.numberToHex(a);*/
    var a = web3.utils.numberToHex(Number(data.get("amount_2")));
    console.log(a, typeof a);

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        // 진짜 보내는 사람, 받는건 컨트랙트, 데이터(진짜 받는사람, 값)
        {
          from: account,
          to: c_addr_2, // 컨트랙트 주소를 넣어야함
          data: contract.methods.transfer(data.get("address_2"), a).encodeABI(),
        },
      ],
    });
  }

  /*
  // ERC20 토큰 무료 민팅해보기
  async function minting(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    var a = web3.utils.numberToHex(Number(data.get("amount_3")));

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: account,
          to: c_addr,
          data: contract.methods.MintToken(a).encodeABI(),
        },
      ],
    });
  }
  */

  // ERC20 토큰 유료 민팅해보기
  async function minting(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    var a = web3.utils.numberToHex(Number(data.get("amount_3")));
    var b = web3.utils.numberToHex(Number(data.get("amount_3")) * 10000); // 10000 안맞춰주면 트잭생성안됨

    await window.ethereum.request({
      method: "eth_sendTransaction", // 메마 메소드
      params: [
        {
          from: account,
          to: c_addr_2 /*contract address 바꾸기*/,
          value: b,
          data: contract2.methods /*contract address 바꾸기*/ // contract2의 매소드
            .MintToken(a)
            .encodeABI(),
        },
      ],
    });
  }

  return (
    <div className="App">
      <div
        onClick={() => {
          connect();
        }}
      >
        Connet Click
      </div>
      <li>current Block Number : {blockNumber}</li>
      <li>current address : {account}</li>
      <li>current balance : {balance} eth</li>
      <li>current token balance : {tBalance}</li>
      <li>current chainId : {chainId}</li>
      <form onSubmit={sendTx}>
        <input type="text" name="address" placeholder="write address"></input>
        <input type="text" name="amount" placeholder="write amount"></input>
        <button type="submit">Send Tx</button>
      </form>
      <form onSubmit={sendERC}>
        <input type="text" name="address_2" placeholder="write address"></input>
        <input type="text" name="amount_2" placeholder="write amount"></input>
        <button type="submit">Send ERC</button>
      </form>
      <form onSubmit={minting}>
        <input type="text" name="amount_3" placeholder="write amount"></input>
        <button type="submit">Mint</button>
      </form>
    </div>
  );
}

export default App;
