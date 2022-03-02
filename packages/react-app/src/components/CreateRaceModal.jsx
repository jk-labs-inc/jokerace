import React, {useState} from 'react';
import DateTimePicker from 'react-datetime-picker'
import { Input, Modal, Form, Button } from "antd";
import { convertToUnixTimeStamp } from "../helpers/time";
import { createRace } from "../helpers/db"

export default function CreateRaceModal({modalVisible, setModalVisible}) {
  const [createRaceName, setCreateRaceNameChange] = useState("");
  const [createRaceStartTime, setCreateRaceStartTimeChange] = useState(new Date());
  const [createRaceEndTime, setCreateRaceEndTimeChange] = useState(new Date());

  const handleOk = () => {
    var retVal = createRace(
      createRaceName,
      convertToUnixTimeStamp(createRaceStartTime),
      convertToUnixTimeStamp(createRaceEndTime)
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

  return (
    <Modal title="Create Race" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
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
          label="Race Name"
          name="racename"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder='Race Name:' onChange={(e) => setCreateRaceNameChange(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Start Time"
          name="starttime"
          rules={[{ required: true, message: 'Please input the start time of this race!' }]}
        >
          <DateTimePicker onChange={setCreateRaceStartTimeChange} disableCalendar={true} disableClock={true} minDate={new Date()} value={new Date()} clearIcon={null} />
          {createRaceStartTime.toString()}
        </Form.Item>

        <Form.Item
          label="End Time"
          name="endtime"
          rules={[{ required: true, message: 'Please input the end time of this race!' }]}
        >
          <DateTimePicker onChange={setCreateRaceEndTimeChange} disableCalendar={true} disableClock={true} minDate={new Date()} value={new Date()} clearIcon={null} />
          {createRaceEndTime.toString()}
        </Form.Item>
      </Form>
    </Modal>
  );
}