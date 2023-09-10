import React from "react";
import PicFactory from "components/PicFactory";

const Post = ({ userObj, picObj }) => {
  return <PicFactory userObj={userObj} picObj={picObj} />;
};

export default Post;
