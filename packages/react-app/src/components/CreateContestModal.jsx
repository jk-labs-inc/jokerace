import React, {useState} from 'react';
import { Input, Modal, Form } from "antd";

import DeployedContestContract from "../contracts/bytecodeAndAbi/Contest.sol/Contest.json";

const { ethers } = require("ethers");

export default function CreateContestModal({modalVisible, setModalVisible, setResultMessage, signer}) {
  const [contestTitle, setContestTitle] = useState("")
  const [votingTokenAddress, setVotingTokenAddress] = useState("")
  const [contestStart, setContestStart] = useState("")
  const [votingDelay, setVotingDelay] = useState("")
  const [votingPeriod, setVotingPeriod] = useState("")
  const [contestSnapshot, setContestSnapshot] = useState("")
  const [proposalThreshold, setProposalThreshold] = useState("")
  const [maxProposalCount, setMaxProposalCount] = useState("")

  const handleOk = async () => {
    // The factory we use for deploying contracts
    let factory = new ethers.ContractFactory(DeployedContestContract.abi, DeployedContestContract.bytecode, signer)
    console.log(factory)

    // Deploy an instance of the contract
    let contract = await factory.deploy(contestTitle, votingTokenAddress, contestStart, votingDelay, votingPeriod, 
                                        contestSnapshot, proposalThreshold, maxProposalCount);
    console.log(contract.address)
    console.log(contract.deployTransaction)
    setResultMessage("The " + contestTitle + " contest contract creation transaction has been submitted with this transaction id: " + contract.deployTransaction.hash + " for the contract to be deployed at this address: " + contract.address)
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
    <Modal title="Create Contest" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Contest Title"
          name="contesttitle"
          rules={[{ required: true, message: 'Please input your contest title!' }]}
        >
          <Input placeholder='Contest Title' onChange={(e) => setContestTitle(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Voting Token Address"
          name="votingtokenaddress"
          rules={[{ required: true, message: 'Please input your voting token address!' }]}
        >
          <Input placeholder='Voting Token Address' onChange={(e) => setVotingTokenAddress(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label="Contest Start Time"
          name="conteststart"
          rules={[{ required: true, message: 'Please input your contest start time!' }]}
        >
          <Input placeholder='Contest Start Time' onChange={(e) => setContestStart(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Proposal Open Period"
          name="votingdelay"
          rules={[{ required: true, message: 'Please input how long proposals will be open for!' }]}
        >
          <Input placeholder='How many seconds will proposals be open?' onChange={(e) => setVotingDelay(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Voting Period"
          name="votingperiod"
          rules={[{ required: true, message: 'Please input how long people will able to vote for!' }]}
        >
          <Input placeholder='How many seconds will voting be open?' onChange={(e) => setVotingPeriod(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Contest Snapshot"
          name="contestsnapshotblock"
          rules={[{ required: true, message: 'Please input your Contest Snapshot block!' }]}
        >
          <Input placeholder='Contest Snapshot Block' onChange={(e) => setContestSnapshot(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Proposal Threshold"
          name="proposalthreshold"
          rules={[{ required: true, message: 'Please input your proposal threshold!' }]}
        >
          <Input placeholder='Proposal Threshold' onChange={(e) => setProposalThreshold(ethers.utils.parseEther(e.target.value))} />
        </Form.Item>
        <Form.Item
          label="Max Proposal Count"
          name="maxproposalcount"
          rules={[{ required: true, message: 'Please input your max proposal count!' }]}
        >
          <Input placeholder='Max Proposal Count' onChange={(e) => setMaxProposalCount(e.target.value)} />
        </Form.Item>
      </Form>
      <h4>Contest Start Time: when proposal submission opens</h4>
      <h4>Proposal Open Period: how long after the contest start that proposals can be submitted</h4>
      <h4>Voting Period: how long after the proposal open period closes that people can vote</h4>
      <h4>Contest Snapshot Block: the block at which the snapshot of delegated votes will be taken for voting</h4>
      <h4>Proposal Threshold: the number of delegated votes an address must have in order to submit a proposal</h4>
      <h4>Max Proposal Count: the maximum number of proposals allowed</h4>
    </Modal>
  );
}