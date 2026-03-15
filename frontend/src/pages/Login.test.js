import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Login from "./Login";

const mockStore = configureStore([]);

test("renders login button", () => {
  const store = mockStore({
    auth: { loading: false, error: null }
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  // Check for the "Login" heading
  const headingElement = screen.getByRole("heading", { name: /login/i });
  expect(headingElement).toBeInTheDocument();

  // Check for the "Login" button
  const buttonElement = screen.getByRole("button", { name: /login/i });
  expect(buttonElement).toBeInTheDocument();
});




