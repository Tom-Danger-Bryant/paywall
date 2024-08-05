import React from "react";
import { render } from "@testing-library/react";
import { Spinner } from "../Spinner/Spinner";

describe("Spinner Component", () => {
  it("should be visible when visible prop is true", () => {
    const { getByTestId } = render(<Spinner visible={true} />);
    const spinner = getByTestId("spinner");
    expect(spinner).not.toHaveClass("hidden");
  });

  it("should be hidden when visible prop is false", () => {
    const { queryByTestId } = render(<Spinner visible={false} />);
    const spinner = queryByTestId("spinner");
    expect(spinner).toHaveClass("hidden");
  });
});
