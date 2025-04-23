import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders correctly", () => {
    render(
      <Button disabled={true} onClick={() => {}}>
        Click me
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
