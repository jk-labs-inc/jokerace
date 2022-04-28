import React, { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import { CSVLink, CSVDownload } from "react-csv";

const CsvExportButton = ({ 
            getAllProposalIdsContractFunction, 
            getProposalContractFunction, 
            proposalVotesContractFunction,
            addressesVotedContractFunction,
            proposalAddressVotesContractFunction
          }) => {
  const [propInfo, setPropInfo] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const propInfoheaders = [
    { label: "ProposalId", key: "proposalId" },
    { label: "Author", key: "author" },
    { label: "ProposalContent", key: "proposalContent" },
    { label: "TotalVotes", key: "totalVotes" },
    { label: "Voter", key: "voter" },
    { label: "Votes", key: "votes" },
    { label: "PercentOfSubmissionVotes", key: "percentOfSubmissionVotes" }
  ];

  const getPropDictInfo = async (idArray) => {
    var propArrayToReturn = [];
    console.log("Number of Proposals: ", idArray.length);
    var tenthPercentile = Math.ceil(idArray.length/10);
    console.log("tenth percentile:", tenthPercentile)

    for (let i = 0; i < idArray.length; i++) {
      var propId = idArray[i];
      var propTotalVotes = await proposalVotesContractFunction(propId);
      var propContent = await getProposalContractFunction(propId);

      var addressesVoted = await addressesVotedContractFunction(propId);

      if (addressesVoted.length == 0) {

        var noVoterDict = {
          "proposalId": propId,
          "author": propContent[0],
          "proposalContent": propContent[1],
          "totalVotes": propTotalVotes/1e18,
          "voter": "No voters",
          "votes": "No votes",
          "percentOfSubmissionVotes": 0
        }

        propArrayToReturn.push(noVoterDict);
      }

      for (let j = 0; j < addressesVoted.length; j++) {
        
        var address = addressesVoted[j]
        var addressPropVote = await proposalAddressVotesContractFunction(propId, address);
        
        var voterDict = {
          "proposalId": propId,
          "author": propContent[0],
          "proposalContent": propContent[1],
          "totalVotes": propTotalVotes/1e18,
          "voter": address,
          "votes": addressPropVote/1e18,
          "percentOfSubmissionVotes": (addressPropVote)/propTotalVotes
        }

        propArrayToReturn.push(voterDict);
      }

      if (i%tenthPercentile == 0) {
        console.log(i + " out of " + idArray.length + " proposals loaded for export!");
      }

    }

    return propArrayToReturn;
  }

  const getPropInfo = async () => {
    try {
      console.log("Export load started")
      setDataLoaded(false)
      const idsResp = await getAllProposalIdsContractFunction();
      const allProposalsResp = await getPropDictInfo(idsResp);
      setPropInfo(allProposalsResp);
      setDataLoaded(true)
      console.log("Export load finished - ready to export")
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <div>
      <div>
        <Button onClick={async () => await getPropInfo()}>Load Proposal and Voter Data For Export</Button>
      </div>
      <div>
        { dataLoaded ?
          <CSVLink 
            data={propInfo}
            headers={propInfoheaders}
          >
            Export votes information
          </CSVLink>
          : ""
        }
      </div>
    </div>
  );
};

export default CsvExportButton;
