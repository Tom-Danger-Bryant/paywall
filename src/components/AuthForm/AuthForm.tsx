"use client";

import React, { useState } from "react";
import { useTurnkey } from "@turnkey/sdk-react";
import { Turnkey, TurnkeySDKApiTypes } from "@turnkey/sdk-browser";
import { fetchSubOrgs, createSubOrg, sendEmail } from "./AuthForm.utils";

const AuthForm = () => {
  const { turnkey, authIframeClient } = useTurnkey();
  const [email, setEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (turnkey && authIframeClient) {
      let userOrgId = "";
      //first grab the usersSuborgs
      const { organizationIds } = await fetchSubOrgs(turnkey as Turnkey, email);
      if (!organizationIds || organizationIds.length === 0) {
        //user doesn't exist - create a suborg first
        const { subOrganizationId } = await createSubOrg(
          turnkey as Turnkey,
          email,
        );
        userOrgId = subOrganizationId;
      } else {
        //use the first id for now TODO: Figure out how to handle multiple orgs
        userOrgId = organizationIds[0];
      }
      //send an email to the user
      const auth = await sendEmail(
        turnkey as Turnkey,
        authIframeClient.iframePublicKey!,
        email,
        userOrgId,
      );
      if (auth) {
        setEmailSubmitted(true);
      } else {
        console.log("Error sending email");
      }
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
