import {
  TurnkeySDKApiTypes,
  Turnkey as TurnkeyBrowserSDK,
} from "@turnkey/sdk-browser";

const fetchSubOrgs = async (turnkey: TurnkeyBrowserSDK, email: string) =>
  (await turnkey.serverSign("getSubOrgIds", [
    {
      filterType: "EMAIL",
      filterValue: email,
    },
  ])) as TurnkeySDKApiTypes.TGetSubOrgIdsResponse;

const createSubOrg = async (turnkey: TurnkeyBrowserSDK, email: string) =>
  (await turnkey.serverSign("createSubOrganization", [
    {
      subOrganizationName: email,
      rootUsers: [
        {
          userName: email,
          userEmail: email,
          apiKeys: [],
          authenticators: [],
          oauthProviders: [],
        },
      ],
      rootQuorumThreshold: 1,
    },
  ])) as TurnkeySDKApiTypes.TCreateSubOrganizationResponse;

const sendEmail = async (
  turnkey: TurnkeyBrowserSDK,
  targetPublicKey: string,
  email: string,
  userOrgId: string,
) =>
  await turnkey?.serverSign("emailAuth", [
    {
      email: email,
      targetPublicKey: targetPublicKey,
      organizationId: userOrgId,
      emailCustomization: {
        appName: "Just for You",
        magicLinkTemplate: `${process.env.NEXT_PUBLIC_BASE_URL}/verify?email=${email}&credentialBundle=%s`,
      },
    },
  ]);

export { fetchSubOrgs, createSubOrg, sendEmail };
