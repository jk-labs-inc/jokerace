import React, {useState} from 'react';
import { Card, Input, Collapse, Button } from "antd";
import { RaceItem } from "../components";

export default function RaceSearch(races, searchInput, searchItemsFunc, filteredResults) {
  return (
    <div>
      <Button onClick={() => {window.location.reload();}}>Refresh</Button>
      <Input icon='search' placeholder='Search...' value={searchInput} onChange={(e) => searchItemsFunc(e.target.value)} />
      <Card title="Search for your race!">
        <Collapse>
          {searchInput.length > 1 ? (
            filteredResults.map((entry, index) => {
              return RaceItem(entry.data, index);
            })
          ) : (
            races.map((entry, index) => {
              return RaceItem(entry.data, index);
            })
          )
          }
        </Collapse>
      </Card>
    </div>
  );
}