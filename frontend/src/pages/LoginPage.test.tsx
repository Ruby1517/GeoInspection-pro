import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { LoginPage } from "./LoginPage";

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  it("renders login form fields", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});
