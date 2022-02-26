import React from "react";
import { useGetAllRaces } from "../hooks";

export default function RacesPage() {

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>

        {useGetAllRaces()}
        
      </div>
    </div>
  );
}
