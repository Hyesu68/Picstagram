import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Picstagram from "components/Picstagram";

const Home = ({ userObj }) => {
  const [pics, setPics] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "pics"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const picArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPics(picArr);
    });
  }, []);

  return (
    <div className="container">
      <div style={{ marginTop: 20, marginBottom: 30 }}>
        {pics.map((pic) => (
          <Picstagram
            key={pic.id}
            uid={userObj.uid}
            picObj={pic}
            isOwner={pic.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
