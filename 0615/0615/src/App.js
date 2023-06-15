import React from "react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

// ethers
function App() {
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();

  const connect = async () => {
    // 내가 보는 화면에서 메타마스크가 있으면 바로 실행
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(res[0]);

        const _balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [res[0].toString(), "latest"],
        });
        setBalance(Number(_balance));
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("install metamask");
    }
  };

  connect();

  return (
    <div>
      <h3>current wallet address : {account}</h3>
      <h3>current balance : {balance}</h3>
    </div>
  );
}

/* web3
function App() {
  const [blockNumber, setblockNumber] = useState();
  const [balance, setBalance] = useState();

  const web3 = new Web3(
    "wss://goerli.infura.io/ws/v3/c9272c6607724aa08e2432def393cb43"
  );

  const privateKey =
    "0xe30d7cfa303f3f5f018409c094ac5363287dcd233ad4b27d5c4d8efa641b0615";
  const account = web3.eth.accounts.privateKeyToAccount(privateKey).address;

  useEffect(() => {
    async function getBlock() {
      const blockNumber = await web3.eth.getBlockNumber();
      setblockNumber(Number(blockNumber));
    }
    getBlock();

    async function subscribeBlock() {
      const subscription = await web3.eth.subscribe("newHeads");
      subscription.on("data", async (blockhead) => {
        console.log("Hash of New Block : ", blockhead.number);
        setblockNumber(Number(blockhead.number));
      });
    }
    subscribeBlock();

    async function getBalance() {
      var balance = await web3.eth.getBalance(account);
      setBalance(Number(balance)); // 형변환
    }
    getBalance();
  });

  return (
    <div>
      <li>current block number is : {blockNumber}</li>
      <li>current Wallet : {account}</li>
      <li>current balance : {balance / 1000000000000000000} eth</li>
    </div>
  );
}
*/

export default App;
