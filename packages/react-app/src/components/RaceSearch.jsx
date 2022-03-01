import React, {useState} from 'react';
import { Card, Input, Button } from "antd";
import RaceItem from "./RaceItem";

export default function RaceSearch({races}) {
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  function searchItems(searchValue) {
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
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
      <Button onClick={() => {window.location.reload();}}>Refresh</Button>
      <Button onClick={() => {window.location.reload();}}>Create Race</Button>
      <Input icon='search' placeholder='Search...' value={searchInput} onChange={(e) => searchItems(e.target.value)} />
      <Card>
        <h2>Search for your race!</h2>
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