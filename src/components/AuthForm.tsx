"use client";

import React, { useState } from "react";
import { useTurnkey } from "@turnkey/sdk-react";
import { TurnkeySDKApiTypes } from "@turnkey/sdk-browser";

const AuthForm = () => {
  const { turnkey, authIframeClient } = useTurnkey();
  const [email, setEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);

  const handleSubmit = async () => {
    let userOrgId = "";
    const subOrgIds = (await turnkey?.serverSign("getSubOrgIds", [
      {
        filterType: "EMAIL",
        filterValue: email,
      },
    ])) as TurnkeySDKApiTypes.TGetSubOrgIdsResponse;

    const { organizationIds } = subOrgIds;

    if (!organizationIds || organizationIds.length === 0) {
      //user doesn't exist - create a suborg first
      const subOrg = (await turnkey?.serverSign("createSubOrganization", [
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
      const { subOrganizationId } = subOrg;
      userOrgId = subOrganizationId;
    } else {
      //use the first id for now TODO: Figure out how to handle multiple orgs
      userOrgId = organizationIds[0];
    }

    const auth = await turnkey?.serverSign("emailAuth", [
      {
        email: email,
        targetPublicKey: authIframeClient?.iframePublicKey,
        organizationId: userOrgId,
        emailCustomization: {
          appName: "Just for You",
          magicLinkTemplate: `${process.env.NEXT_PUBLIC_BASE_URL}/verify?email=${email}&credentialBundle=%s`,
        },
      },
    ]);
    if (auth) {
      setEmailSubmitted(true);
    } else {
      console.log("Error sending email");
    }
  };

  if (!authIframeClient) {
    return <></>;
  }

  return (
    <>
      {emailSubmitted ? (
        <div className="space-x-2">Check your email for the next steps</div>
      ) : (
        <div className="space-y-2 flex flex-col items-center">
          <div>
            This content is just for you - enter your email to continue!
          </div>
          <div className="space-x-2">
            <span className="text-md">Email</span>
            <input
              onChange={(evt) => setEmail(evt.target.value)}
              className="border border-black"
              type="text"
            />
            <button
              disabled={email.length === 0}
              onClick={handleSubmit}
              className="bg-sky-500 rounded-md py-2 px-3 text-white disabled:bg-slate-300"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export { AuthForm };
