import { config } from "@config/wagmi";
import LegacyDeployedRewardsModuleContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.1.first.sol/RewardsModule.json";
import NumberedVersioningRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.3.numberedVersioning.sol/RewardsModule.json";
import GateSubmissionsOpenRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.4.gateSubmissionsOpen.sol/RewardsModule.json";
import BetterRewardsNotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.2.5.betterRewardsNotes.sol/RewardsModule.json";
import MerkleVotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.1.merkleVotes.sol/RewardsModule.json";
import CantVoteOnDeletedPropsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.10.cantVoteOnDeletedProps.sol/RewardsModule.json";
import AuditMinorFixesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.11.auditMinorFixes.sol/RewardsModule.json";
import AuditInfoAndOptimizationsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.12.auditInfoAndOptimizations.sol/RewardsModule.json";
import CleanUpContractDocsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.13.cleanUpContractDocs.sol/RewardsModule.json";
import TrackProposalAuthorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.14.trackProposalAuthors.sol/RewardsModule.json";
import TrackVotersRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.15.trackVoters.sol/RewardsModule.json";
import MakeVarsPublicRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.16.makeVarsPublic.sol/RewardsModule.json";
import LetJkLabsCancelRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.17.letJkLabsCancel.sol/RewardsModule.json";
import AddJokeraceCreatedEventRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.18.addJokeraceCreatedEvent.sol/RewardsModule.json";
import TotalVotesCastRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.2.totalVotesCast.sol/RewardsModule.json";
import SetCompilerRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.3.setCompilerTo8Dot19.sol/RewardsModule.json";
import AddIsDeletedRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.4.addIsDeleted.sol/RewardsModule.json";
import DeletedDontHitLimitRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.5.deletedDontHitLimit.sol/RewardsModule.json";
import BringBackDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.6.bringBackDeletedIds.sol/RewardsModule.json";
import ArrayOfDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.7.makeArrayOfDeletedIds.sol/RewardsModule.json";
import DeletedIdAccessorRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.8.makeDeletedIdAccessor.sol/RewardsModule.json";
import PrivateDeletedIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.3.9.privateDeletedIds.sol/RewardsModule.json";
import AddEntryChargeRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.1.addEntryCharge.sol/RewardsModule.json";
import RmImmutableKeywordRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.10.rmImmutableKeyword.sol/RewardsModule.json";
import GasOptimizeGettersRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.11.gasOptimizeGetters.sol/RewardsModule.json";
import AllowCancelCompletedRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.12.allowCancelCompleted.sol/RewardsModule.json";
import AddCommentsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.13.addComments.sol/RewardsModule.json";
import RmShadowingPropIdsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.14.rmShadowingPropIds.sol/RewardsModule.json";
import RmUnusedViewFuncRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.15.rmUnusedViewFunc.sol/RewardsModule.json";
import PinAllToSameRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.16.pinAllToSame.sol/RewardsModule.json";
import MitToAGPLRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.17.mitToAGPL.sol/RewardsModule.json";
import AddEmergencyFuncsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.18.addEmergencyFuncs.sol/RewardsModule.json";
import AddMoreAttributionRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.19.addMoreAttribution.sol/RewardsModule.json";
import UpdateSortingAlgoRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.2.updateSortingAlgo.sol/RewardsModule.json";
import AddGetDeletedAuthorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.20.addGetDeletedAuthors.sol/RewardsModule.json";
import AddContentToEventsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.21.addContentToEvents.sol/RewardsModule.json";
import RefactorDistributionFuncRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.22.refactorDistributionFunc.sol/RewardsModule.json";
import NewValueAlreadyInArrayRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.3.newValueAlreadyInArray.sol/RewardsModule.json";
import UseCustomErrorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.4.useCustomErrors.sol/RewardsModule.json";
import CleanUpSortingRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.5.cleanUpSorting.sol/RewardsModule.json";
import RestructureExtensionsAndUtilsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.6.restructureExtensionsAndUtils.sol/RewardsModule.json";
import RmUnnecessaryVirtualsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.7.rmUnnecessaryVirtuals.sol/RewardsModule.json";
import DeleteInMapAfterForLoopRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.8.deleteInMapAfterForLoop.sol/RewardsModule.json";
import AddGetPropIdsWithForVotesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.9.addGetPropIdsWithForVotes.sol/RewardsModule.json";
import AddCostToVoteRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.23.addCostToVote.sol/RewardsModule.json";
import RefactorCostDistroRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.24.refactorCostDistro.sol/RewardsModule.json";
import PayPerVoteRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.25.payPerVote.sol/RewardsModule.json";
import CleanUpConstructorsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.26.cleanUpConstructors.sol/RewardsModule.json";
import AnyoneCanVoteRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.27.anyoneCanVote.sol/RewardsModule.json";
import UpdateForgeLibsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.28.updateForgeLibs.sol/RewardsModule.json";
import SetSplitDestinationRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.29.setSplitDestination.sol/RewardsModule.json";
import MakeJkLabsSplitConfigurableRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.30.makeJkLabsSplitConfigurable.sol/RewardsModule.json";
import AddMetadataFieldsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.31.addMetadataFields.sol/RewardsModule.json";
import CheckCanceledRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.32.checkCanceled.sol/RewardsModule.json";
import MustCancelToWithdrawRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.33.mustCancelToWithdraw.sol/RewardsModule.json";
import AllowJkLabsDestUpdateRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.34.allowJkLabsDestUpdate.sol/RewardsModule.json";
import OnlyCreatorChangeMerkleRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.35.onlyCreatorChangeMerkle.sol/RewardsModule.json";
import NoCommentAfterCloseRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.36.noCommentAfterClose.sol/RewardsModule.json";
import EditTitleDescRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.4.37.editTitleDesc.sol/RewardsModule.json";
import RmDownvotingRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.1.rmDownvoting.sol/RewardsModule.json";
import AddErc20CancelledCheckRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.2.addErc20CancelledCheck.sol/RewardsModule.json";
import EntrantsCanDeleteRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.3.entrantsCanDelete.sol/RewardsModule.json";
import OfficialModulePointsToContestRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.4.officialModulePointsToContest.sol/RewardsModule.json";
import VoterRewardsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.5.voterRewards.sol/RewardsModule.json";
import SetPeriodLimitsRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.6.setPeriodLimits.sol/RewardsModule.json";
import VotingPriceCurvesRewards from "@contracts/bytecodeAndAbi/modules/RewardsModule.5.7.votingPriceCurves.sol/RewardsModule.json";
import DeployedRewardsContract from "@contracts/bytecodeAndAbi/modules/RewardsModule.sol/RewardsModule.json";
import { ethers } from "ethers";
import { getEthersProvider } from "./ethers";
import { executeWithTimeout, MAX_TIME_TO_WAIT_FOR_RPC } from "./timeout";

