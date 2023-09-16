import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { getDoc, doc } from "firebase/firestore";
import PhotoList from "components/PhotoList";
import { useNavigate } from "react-router-dom";

const Detail = () => {
  const [photos, setPhotos] = useState([]);
  const [userObject, setUserObj] = useState();
  const [myUserObj, setMyUserObj] = useState();
  const [isMe, setIsMe] = useState(false);
  const location = useLocation();
  const userObj = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    setUserObj(userObj.userObj);
    setMyUserObj(userObj.myUserObj);
    getPicList(userObj.userObj.uid);
    console.log("myObj", userObj.myUserObj);

    if (userObj.userObj.uid === userObj.myUserObj.uid) {
      setIsMe(true);
    }
  }, [userObj]);

  const getPicList = async (uid) => {
    if (uid) {
      const userRef = doc(dbService, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const pIdArray = userData.pId || [];
        const reversedPIdArray = pIdArray.slice().reverse();
        setPhotos(reversedPIdArray);
        console.log(reversedPIdArray);
      }
    }
  };

  const onClickSendMessages = () => {
    navigate("/chat", { state: { userObject, myUserObj } });
  };

  return (
    <div className="profile__container">
      <div className="profile">
        {userObject && userObject.profile && (
          <>
            <img className="profile__profile" src={userObject.profile} />
            <div className="profile__info">
              <div className="profile__nickname">{userObject.nickname}</div>
              {!isMe && (
                <button
                  className="profile__message"
                  onClick={onClickSendMessages}
                >
                  Send messages
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="photo-list">
        {photos.map((photoId, index) => (
          <PhotoList key={index} photo={photoId} />
        ))}
      </div>
    </div>
  );
};

export default Detail;
