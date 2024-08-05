import React, { useEffect, useState } from "react";
import { formatEther } from "ethers";

const PaywallBanner = ({
  wallets,
  pay,
  logout,
}: {
  wallets?: any;
  pay: () => void;
  logout: () => void;
}) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      (async () => {
        const res = await fetch("/api/wallet/balance", {
          method: "POST",
          body: JSON.stringify({ address: wallets[0].address }),
          headers: { "Content-Type": "application/json" },
        });
        let { balance } = await res.json();
        setBalance(balance);
      })();
    }
  }, [wallets]);

  return (
    <div className="min-w-full bg-red-400 py-5 flex items-center flex-col shadow-md border border-red-500 border-4 text-white">
      <h2 className="text-white text-2xl">
        Welcome! - this content is paywalled
      </h2>
      <div className="text-lg text-white">{`Pay ${formatEther(process.env.NEXT_PUBLIC_PPV_WEI_PRICE!)} ETH to view`}</div>
      <div className="mt-4 min-w-[30%] space-y-2 mb-4">
        {wallets ? (
          <div className="text-lg">Your Wallet Details:</div>
        ) : (
          <div className="animate-pulse h-2 bg-slate-100 rounded"></div>
        )}
        {wallets ? (
          <div className="text-sm">Address: {wallets[0].address}</div>
        ) : (
          <div className="animate-pulse h-2 bg-slate-100 rounded w-[90%]"></div>
        )}
        {balance ? (
          <div className="text-sm">Balance: {`${balance} ETH`}</div>
        ) : (
          <div className="animate-pulse h-2 bg-slate-100 rounded"></div>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          className="bg-green-400 text-black py-1 px-4 rounded-md shadow-sm cursor-pointer"
          onClick={pay}
        >
          Pay
        </button>
        <button
          className="bg-yellow-300 text-black py-1 px-4 rounded-md shadow-sm cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export { PaywallBanner };
