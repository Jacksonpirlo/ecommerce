// Input.test.tsx
import { render, screen } from "@testing-library/react";
import Input from "@/modules/auth/components/atoms/Input";

describe("Input Atom", () => {
  test("se renderiza correctamente con placeholder y valor", () => {
    render(
      <Input
        className="input-base"
        placeHolder="Jackson"
        value="Jackson"
        onChange={() => {}}
      />
    );

    const inputElement = screen.getByPlaceholderText("Jackson");
    expect(inputElement).toBeInTheDocument();

    expect(inputElement).toHaveValue("Jackson");

    expect(inputElement).toHaveClass("input-base");
  });
});
