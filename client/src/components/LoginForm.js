import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "./mutations";

function LoginForm(props) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [login, { error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      console.log("User logged in:", data);
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      const { token } = data.login;
      localStorage.setItem("jwtToken", token);
      setFormState({
        email: "",
        password: "",
      });
    } catch (e) {
      console.error("Error logging in:", e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>Error logging in!</p>}
    </div>
  );
}

export default LoginForm;
