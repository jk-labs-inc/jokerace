import React, { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import { CSVLink, CSVDownload } from "react-csv";

const CsvExportButton = ({ 
            getAllProposalIdsContractFunction, 
            getProposalContractFunction, 
            proposalVotesContractFunction,
            addressesVotedContractFunction,
            proposalAddressVotesContractFunction,
            mainnetProvider
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
    { label: "PercentOfSubmissionVotes", key: "percentOfSubmissionVotes" },
    { label: "ProposerHasEnsReverseRecordSet", key: "proposerHasEnsReverseRecordSet" },
    { label: "ProposerEnsReverseRecordIfSet", key: "proposerEnsReverseRecordIfSet" },
    { label: "VoterHasEnsReverseRecordSet", key: "voterHasEnsReverseRecordSet" },
    { label: "VoterEnsReverseRecordIfSet", key: "voterEnsReverseRecordIfSet" }
  ];

  const getPropDictInfo = async (idArray) => {
    var propArrayToReturn = [];
    console.log("Number of Proposals: ", idArray.length);
    var tenthPercentile = Math.ceil(idArray.length/10);

    var ensNamesMap = new Map();

    for (let i = 0; i < idArray.length; i++) {
      var propId = idArray[i];
      var propTotalVotes = await proposalVotesContractFunction(propId);
      var propContent = await getProposalContractFunction(propId);
      var addressesVoted = await addressesVotedContractFunction(propId);

      var proposerAddress = propContent[0];
      if (!ensNamesMap.has(proposerAddress)) { // Keep a cache of ENS resolutions
        var ensLookupResult = await mainnetProvider.lookupAddress(proposerAddress);
        var checkedResult = ensLookupResult == null ? "No reverse record" : ensLookupResult;
        ensNamesMap.set(proposerAddress, checkedResult);
      }
      var proposerEnsLookupResult = ensNamesMap.get(proposerAddress);

      if (addressesVoted.length == 0) {
        var noVoterDict = {
          "proposalId": propId,
          "author": proposerAddress,
          "proposalContent": propContent[1],
          "totalVotes": propTotalVotes/1e18,
          "voter": "No voters",
          "votes": "No votes",
          "percentOfSubmissionVotes": 0,
          "proposerHasEnsReverseRecordSet": proposerEnsLookupResult == "No reverse record" ? false : true,
          "proposerEnsReverseRecordIfSet": proposerEnsLookupResult == "No reverse record" ? "" : proposerEnsLookupResult,
          "voterHasEnsReverseRecordSet": "No voters",
          "voterEnsReverseRecordIfSet": ""
        }

        propArrayToReturn.push(noVoterDict);
      }

      for (let j = 0; j < addressesVoted.length; j++) {
        
        var address = addressesVoted[j]
        var addressPropVote = await proposalAddressVotesContractFunction(propId, address);

        if (!ensNamesMap.has(address)) { // Keep a cache of ENS resolutions
          var ensLookupResult = await mainnetProvider.lookupAddress(address);
          var checkedResult = ensLookupResult == null ? "No reverse record" : ensLookupResult;
          ensNamesMap.set(address, checkedResult);
        }
        var voterEnsLookupResult = ensNamesMap.get(address);
        
        var voterDict = {
          "proposalId": propId,
          "author": propContent[0],
          "proposalContent": propContent[1],
          "totalVotes": propTotalVotes/1e18,
          "voter": address,
          "votes": addressPropVote/1e18,
          "percentOfSubmissionVotes": (addressPropVote)/propTotalVotes,
          "proposerHasEnsReverseRecordSet": proposerEnsLookupResult == "No reverse record" ? false : true,
          "proposerEnsReverseRecordIfSet": proposerEnsLookupResult == "No reverse record" ? "" : proposerEnsLookupResult,
          "voterHasEnsReverseRecordSet": voterEnsLookupResult == "No reverse record" ? false : true,
          "voterEnsReverseRecordIfSet": voterEnsLookupResult == "No reverse record" ? "" : voterEnsLookupResult
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
