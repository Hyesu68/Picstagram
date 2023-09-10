import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import {
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
} from "firebase/firestore";
import { deleteObject, ref, getStorage } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faTrash,
  faPencilAlt,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Comment from "./Comment";

const Picstagram = ({ uid, picObj, isOwner }) => {
  const [myUserObj, setMyUserObj] = useState();
  const [newPic, setNewPic] = useState(picObj.text);
  const [heart, setHeart] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userObj, setUserObj] = useState();
  const storageService = getStorage();
  const navigate = useNavigate();

  const handleGoPost = () => {
    navigate("/post", { state: { picObj } });
  };

  useEffect(() => {
    // console.log(picObj);
    if (picObj.heart) {
      setHeart(picObj.heart);
    }

    getUserInfo();
    getMyUserInfo();
    getComments();
  }, []);

  const getMyUserInfo = async () => {
    const UserRef = doc(dbService, "users", `${uid}`);
    const user = await getDoc(UserRef);
    if (user.exists()) {
      const userData = user.data();
      setMyUserObj(userData);
    }
  };

  const onCommentSubmit = async (event) => {
    if (comment === "") return;
    event.preventDefault();

    const picRef = collection(dbService, "pics", `${picObj.id}/comments`);
    await addDoc(picRef, {
      nickname: myUserObj.nickname,
      uid: myUserObj.uid,
      comment: comment,
      date: Date.now(),
    });

    setComment("");
    getComments();
  };

  const getComments = async () => {
    const commentsRef = collection(dbService, "pics", picObj.id, "comments");
    const commentsSnapshot = await getDocs(commentsRef);
    const commentsData = [];

    commentsSnapshot.forEach((doc) => {
      doc.key = doc.id;
      commentsData.push(doc.data());
    });

    setComments(commentsData);
    console.log(commentsData);
  };

  const getUserInfo = async () => {
    const UserRef = doc(dbService, "users", `${picObj.creatorId}`);
    const user = await getDoc(UserRef);
    if (user.exists()) {
      const userData = user.data();
      // console.log(userData);
      setUserObj(userData);
    }
  };

  const PicTextRef = doc(dbService, "pics", `${picObj.id}`);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this photo?");
    console.log(ok);
    if (ok) {
      await deleteDoc(PicTextRef);
      const storageRef = ref(storageService, picObj.attachmentUrl);
      await deleteObject(storageRef);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줌
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const toggleEditing = () => {
    handleGoPost();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setComment(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    await updateDoc(PicTextRef, {
      text: newPic,
    });

    // setEditing(false);
  };

  const handleHeartClick = async (event) => {
    event.preventDefault();

    await updateDoc(PicTextRef, {
      heart: heart + 1,
    });
    setHeart(heart + 1);
  };

  return (
    <div className="pic">
      <div className="pic__main">
        {userObj && (
          <div className="pic__bottom">
            <div className="pic__heart">
              <img
                src={userObj.profile}
                className="pic__profile"
                style={{ width: 30, height: 30, marginRight: 5 }}
              />
              <h1 style={{ fontWeight: "bold" }}>{userObj.nickname}</h1>
            </div>
            {isOwner && (
              <div className="pic__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </div>
        )}
        {picObj.attachmentUrl && (
          <img src={picObj.attachmentUrl} onDoubleClick={handleHeartClick} />
        )}
        <div className="pic__bottom">
          <div className="pic__heart">
            <span>
              <FontAwesomeIcon
                icon={faHeart}
                style={{ color: "red", marginRight: 5 }}
              />
            </span>
            <h1>{heart}</h1>
          </div>
          <h1 style={{ color: "gray" }}>{formatDateTime(picObj.createdAt)}</h1>
        </div>
        <h4 style={{ marginTop: 10, marginBottom: 10 }}>{picObj.text}</h4>

        <div>
          {comments.map((comment, index) => (
            <Comment key={index} commentObj={comment} />
          ))}
        </div>

        <form onSubmit={onCommentSubmit}>
          <div className="picInput__container">
            <input
              className="picInput__input"
              type="text"
              onChange={onChange}
              placeholder="Comment"
              maxLength={120}
              value={comment}
            />
            <input type="submit" value="&rarr;" className="picInput__arrow" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Picstagram;
