import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "routes/Profile";
import Post from "routes/Post";
import Signup from "routes/Signup";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home userObj={userObj} />} />
              <Route
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              />
              <Route path="/post" element={<Post userObj={userObj} />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Auth />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
        </Routes>
      </div>

      {isLoggedIn && <Navigation userObj={userObj} />}
    </Router>
  );
};

export default AppRouter;