export async function getRewardsModuleContractVersion(address: string, chainId: number) {
  const provider = getEthersProvider(config, { chainId });
  const contract = new ethers.Contract(address, NumberedVersioningRewards.abi, provider);

  try {
    const version: string = await executeWithTimeout(MAX_TIME_TO_WAIT_FOR_RPC, contract.version());

    if (version === "5.7") {
      return { abi: VotingPriceCurvesRewards.abi, version };
    } else if (version === "5.6") {
      return { abi: SetPeriodLimitsRewards.abi, version };
    } else if (version === "5.5") {
      return { abi: VoterRewardsRewards.abi, version };
    } else if (version === "5.4") {
      return { abi: OfficialModulePointsToContestRewards.abi, version };
    } else if (version === "5.3") {
      return { abi: EntrantsCanDeleteRewards.abi, version };
    } else if (version === "5.2") {
      return { abi: AddErc20CancelledCheckRewards.abi, version };
    } else if (version === "5.1") {
      return { abi: RmDownvotingRewards.abi, version };
    } else if (version === "4.37") {
      return { abi: EditTitleDescRewards.abi, version };
    } else if (version === "4.36") {
      return { abi: NoCommentAfterCloseRewards.abi, version };
    } else if (version === "4.35") {
      return { abi: OnlyCreatorChangeMerkleRewards.abi, version };
    } else if (version === "4.34") {
      return { abi: AllowJkLabsDestUpdateRewards.abi, version };
    } else if (version === "4.33") {
      return { abi: MustCancelToWithdrawRewards.abi, version };
    } else if (version === "4.32") {
      return { abi: CheckCanceledRewards.abi, version };
    } else if (version === "4.31") {
      return { abi: AddMetadataFieldsRewards.abi, version };
    } else if (version === "4.30") {
      return { abi: MakeJkLabsSplitConfigurableRewards.abi, version };
    } else if (version === "4.29") {
      return { abi: SetSplitDestinationRewards.abi, version };
    } else if (version === "4.28") {
      return { abi: UpdateForgeLibsRewards.abi, version };
    } else if (version === "4.27") {
      return { abi: AnyoneCanVoteRewards.abi, version };
    } else if (version === "4.26") {
      return { abi: CleanUpConstructorsRewards.abi, version };
    } else if (version === "4.25") {
      return { abi: PayPerVoteRewards.abi, version };
    } else if (version === "4.24") {
      return { abi: RefactorCostDistroRewards.abi, version };
    } else if (version === "4.23") {
      return { abi: AddCostToVoteRewards.abi, version };
    } else if (version === "4.22") {
      return { abi: RefactorDistributionFuncRewards.abi, version };
    } else if (version === "4.21") {
      return { abi: AddContentToEventsRewards.abi, version };
    } else if (version === "4.20") {
      return { abi: AddGetDeletedAuthorsRewards.abi, version };
    } else if (version === "4.19") {
      return { abi: AddMoreAttributionRewards.abi, version };
    } else if (version === "4.18") {
      return { abi: AddEmergencyFuncsRewards.abi, version };
    } else if (version === "4.17") {
      return { abi: MitToAGPLRewards.abi, version };
    } else if (version === "4.16") {
      return { abi: PinAllToSameRewards.abi, version };
    } else if (version === "4.15") {
      return { abi: RmUnusedViewFuncRewards.abi, version };
    } else if (version === "4.14") {
      return { abi: RmShadowingPropIdsRewards.abi, version };
    } else if (version === "4.13") {
      return { abi: AddCommentsRewards.abi, version };
    } else if (version === "4.12") {
      return { abi: AllowCancelCompletedRewards.abi, version };
    } else if (version === "4.11") {
      return { abi: GasOptimizeGettersRewards.abi, version };
    } else if (version === "4.10") {
      return { abi: RmImmutableKeywordRewards.abi, version };
    } else if (version === "4.9") {
      return { abi: AddGetPropIdsWithForVotesRewards.abi, version };
    } else if (version === "4.8") {
      return { abi: DeleteInMapAfterForLoopRewards.abi, version };
    } else if (version === "4.7") {
      return { abi: RmUnnecessaryVirtualsRewards.abi, version };
    } else if (version === "4.6") {
      return { abi: RestructureExtensionsAndUtilsRewards.abi, version };
    } else if (version === "4.5") {
      return { abi: CleanUpSortingRewards.abi, version };
    } else if (version === "4.4") {
      return { abi: UseCustomErrorsRewards.abi, version };
    } else if (version === "4.3") {
      return { abi: NewValueAlreadyInArrayRewards.abi, version };
    } else if (version === "4.2") {
      return { abi: UpdateSortingAlgoRewards.abi, version };
    } else if (version === "4.1") {
      return { abi: AddEntryChargeRewards.abi, version };
    } else if (version === "3.18") {
      return { abi: AddJokeraceCreatedEventRewards.abi, version };
    } else if (version === "3.17") {
      return { abi: LetJkLabsCancelRewards.abi, version };
    } else if (version === "3.16") {
      return { abi: MakeVarsPublicRewards.abi, version };
    } else if (version === "3.15") {
      return { abi: TrackVotersRewards.abi, version };
    } else if (version === "3.14") {
      return { abi: TrackProposalAuthorsRewards.abi, version };
    } else if (version === "3.13") {
      return { abi: CleanUpContractDocsRewards.abi, version };
    } else if (version === "3.12") {
      return { abi: AuditInfoAndOptimizationsRewards.abi, version };
    } else if (version === "3.11") {
      return { abi: AuditMinorFixesRewards.abi, version };
    } else if (version === "3.10") {
      return { abi: CantVoteOnDeletedPropsRewards.abi, version };
    } else if (version === "3.9") {
      return { abi: PrivateDeletedIdsRewards.abi, version };
    } else if (version === "3.8") {
      return { abi: DeletedIdAccessorRewards.abi, version };
    } else if (version === "3.7") {
      return { abi: ArrayOfDeletedIdsRewards.abi, version };
    } else if (version === "3.6") {
      return { abi: BringBackDeletedIdsRewards.abi, version };
    } else if (version === "3.5") {
      return { abi: DeletedDontHitLimitRewards.abi, version };
    } else if (version === "3.4") {
      return { abi: AddIsDeletedRewards.abi, version };
    } else if (version === "3.3") {
      return { abi: SetCompilerRewards.abi, version };
    } else if (version === "3.2") {
      return { abi: TotalVotesCastRewards.abi, version };
    } else if (version === "3.1") {
      return { abi: MerkleVotesRewards.abi, version };
    } else if (version === "2.5") {
      return { abi: BetterRewardsNotesRewards.abi, version };
    } else if (version === "2.4") {
      return { abi: GateSubmissionsOpenRewards.abi, version };
    } else if (version === "2.3") {
      return { abi: NumberedVersioningRewards.abi, version };
    } else if (version === "1") {
      return { abi: LegacyDeployedRewardsModuleContract.abi, version };
    } else {
      return { abi: DeployedRewardsContract.abi, version };
    }
  } catch (error) {
    // If the version method does not exist, use the legacy ABI
    return { abi: LegacyDeployedRewardsModuleContract.abi, version: "1" };
  }
}

export default getRewardsModuleContractVersion;
