import { useBalance, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi"
import Button from "@components/Button" 
import { toast } from 'react-hot-toast'

export const ButtonWithdrawERC20Reward = (props) => {
    const { contractRewardsModuleAddress, tokenAddress, abiRewardsModule } = props
    const { chain } = useNetwork()
    const queryTokenBalance = useBalance({
      addressOrName: tokenAddress,
    });
    const contractWriteWithdrawERC20Reward = useContractWrite({
        addressOrName: contractRewardsModuleAddress,
        contractInterface: abiRewardsModule,
        functionName: "withdrawRewards(address)",
        chainId: chain?.id,
        onError(e) {
            toast.error(`${e.cause}: ${e.message}`)
        }

      })
    
      useWaitForTransaction({
        hash: contractWriteWithdrawERC20Reward?.data?.hash,
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
      onClick={() => contractWriteWithdrawERC20Reward.write()}
      isLoading={contractWriteWithdrawERC20Reward.isLoading}
      disabled={ parseFloat(queryTokenBalance?.data?.formatted) === 0|| contractWriteWithdrawERC20Reward.isLoading || contractWriteWithdrawERC20Reward.isSuccess}
    >
        {contractWriteWithdrawERC20Reward.isError ? 'Try again' : contractWriteWithdrawERC20Reward.isSuccess ? `${tokenAddress?.symbol} withdrawn successfully` : contractWriteWithdrawERC20Reward.isLoading ? 'Withdrawing...' : parseFloat(queryTokenBalance?.data?.formatted) === 0 ? `${queryTokenBalance?.data?.symbol}` : `${parseFloat(queryTokenBalance?.data?.formatted).toFixed(4)} ${queryTokenBalance?.data?.symbol}`}
    </Button>

}

export default ButtonWithdrawERC20Reward