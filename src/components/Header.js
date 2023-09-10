import React from "react";
import { getAuth } from "firebase/auth";

const Header = (userObj, onLogOut) => {
  const onProfileClick = () => {
    const userConfirm = window.confirm("Log out?");
    if (userConfirm) {
      onLogOutClick();
    }
  };

  const onLogOutClick = () => {
    const auth = getAuth();
    auth.signOut().then(() => onLogOut);
  };

  return (
    <header className="top-bar">
      <div className="top-bar__logo">Picstagram</div>
      {userObj.userObj && (
        <img
          onClick={onProfileClick}
          src={userObj.userObj.profile}
          className="pic__profile"
          style={{ width: 30, height: 30, marginRight: 5 }}
        />
      )}
    </header>
  );
};

export default Header;
