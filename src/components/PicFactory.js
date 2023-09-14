import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { v4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactLoading from "react-loading";

const PicFactory = ({ userObj }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pic, setPic] = useState("");
  const [attachment, setAttachment] = useState("");
  const [changePic, setChangePic] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const picObj = location.state;

  useEffect(() => {
    if (picObj && picObj.picObj.text) {
      setAttachment(picObj.picObj.attachmentUrl);
      setPic(picObj.picObj.text);
    }
  }, [picObj]);

  const handleGoHome = () => {
    navigate("/");
  };

  const onSubmit = async (event) => {
    if (pic === "") {
      return;
    }

    setIsLoading(true);
    event.preventDefault();

    const storageService = getStorage();
    if (picObj) {
      let attachmentUrl;
      if (changePic) {
        const attachmentRef = ref(
          storageService,
          `pics/${userObj.uid}/${v4()}`
        );
        const response = await uploadString(
          attachmentRef,
          attachment,
          "data_url"
        );
        attachmentUrl = await getDownloadURL(response.ref);
        const updateRef = doc(dbService, "pics", `${picObj.picObj.id}`);
        await updateDoc(updateRef, {
          text: pic,
          attachmentUrl,
        });
      } else {
        const updateRef = doc(dbService, "pics", `${picObj.picObj.id}`);
        await updateDoc(updateRef, {
          text: pic,
        });
      }
    } else {
      let attachmentUrl = "";
      if (attachment != "") {
        const attachmentRef = ref(
          storageService,
          `pics/${userObj.uid}/${v4()}`
        );
        const response = await uploadString(
          attachmentRef,
          attachment,
          "data_url"
        );
        attachmentUrl = await getDownloadURL(response.ref);
      }

      const picsRes = await addDoc(collection(dbService, "pics"), {
        text: pic,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
      });

      const picRef = doc(dbService, "users", `${userObj.uid}`);
      await updateDoc(picRef, {
        pId: arrayUnion(picsRes.id),
      });
    }

    setIsLoading(false);
    setPic("");
    setAttachment("");
    handleGoHome();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setPic(value);
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
    setChangePic(true);
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      {!isLoading && (
        <>
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
          <div className="factoryInput__container">
            <input
              className="factoryInput__input"
              type="text"
              onChange={onChange}
              placeholder="What's on your mind?"
              maxLength={120}
              value={pic}
            />
            <input
              type="submit"
              value="&rarr;"
              className="factoryInput__arrow"
            />
          </div>
        </>
      )}
      {isLoading && (
        <ReactLoading type="spin" color="#000000" className="loading" />
      )}
    </form>
  );
};

export default PicFactory;
