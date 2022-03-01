import React, { useState } from 'react';
import { Card, Modal, Button, Col, Row, Input } from 'antd';

export default function JokeItem({joke}) {
  const [isVoteModalVisible, setIsVoteModalVisible] = useState(false);

  const showModal = () => {
    setIsVoteModalVisible(true);
  };

  const handleOk = () => {
    setIsVoteModalVisible(false);
  };

  const handleCancel = () => {
    setIsVoteModalVisible(false);
  };

  return (
    <Card>
      <Row gutter={24}>
        <Col className="gutter-row" span={12}>
          <h4>{joke.content}</h4>
          <div>Votes: {joke.votes}</div>
          <div>Author: {joke.author}</div>
        </Col>
        <Col className="gutter-row" span={12}>
          <Button type="primary" onClick={showModal}>
            Vote
          </Button>
          <Modal title="Basic Modal" visible={isVoteModalVisible} onOk={handleOk} onCancel={handleCancel}>
            {/* TODO: Use this https://ant.design/components/modal/#components-modal-demo-confirm */}

            <p>Your Total Tokens: </p>
            <p>Remaining Available Votes: </p>
            <p>Race you are voting in: </p>
            <p>Joke you are voting for: </p>
            <Input icon='search' placeholder='Votes to cast for this joke' />
          </Modal>
        </Col>
      </Row>
    </Card>
  );
}