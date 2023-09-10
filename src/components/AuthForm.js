import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../styles.css";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleGoSignup = () => {
    navigate("/signup");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      const auth = getAuth();
      // if (newAccount) {
      // data = await createUserWithEmailAndPassword(auth, email, password);
      // } else {
      data = await signInWithEmailAndPassword(auth, email, password);
      // }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          onChange={onChange}
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          className="authInput"
        />
        <input
          onChange={onChange}
          name="password"
          type="password"
          placeholder="Password"
          required
          className="authInput"
          value={password}
        />
        <input
          type="submit"
          className="authInput authSubmit"
          // value={newAccount ? "Create Account" : "Sign In"}
          value="Sign In"
        />
        {error && <span className="authError">{error}</span>}
      </form>

      {/* <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign in" : "Create Account"}
      </span> */}
      <span className="authSwitch" onClick={handleGoSignup}>
        Create Account
      </span>
    </>
  );
};

export default AuthForm;
