import React, {useState} from 'react';
import { Input, Modal, Form, Button } from "antd";
import { createJoke } from "../helpers/db"

export default function CreateJokeModal({raceId, raceName, modalVisible, setModalVisible}) {
  const [jokeContent, setJokeContent] = useState("");
  
  const handleOk = () => {
    createJoke(
      raceId,
      jokeContent,
      "jokedao"  // TODO: Set author dynamically when sign-in with Ethereum is implemented
    )
    setModalVisible(false);
    window.location.reload();
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

  const titleText = "For submission to " + raceName;

  return (
    <Modal title={titleText} visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
      {/* TODO: Use this https://ant.design/components/modal/#components-modal-demo-confirm */}
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
          label="Joke"
          name="jokeforsubmission"
          rules={[{ required: true, message: 'Please input your joke!' }]}
        >
          <Input placeholder='Share joke here' onChange={(e) => setJokeContent(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}