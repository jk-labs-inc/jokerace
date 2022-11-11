import React from "react";
import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi"
import Button from "@components/Button" 
import { toast } from 'react-hot-toast'

export const ButtonWithdrawNativeReward = (props) => {
    const { contractRewardsModuleAddress, abiRewardsModule } = props
    const { chain } = useNetwork()
    const queryTokenBalance = useBalance({
      addressOrName: contractRewardsModuleAddress,
    });
    const contractWriteWithdrawNativeReward = useContractWrite({
        addressOrName: contractRewardsModuleAddress,
        contractInterface: abiRewardsModule,
        functionName: "withdrawRewards()",
        chainId: chain?.id,
        onError(e) {
            toast.error(`${e.cause}: ${e.message}`)
        }

      })
    
      useWaitForTransaction({
        hash: contractWriteWithdrawNativeReward?.data?.hash,
        onError(e) {
          console.error(e)
          toast.error('Something went wrong and the funds couldn\'t be withdrawn  :', e?.message)
        },
        async onSuccess(data) {
          toast.success('Funds withdrawn successfully !')
        }
      })
    
    return <Button
      intent={parseFloat(queryTokenBalance?.data?.formatted) === 0 ? "ghost-primary" : "primary-outline"}
      onClick={() => contractWriteWithdrawNativeReward.write()}
      isLoading={contractWriteWithdrawNativeReward.isLoading}
      disabled={ parseFloat(queryTokenBalance?.data?.formatted) === 0|| contractWriteWithdrawNativeReward.isLoading || contractWriteWithdrawNativeReward.isSuccess}
    >
        {contractWriteWithdrawNativeReward.isError ? 'Try again' : contractWriteWithdrawNativeReward.isSuccess ? `${chain?.nativeCurrency?.symbol} withdrawn successfully` : contractWriteWithdrawNativeReward.isLoading ? 'Withdrawing...' : parseFloat(queryTokenBalance?.data?.formatted) === 0 ? `${chain?.nativeCurrency?.symbol}` : `${parseFloat(queryTokenBalance?.data?.formatted).toFixed(4)} ${chain?.nativeCurrency?.symbol}`}
    </Button>

}

export default ButtonWithdrawNativeReward