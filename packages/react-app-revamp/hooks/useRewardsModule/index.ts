import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import { getContestContractVersion } from "@helpers/getContestContractVersion"
import { useRouter } from "next/router"
import getRewardsModuleContractVersion from '@helpers/getRewardsModuleContractVersion'

export function useRewardsModule() {
  const { asPath } = useRouter()
  const [abiContest, setAbiContest] = useState(null)
  const [abiRewardsModule, setAbiRewardsModule] = useState(null)
  const [supportsRewardsModule, setSupportsRewardsModule] = useState(false)
  const queryContestOfficialRewardsModule = useContractRead({
    addressOrName: asPath.split("/")[3],
    //@ts-ignore
    contractInterface: abiContest,
    functionName: 'officialRewardsModule',
    enabled: abiContest !== null && supportsRewardsModule
  })

  const queryRewardsModule = useContractRead({
    addressOrName: asPath.split("/")[3],
    //@ts-ignore
    contractInterface: abiRewardsModule,
    functionName: 'totalShares',
    //@ts-ignore
    enabled: supportsRewardsModule === true && queryContestOfficialRewardsModule?.isSuccess && queryContestOfficialRewardsModule?.data
  })
  
  useEffect(() => {
    async function fetchAbi() {
        try {
            const abiContestContract = await getContestContractVersion(asPath.split("/")[3], asPath.split("/")[2]);
            //@ts-ignore
            setAbiContest(abiContestContract)    
            abiContest?.map(el => console.log(el.name))
            console.log(abiContest)
             //@ts-ignore
            const isModuleRewardsSupported = abiContest?.filter(el => el.name === "officialRewardsModule")?.length > 0
            setSupportsRewardsModule(isModuleRewardsSupported)
        } catch(e) {
            console.error(e)
        }
      }
      fetchAbi();
  }, [])

  useEffect(() => {
    async function fetchAbi() {
        try {
            const abiRewardsModuleContract = await getRewardsModuleContractVersion(asPath.split("/")[3], asPath.split("/")[2]);
            //@ts-ignore
            setAbiRewardsModule(abiRewardsModuleContract)        
        } catch(e) {
            console.error(e)
        }
      }
    if(queryContestOfficialRewardsModule.isSuccess && queryContestOfficialRewardsModule?.data) {
      fetchAbi();
    }
  }, [queryContestOfficialRewardsModule?.isSuccess, queryContestOfficialRewardsModule?.data])

  return {
    supportsRewardsModule,
    queryContestOfficialRewardsModule,
    queryRewardsModule,
  }
}

export default useRewardsModule