import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { AuthForm } from "../";
import { useTurnkey } from "@turnkey/sdk-react";
import {
  fetchSubOrgs,
  createSubOrg,
  sendEmail,
} from "../AuthForm/AuthForm.utils";

jest.mock("@turnkey/sdk-react", () => ({
  useTurnkey: jest.fn(),
}));

jest.mock("../AuthForm/AuthForm.utils", () => ({
  fetchSubOrgs: jest.fn(),
  createSubOrg: jest.fn(),
  sendEmail: jest.fn(),
}));

describe("AuthForm Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Shows the email message if the user has a sub org after submission", async () => {
    //@ts-expect-error type changed at runtime (mock)
    useTurnkey.mockReturnValue({
      turnkey: { serverSign: jest.fn() },
      authIframeClient: { iframePublicKey: "dummyPublicKey" },
    });

    //@ts-expect-error type changed at runtime (mock)
    fetchSubOrgs.mockReturnValue({ organizationIds: [1] });
    //@ts-expect-error type changed at runtime (mock)
    sendEmail.mockReturnValue(true);

    const { getByText, getByRole } = render(<AuthForm />);

    fireEvent.change(getByRole("textbox"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(getByText("Submit"));

    // Wait for the email submission message to appear
    await waitFor(() => {
      expect(
        getByText("Check your email for the next steps"),
      ).toBeInTheDocument();
    });
  });

  it("calls createSubOrg if the user doesnt have an org", async () => {
    //@ts-expect-error type changed at runtime (mock)
    useTurnkey.mockReturnValue({
      turnkey: { serverSign: jest.fn() },
      authIframeClient: { iframePublicKey: "dummyPublicKey" },
    });

    //@ts-expect-error type changed at runtime (mock)
    fetchSubOrgs.mockReturnValue({ organizationIds: [] });
    //@ts-expect-error type changed at runtime (mock)
    createSubOrg.mockReturnValue({ subOrganizationId: 1 });
    //@ts-expect-error type changed at runtime (mock)
    sendEmail.mockReturnValue(true);

    const { getByText, getByRole } = render(<AuthForm />);

    fireEvent.change(getByRole("textbox"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(getByText("Submit"));

    // Wait for the email submission message to appear
    await waitFor(() => {
      expect(
        getByText("Check your email for the next steps"),
      ).toBeInTheDocument();
      expect(createSubOrg).toHaveBeenCalled();
    });
  });
});
