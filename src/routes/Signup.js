import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { dbService } from "fbase";
import { setDoc, collection, doc } from "firebase/firestore";
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

const Signup = ({ setUser, refreshUser }) => {
  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const storageService = getStorage();
  const onSubmit = async (event) => {
    if (!attachment || !email || !password || !nickname) {
      return;
    }

    event.preventDefault();
    try {
      let data;
      const auth = getAuth();
      data = await createUserWithEmailAndPassword(auth, email, password);

      let attachmentUrl = "";
      const attachmentRef = ref(
        storageService,
        `profiles/${data.user.uid}/${v4()}`
      );
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);

      const usersCollection = collection(dbService, "users");
      const userDocRef = doc(usersCollection, data.user.uid);
      const userObj = {
        uid: data.user.uid,
        email: email,
        nickname: nickname,
        profile: attachmentUrl,
      };
      await setDoc(userDocRef, userObj);
      console.log(data);
      setUser(userObj);
      refreshUser();
      handleGoHome();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "nickname") {
      setNickname(value);
    }
  };
  const onClearPhotoClick = () => setAttachment("");

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__attachmentContainer">
        {!attachment && (
          <>
            <label htmlFor="attach-file" className="factoryInput__label">
              <span>Add Photos</span>
              <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
              id="attach-file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              style={{ opacity: 0 }}
            />
          </>
        )}
        {attachment && (
          <div className="factoryForm__attachment">
            <img src={attachment} style={{ backgroundImage: attachment }} />
          </div>
        )}
        {attachment && (
          <div className="factoryForm__clear" onClick={onClearPhotoClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        )}
      </div>
      <input
        className="signupInput__input"
        type="email"
        name="email"
        onChange={onChange}
        placeholder="email"
        required
        maxLength={120}
        value={email}
      />
      <input
        className="signupInput__input"
        type="password"
        name="password"
        onChange={onChange}
        placeholder="password"
        required
        maxLength={120}
        value={password}
      />
      <input
        className="signupInput__input"
        type="text"
        name="nickname"
        required
        onChange={onChange}
        placeholder="nickname"
        maxLength={120}
        value={nickname}
      />
      <button className="signup__button">Sign Up</button>
    </form>
  );
};

export default Signup;
