import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { dbService } from "fbase";
import {
  getDocs,
  doc,
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import ChatList from "components/ChatList";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [myObj, setMyObj] = useState();
  const [userObj, setUserObj] = useState();
  const location = useLocation();
  const [chat, setChat] = useState("");
  const [cId, setCId] = useState();
  const chatListRef = useRef(null);

  const userObject = location.state;

  useEffect(() => {
    setUserObj(userObject.userObject);
    setMyObj(userObject.myUserObj);

    const result = getCID();
    const messagesCollectionRef = collection(
      dbService,
      "chats",
      result,
      "messages"
    );

    const orderedMessagesCollectionRef = query(
      messagesCollectionRef,
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(
      orderedMessagesCollectionRef,
      (querySnapshot) => {
        const messagesData = [];
        querySnapshot.forEach((doc) => {
          const message = { key: doc.id, ...doc.data() };
          messagesData.push(message);
        });

        console.log(messagesData);
        setChats(messagesData);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [userObject]);

  const getCID = () => {
    const str1 = userObject.userObject.uid;
    const str2 = userObject.myUserObj.uid;
    const result = str1.localeCompare(str2) <= 0 ? str1 + str2 : str2 + str1;
    setCId(result);
    return result;
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setChat(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const chatDocRef = doc(dbService, "chats", cId);
    const messagesCollectionRef = collection(chatDocRef, "messages");
    try {
      await addDoc(messagesCollectionRef, {
        chat: chat,
        createdAt: Date.now(),
        creatorId: myObj.uid,
      });
    } catch (error) {
      console.error("Error adding document to subcollection:", error);
    }
    setChat("");
  };

  const scrollToBottom = () => {
    if (chatListRef.current) {
      console.log(chatListRef.current);
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
      console.log("scrollToBottom");
    }
  };
  useEffect(() => {
    scrollToBottom();
    console.log("useEffect called");
  }, [chats]);

  return (
    <div className="chat__container">
      <div className="profile">
        {userObj && userObj.profile && (
          <>
            <img className="profile__profile" src={userObj.profile} />
            <div className="profile__info">
              <div className="profile__nickname">{userObj.nickname}</div>
            </div>
          </>
        )}
      </div>

      <div className="chatlist-container" ref={chatListRef}>
        {chats.map((chat, index) => (
          <ChatList key={index} chat={chat} myObj={myObj} userObj={userObj} />
        ))}
      </div>

      <form onSubmit={onSubmit}>
        <div className="chatInput__div">
          <div className="chatInput__container">
            <input
              className="factoryInput__input"
              type="text"
              onChange={onChange}
              placeholder="Message"
              maxLength={120}
              value={chat}
            />
            <input
              type="submit"
              value="&rarr;"
              className="factoryInput__arrow"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;
