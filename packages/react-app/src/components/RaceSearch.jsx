import React, {useState} from 'react';
import DateTimePicker from 'react-datetime-picker'
import { Card, Input, Button, Modal } from "antd";
import { convertToUnixTimeStamp } from "../helpers/time";
import { createRace } from "../helpers/db"
import RaceItem from "./RaceItem";

export default function RaceSearch({races}) {
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isSubmitRaceModalVisible, setIsSubmitRaceModalVisible] = useState(false);
  const [createRaceName, setCreateRaceNameChange] = useState("");
  const [createRaceStartTime, setCreateRaceStartTimeChange] = useState(new Date());
  const [createRaceEndTime, setCreateRaceEndTimeChange] = useState(new Date());

  const showModal = () => {
    setIsSubmitRaceModalVisible(true);
  };

  const handleOk = () => {
    createRace({
      "name": createRaceName,
      "startTime": convertToUnixTimeStamp(createRaceStartTime),
      "endTime": convertToUnixTimeStamp(createRaceEndTime)
    })
    setIsSubmitRaceModalVisible(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setIsSubmitRaceModalVisible(false);
  };

  function searchRaces(searchValue) {
    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = races.filter(item => {
        return Object.values(item.data.name).join("").toLowerCase().includes(searchInput.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(races);
    }
  }
  
  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
      <Button onClick={() => {window.location.reload();}}>Refresh</Button>
      <Button type="primary" onClick={showModal}>
        Submit Race
      </Button>
      <Modal title="Basic Modal" visible={isSubmitRaceModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {/* TODO: Use this https://ant.design/components/modal/#components-modal-demo-confirm */}
        <p>Race Name: <Input placeholder='Race Name:' onChange={(e) => setCreateRaceNameChange(e.target.value)} /></p>
        <p>(The below time pickers use your browser's time locale)</p>
        <p>Start Time: 
          <DateTimePicker onChange={setCreateRaceStartTimeChange} disableCalendar="true" disableClock="true" minDate={new Date()} value={new Date()} clearIcon={null} />
          {createRaceStartTime.toString()}
        </p>
        <p>End Time: 
          <DateTimePicker onChange={setCreateRaceEndTimeChange} disableCalendar="true" disableClock="true" minDate={new Date()} value={new Date()} clearIcon={null} />
          {createRaceEndTime.toString()}
        </p>
      </Modal>   
      <Input icon='search' placeholder='Search races...' value={searchInput} onChange={(e) => searchRaces(e.target.value)} />
      <Card>
        {searchInput.length > 1 ? (
          filteredResults.map((entry) => <RaceItem raceData={entry.data} />)
        ) : (
          races.map((entry) => <RaceItem raceData={entry.data} />)
        )
        }
      </Card>
    </div>
  );
}