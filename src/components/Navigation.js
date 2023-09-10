import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faList, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

const Navigation = ({ userObj }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff", // 원하는 배경색 설정
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1, // Navigation 위로 div 컴포넌트를 올림
      }}
    >
      <BottomNavigation showLabels>
        <BottomNavigationAction
          icon={<FontAwesomeIcon icon={faList} color={"#04AAFF"} size="2x" />}
          color={"#04AAFF"}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          icon={
            <FontAwesomeIcon icon={faPencilAlt} color={"#04AAFF"} size="2x" />
          }
          color={"#04AAFF"}
          component={Link}
          to="/post"
        />
        <BottomNavigationAction
          icon={<FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />}
          color={"#04AAFF"}
          component={Link}
          to="/profile"
        />
      </BottomNavigation>
    </div>
  );
};

export default Navigation;
