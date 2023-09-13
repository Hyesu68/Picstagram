import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const Header = ({ userObj, onLogOut }) => {
  const [myUserObj, setMyUserObj] = useState(userObj);

  useEffect(() => {
    console.log(userObj);
    setMyUserObj(userObj);
  }, [userObj]);

  const onProfileClick = () => {
    const userConfirm = window.confirm("Log out?");
    if (userConfirm) {
      onLogOutClick();
    }
  };

  const onLogOutClick = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      setMyUserObj(null);
      onLogOut();
    });
  };

  return (
    <header className="top-bar">
      <div className="top-bar__logo">Picstagram</div>
      {myUserObj && (
        <img
          onClick={onProfileClick}
          src={myUserObj.profile}
          className="pic__profile"
          style={{ width: 30, height: 30, marginRight: 5 }}
        />
      )}
    </header>
  );
};

export default Header;
