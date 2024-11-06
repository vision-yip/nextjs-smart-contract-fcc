/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { abi, contractAddresses } from '../constants';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import type { ContractTransaction } from 'ethers';
import { useNotification } from 'web3uikit';

const LotteryEntrance = () => {
  const [entranceFee, setEntranceFee] = useState<string>('0');
  const [numPlayers, setNumPlayers] = useState<string>('0');
  const [recentWinner, setRecentWinner] = useState<string>('0');

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId: number = chainIdHex ? parseInt(chainIdHex) : 0;
  // @ts-ignore
  const raffleAddress = chainId ? contractAddresses[chainId][0] : undefined;

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading: isEnterRaffleLoading,
    isFetching: isEnterRaffleFetching,
  } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'getNumberOfPlayers',
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'getRecentWinner',
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  const updateUi = async () => {
    const entranceFeeFromCall = ((await getEntranceFee()) as number).toString();
    const numPlayerFromCall = ((await getNumberOfPlayers()) as number).toString();
    const recentWinnerFromCall = ((await getRecentWinner()) as number).toString();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayerFromCall);
    setRecentWinner(recentWinnerFromCall);
  };

  const onEnterRaffle = async () => {
    console.log(entranceFee, raffleAddress);
    await enterRaffle({
      onSuccess: async (tx) => {
        await (tx as ContractTransaction).wait(1);
        handlerNewNotification();
        updateUi();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };
  const handlerNewNotification = () => {
    dispatch({
      type: 'info',
      message: 'Transaction Complete',
      title: 'Tx Notification',
      position: 'topR',
      icon: 'bell',
    });
  };
  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mg-auto"
            onClick={onEnterRaffle}
            disabled={isEnterRaffleLoading || isEnterRaffleFetching}
          >
            {isEnterRaffleLoading || isEnterRaffleFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>entranceFee: {ethers.utils.formatEther(entranceFee)} ETH</div>
          <div>Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Deteched</div>
      )}
    </div>
  );
};

export default LotteryEntrance;
