import { useEffect, useState } from "react";
import { DEFAULT_ETHEREUM_ACCOUNTS } from "@turnkey/sdk-browser";
import { useTurnkey } from "@turnkey/sdk-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {TurnkeySDKApiTypes}  from "@turnkey/sdk-browser";

const useUser = () => {
  const [currentUser, setCurrentUser] = useState<TurnkeySDKApiTypes.TGetUserResponse | null>(null);
  const [wallets, setWallets] = useState<any | null>(null);
  const { turnkey, authIframeClient, getActiveClient } = useTurnkey();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!currentUser) {
      (async () => {
        const authenticated = await turnkey?.getCurrentUser() as unknown as TurnkeySDKApiTypes.TGetUserResponse;
        if (turnkey && !authenticated && pathname === "/content") {
          router.push("/");
        } else if (authenticated) {
          setCurrentUser(authenticated);
        }
      })();
    }
  }),
    [pathname, authIframeClient, turnkey];

  const provisionWallet = async () => {
    const client = await getActiveClient();
    const wallet = await client?.createWallet({
      walletName: "Just For You Wallet",
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
    });
    return wallet;
  };

  const getWallets = async () => {
    if (wallets) return wallets;
    const userSession = await turnkey?.currentUserSession();
    if (userSession) {
      const wallets = await userSession.getWallets();
      if (wallets.wallets.length === 0) {
        await provisionWallet();
        return await userSession.getWallets();
      } else {
        const orgId = await userSession.getOrganization();
        const walletAccounts = await userSession?.getWalletAccounts({
          walletId: wallets.wallets[0].walletId,
          organizationId: orgId.organizationData.organizationId,
        });

        const { accounts } = walletAccounts;
        setWallets(accounts);
        return accounts;
      }
    } else {
      return [];
    }
  };

  const login = async () => {
    //make sure we're not logged in first
    await logout(false);
    const credentialBundle = searchParams?.get(`credentialBundle`);
    if (credentialBundle) {
      const auth =
        await authIframeClient?.injectCredentialBundle(credentialBundle);
      console.log(auth, authIframeClient);
      if (auth && authIframeClient) {
        const loginReq = await authIframeClient.login();
        if (loginReq) {
          const authenticated = await turnkey?.getCurrentUser() as unknown as TurnkeySDKApiTypes.TGetUserResponse;
          setCurrentUser(authenticated);
          await getWallets();
          router.push("/content");
        }
      }
    }
  };

  const logout = async (redirect = true) => {
    await turnkey?.logoutUser();
    if (redirect) router.push("/");
  };

  return {
    login,
    currentUser,
    wallets,
    logout,
    getWallets,
  };
};

export default useUser;
