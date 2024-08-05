"use client";

import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import { PaywallBanner, Spinner } from "@/components";
import { withTurnkey } from "@/hoc";
import type {
  Turnkey as TurnkeyBrowserSDK,
  TurnkeyIframeClient,
} from "@turnkey/sdk-browser";
import { ethers } from "ethers";
import { TurnkeySigner } from "@turnkey/ethers";
import { NextPage } from "next";

function Page({
  turnkey,
  authIframeClient,
} : {
  turnkey: TurnkeyBrowserSDK;
  authIframeClient: TurnkeyIframeClient;
}) {
  const { currentUser, logout, getWallets, wallets } = useUser();
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && !wallets) {
      getWallets();
    }
  }, [currentUser]);

  const pay = async () => {
    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
    const currentUser = await turnkey.getCurrentUser();
    if (currentUser) {
      try {
        setLoading(true);
        const signer = new TurnkeySigner({
          client: authIframeClient,
          organizationId: currentUser?.organization?.organizationId,
          signWith: wallets[0].address,
        });
        const connectedSigner = signer.connect(provider);

        const transactionRequest = {
          to: process.env.NEXT_PUBLIC_DESTINATION_ADDRESS,
          value: ethers.parseEther(process.env.NEXT_PUBLIC_PPV_WEI_PRICE!),
          type: 2,
        };
        const sendTransaction =
          await connectedSigner.sendTransaction(transactionRequest);
        if (sendTransaction) {
          const { hash } = sendTransaction;
          setReceipt(hash);
          setHasPaid(true);
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <>Unathorized</>;
  }

  return (
    <main>
      <div className="flex w-full h-screen justify-center items-center flex-col bg-slate-100">
        <Spinner visible={loading} />
        {hasPaid ? (
          <>
            <Image src={"/lula.png"} width={300} height={400} alt="lula mae" />
            <div className="text-lg mt-3">{`Thank you for your payment.`}</div>
            <div>{`Transaction receipt : ${receipt}`}</div>
          </>
        ) : (
          <PaywallBanner wallets={wallets} pay={pay} logout={logout} />
        )}
      </div>
    </main>
  );
}

export default withTurnkey(Page);
