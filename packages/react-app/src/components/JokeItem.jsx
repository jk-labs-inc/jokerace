import React, { useState } from 'react';
import { Card, Modal, Button, Col, Row } from 'antd';

export default function JokeItem({joke}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Card>
      <Row gutter={24}>
        <Col className="gutter-row" span={12}>
          <h4>{joke.content}</h4>
          <div>Votes: {joke.votes}</div>
        </Col>
        <Col className="gutter-row" span={12}>
          <Button type="primary" onClick={showModal}>
            Vote
          </Button>
          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </Col>
      </Row>
    </Card>
  );
}