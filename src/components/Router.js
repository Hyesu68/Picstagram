import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "routes/Profile";
import Post from "routes/Post";
import Signup from "routes/Signup";
import Chat from "routes/Chat";
import Detail from "routes/Detail";

const AppRouter = ({ refreshUser, isLoggedIn, userObj, setUser }) => {
  const [isDetail, setIsDetail] = useState(false);

  const setDetail = (detail) => {
    setIsDetail(detail);
  };

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
              <Route
                path="/"
                element={<Home userObj={userObj} setDetail={setDetail} />}
              />
              <Route
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              />
              <Route path="/post" element={<Post userObj={userObj} />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/detail" element={<Detail />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Auth />} />
              <Route
                path="/signup"
                element={<Signup setUser={setUser} refreshUser={refreshUser} />}
              />
            </>
          )}
        </Routes>
      </div>

      {isLoggedIn && !isDetail && <Navigation userObj={userObj} />}
    </Router>
  );
};

export default AppRouter;
