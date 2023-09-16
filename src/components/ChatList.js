import { useEffect, useState } from "react";

const ChatList = ({ chat, userObj, myObj }) => {
  const [isMyObj, setIsMyObj] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    // console.log("chatList", chat.creatorId, myObj.uid);
    if (chat.creatorId === myObj.uid) {
      setIsMyObj(true);
    } else {
      setIsMyObj(false);
    }

    setText(chat.chat);
  }, [isMyObj]);

  return (
    <div className="chatlist">
      {!isMyObj && <img className="chatlist__img" src={userObj.profile} />}
      {isMyObj ? (
        <span className="chatlist__mychat">{text}</span>
      ) : (
        <span className="chatlist__yourchat">{text}</span>
      )}
    </div>
  );
};

export default ChatList;
