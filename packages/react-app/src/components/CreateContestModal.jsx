import React, {useState} from 'react';
import { Input, Modal, Form, Tooltip, Radio } from "antd";

import DeployedContestContract from "../contracts/bytecodeAndAbi/Contest.sol/Contest.json";

const { ethers } = require("ethers");

export default function CreateContestModal({modalVisible, setModalVisible, setResultMessage, signer}) {
  const [contestTitle, setContestTitle] = useState("")
  const [contestPrompt, setContestPrompt] = useState("")
  const [votingTokenAddress, setVotingTokenAddress] = useState("")
  const [contestStart, setContestStart] = useState("")
  const [votingDelay, setVotingDelay] = useState("")
  const [votingPeriod, setVotingPeriod] = useState("")
  const [radioState, setRadioState] = useState(1)
  const [contestVotingSnapshot, setContestVotingSnapshot] = useState("")
  const [proposalThreshold, setProposalThreshold] = useState("")
  const [numAllowedProposalSubmissions, setNumAllowedProposalSubmissions] = useState("")
  const [maxProposalCount, setMaxProposalCount] = useState("")

  const onRadioChange = (e) => {
    setRadioState(e.target.value);
  };

  const handleOk = async () => {
    // The factory we use for deploying contracts
    let factory = new ethers.ContractFactory(DeployedContestContract.abi, DeployedContestContract.bytecode, signer)
    console.log(factory)

    var chosenContestVotingSnapshot = radioState == 2 ? parseInt(contestVotingSnapshot) : parseInt(contestStart) + parseInt(votingDelay);

    var intContestParameters = [contestStart, votingDelay, votingPeriod, 
      chosenContestVotingSnapshot, proposalThreshold, numAllowedProposalSubmissions, maxProposalCount];

    // Deploy an instance of the contract
    let contract = await factory.deploy(contestTitle, contestPrompt, votingTokenAddress, intContestParameters);
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
        layout="vertical"
      >
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Contest Title</span>}
          name="contesttitle"
          rules={[{ required: true, message: 'Please input your contest title!' }]}
        >
          <Input placeholder='Contest Title' onChange={(e) => setContestTitle(e.target.value)} />
        </Form.Item>
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Contest Prompt</span>}
          name="contestprompt"
          rules={[{ required: true, message: 'Please input your contest prompt!' }]}
        >
          <Input placeholder='Contest Prompt' onChange={(e) => setContestPrompt(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Voting Token Address"
          name="votingtokenaddress"
          rules={[{ required: true, message: 'Please input your voting token address!' }]}
        >
          <Input placeholder='What is the address of your voting token?' onChange={(e) => setVotingTokenAddress(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Number of Tokens Required to Submit</span>}
          name="numtokensrequiredtosubmit"
          rules={[{ required: true, message: 'Please input the number of tokens required to submit!' }]}
        >
          <Tooltip title="Tip: Set to 0 if you want to let anyone submit">
            <Input placeholder='How many tokens do you need to submit an entry?' onChange={(e) => setProposalThreshold(ethers.utils.parseEther(e.target.value))} />
          </Tooltip>
        </Form.Item>
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Submissions Per Wallet</span>}
          name="submissionsperwallet"
          rules={[{ required: true, message: 'Please input the number of submissions per wallet allowed!' }]}
        >
          <Tooltip title="Tip: We usually recommend 1">
            <Input placeholder='How many entries can a wallet with the required tokens submit?' onChange={(e) => setNumAllowedProposalSubmissions(e.target.value)} />
          </Tooltip>
        </Form.Item>
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Max Submissions</span>}
          name="maxsubmissions"
          rules={[{ required: true, message: 'Please input the maximum number of submissions allowed!' }]}
        >
          <Tooltip title="Tip: We usually recommend 100">
            <Input placeholder="What's the max number of submissions your contest will show?" onChange={(e) => setMaxProposalCount(e.target.value)} />
          </Tooltip>
        </Form.Item>
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Submission Start Time</span>}
          name="submissionstarttime"
          rules={[{ required: true, message: 'Please input the Unix timestamp of when submissions open!' }]}
          >
            <Tooltip title="Tip: use https://www.epochconverter.com/">
              <Input placeholder='Unix timestamp of when submissions open' onChange={(e) => setContestStart(e.target.value)} />
            </Tooltip>
        </Form.Item>
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Submission Duration</span>}
          name="submissionDuration"
          rules={[{ required: true, message: 'Please input how long (in seconds) submissions will be open for!' }]}
        >
          <Tooltip title="Tip: 1 hour = 3600 seconds, 1 day = 86400 seconds">
            <Input placeholder='How many seconds will submissions be open?' onChange={(e) => setVotingDelay(e.target.value)} />
          </Tooltip>
        </Form.Item>
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>When do wallets qualify to vote?</span>}
          name="contestvotingsnapshotradio"
          rules={[{ required: true, message: 'Please decide on the voting qualification time!' }]}
        >
          <Radio.Group onChange={onRadioChange} value={radioState} defaultValue={1}>
            <Radio value={1}>If they have tokens at start of voting period (recommended)</Radio>
            <Radio value={2}>If they have tokens at a custom time</Radio>
          </Radio.Group>
        </Form.Item>
        {
          radioState == 2 ?
            <Form.Item  
              label={<span style={{ whiteSpace: 'normal' }}>Contest Voting Snapshot</span>}
              name="contestvotingsnapshot"
              rules={[{ required: true, message: 'Please input the Unix timestamp of your voting snapshot!' }]}
            >
              <Tooltip title="What is the Unix timestamp that this contest will look at to determine wallet voting power? We suggest it being the time that submissions end.">
                <Input placeholder='Unix timestamp of the snapshot that will determine voting power' onChange={(e) => setContestVotingSnapshot(e.target.value)} />
              </Tooltip>
            </Form.Item> :
          ""
        }
        <Form.Item
          label={<span style={{ whiteSpace: 'normal' }}>Voting Duration</span>}
          name="votingduration"
          rules={[{ required: true, message: 'Please input how many seconds voting will be open!' }]}
        >
          <Tooltip title="Note: Voting starts as soon as submissions close">
            <Input placeholder='How many seconds will voting be open?' onChange={(e) => setVotingPeriod(e.target.value)} />
          </Tooltip>
        </Form.Item>
      </Form>
    </Modal>
  );
}