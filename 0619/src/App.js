import React from "react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [balance, setBalance] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();

  const web3 = new Web3(
    "wss://goerli.infura.io/ws/v3/88cd1369d4b0478b9b44c031a628b0bf"
  );

  // 체인 아이디 가져오기
  async function getChainId() {
    if (window.ethereum) {
      const res = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(res);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", chainChanged);
    }
  });

  const chainChanged = async () => {
    if (window.ethereum) {
      setAccount(null);
      setBalance(null);
      connect();
    }
  };

  // 계정이 변경될 때
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", connect);
    }
  });

  // 들어온 사용자 메마에 연결하기
  const connect = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(res);
        setAccount(res[0]);
        const _balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [res[0].toString(), "latest"],
        });

        //setBalance(Number(_balance)); // wei 단위로 표시
        setBalance(ethers.formatEther(_balance)); // -> 이더 단위로 표시
        getChainId();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Install Metamask");
    }
  };

  connect();

  // 페이지 들어가자마자 블록 업데이트 하기
  useEffect(() => {
    async function getBlock() {
      const blockNumber = await web3.eth.getBlockNumber();
      setBlockNumber(Number(blockNumber));
    }
    getBlock();
  });

  useEffect(() => {
    async function getBalance() {
      if (account) {
        const balance = await web3.eth.getBalance(account);
        setBalance(Number(balance));
      }
    }

    getBalance();

    async function subscribeBlock() {
      const subscription = await web3.eth.subscribe("newHeads");
      subscription.on("data", async (blockHead) => {
        console.log("New block header : ", blockHead);
        setBlockNumber(Number(blockHead.number));
      });
    }

    subscribeBlock();
  });

  return (
    <div>
      <div
        className="App"
        onClick={() => {
          connect();
        }}
      >
        CONNECT WALLET
      </div>
      <li>current Block Number : {blockNumber}</li>
      <li>current address : {account}</li>
      <li>current balance : {balance} eth</li>
      <li>current chainId : {chainId}</li>
    </div>
  );
}

export default App;
