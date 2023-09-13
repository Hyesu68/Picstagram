import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import AppRouter from "components/Router";
import Header from "./Header";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [init, setInit] = useState(false);
  const [userObject, setUserObject] = useState(null);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log("app useEffect", user);
      if (user) {
        setUserObject({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) =>
            updateProfile(user, {
              displayName: user.displayName,
            }),
        });
        getMyUserInfo(user.uid);
      } else {
        setUserObject(null);
      }
      setInit(true);
    });
  }, []);

  const getMyUserInfo = async (uid) => {
    const UserRef = doc(dbService, "users", `${uid}`);
    const user = await getDoc(UserRef);
    if (user.exists()) {
      console.log("app getMyUserInfo", user);
      const userData = user.data();
      setUserObj(userData);
    }
  };

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObject({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) =>
        updateProfile(user, {
          displayName: user.displayName,
        }),
    });
    getMyUserInfo(user.uid);
  };

  const onLogOut = () => {
    setUserObj(null);
    setUserObject(null);
  };

  return (
    <>
      <Header userObj={userObj} onLogOut={onLogOut} refreshUser={refreshUser} />
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          setUser={setUserObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
