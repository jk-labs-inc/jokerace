import React, {useState} from "react";
import { Card, Button, Modal, Input } from "antd";
import JokeItem from "./JokeItem";

function voteSortFunc(joke1, joke2) {
  if (joke1.votes < joke2.votes) {
    return 1;
  }
  if (joke1.votes > joke2.votes) {
    return -1;
  }
  return 0;
}

export default function RaceItem({raceData}) {
  const [isSubmitJokeModalVisible, setIsSubmitJokeModalVisible] = useState(false);

  const showModal = () => {
    setIsSubmitJokeModalVisible(true);
  };

  const handleOk = () => {
    setIsSubmitJokeModalVisible(false);
  };

  const handleCancel = () => {
    setIsSubmitJokeModalVisible(false);
  };

  return ( 
    <Card>
      <h3>{raceData.name}</h3>
      <h4>From {new Date(raceData.startTime).toUTCString()}</h4>
      <h4>To {new Date(raceData.endTime).toUTCString()}</h4>
      <Button type="primary" onClick={showModal}>
        Submit Joke
      </Button>
      <Modal title="Basic Modal" visible={isSubmitJokeModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {/* TODO: Use this https://ant.design/components/modal/#components-modal-demo-confirm */}
        <p>Race you are joking in: </p>
        <p>Joke you would like to submit: </p>
        <Input icon='search' placeholder='Vote to submit' />
      </Modal>      
      {raceData.jokes.sort(voteSortFunc).map(
        (joke) => { return <JokeItem joke={joke} /> }
      )}
    </Card>
  );
}
