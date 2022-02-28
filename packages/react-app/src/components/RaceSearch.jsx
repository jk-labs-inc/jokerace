import React, { useState, useEffect } from 'react';
import { Card, Input, Collapse } from "antd";
import { RaceItem } from "../components";

export default function RaceSearch(races, searchInput, setSearchInput, filteredResults, setFilteredResults) {

  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchInput !== '') {
        const filteredData = races.filter((item) => {
            return Object.values(item.data.name).join('').toLowerCase().includes(searchInput.toLowerCase())
        })
        setFilteredResults(filteredData)
    }
    else{
        setFilteredResults(races)
    }
  }

  return (
    <div>
      <Input icon='search' placeholder='Search...' onChange={(e) => searchItems(e.target.value)}/>
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
          )}
        </Collapse>
      </Card>
    </div>
  );
}