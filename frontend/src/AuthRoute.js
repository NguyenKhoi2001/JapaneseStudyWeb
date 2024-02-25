import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  // If there's a token, redirect to home page instead of showing login/register
  if (token) {
    console.log("user logged in already");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
