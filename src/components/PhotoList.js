import { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { getDoc, doc } from "firebase/firestore";

const PhotoList = ({ photo, index }) => {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if (photo) {
      getPicInfo();
    }
  }, [photo]);

  const getPicInfo = async () => {
    console.log(photo);
    const PicRef = doc(dbService, "pics", `${photo}`);
    const pic = await getDoc(PicRef);
    if (pic.exists()) {
      const picData = pic.data();
      setPhotos(picData);
    }
  };

  return (
    <div className="photo-item" key={index}>
      <img src={photos.attachmentUrl} alt={`Photo ${index + 1}`} />
    </div>
  );
};

export default PhotoList;
