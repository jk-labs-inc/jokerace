import React, {useState} from 'react';
import { Input, Modal, Form, Button, Divider } from "antd";

import DeployedERC20VotesWrapperContract from "../contracts/bytecodeAndAbi/ERC20VotesWrapper.sol/ERC20VotesWrapper.json";

const { ethers } = require("ethers");

export default function CreateERC20VotesWrapperModal({modalVisible, setModalVisible, setResultMessage, signer}) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")

  const handleOk = async () => {
    // The factory we use for deploying contracts
    let factory = new ethers.ContractFactory(DeployedERC20VotesWrapperContract.abi, DeployedERC20VotesWrapperContract.bytecode, signer)
    console.log(factory)

    // Deploy an instance of the contract
    let contract = await factory.deploy(tokenAddress, tokenName, tokenSymbol);
    console.log(contract.address)
    console.log(contract.deployTransaction)
    setResultMessage("The " + tokenName + " contract creation transaction has been submitted with this transaction id: " + contract.deployTransaction.hash + " for the contract to be deployed at this address: " + contract.address)
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal title="Create ERC20Votes Wrapper Token" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h4>Token Name: the name you would like your wrapped token to have</h4>
        <h4>Token Symbol: the symbol (ie. wJOKE) you would like your wrapped token to have</h4>
        <h4>Token Address: the address of the ERC20 token that this token will be wrapping</h4>
        <Divider />
        <Form.Item
          label="Token Name"
          name="tokenname"
          rules={[{ required: true, message: 'Please input your token title!' }]}
        >
          <Input placeholder='Token Name' onChange={(e) => setTokenName(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Token Symbol"
          name="tokensymbol"
          rules={[{ required: true, message: 'Please input your token symbol!' }]}
        >
          <Input placeholder='Token Symbol' onChange={(e) => setTokenSymbol(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Token Address"
          name="tokenaddress"
          rules={[{ required: true, message: 'Please input your token address!' }]}
        >
          <Input placeholder='Token Address' onChange={(e) => setTokenAddress(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
      </Form>
    </Modal>
  );
}