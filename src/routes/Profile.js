import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { getDoc, doc } from "firebase/firestore";
import PhotoList from "components/PhotoList";

const Profile = ({ userObj }) => {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    getPicList();
  }, []);

  const getPicList = async () => {
    const userRef = doc(dbService, "users", userObj.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const pIdArray = userData.pId || [];
      const reversedPIdArray = pIdArray.slice().reverse();
      setPhotos(reversedPIdArray);
      console.log(reversedPIdArray);
    }
  };

  return (
    <div className="profile__container">
      <img className="profile__profile" src={userObj.profile} />
      <div>{userObj.nickname}</div>

      <div className="photo-list">
        {photos.map((photoId, index) => (
          <PhotoList key={index} photo={photoId} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
