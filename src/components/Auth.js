import React, { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
// import { validateUser, setCurrentUser } from "../services/user";
import { useNavigate } from "react-router-dom";

// const currentURL = window.location.href;
// const afterHash = currentURL.split("#")[1];
// const token = afterHash.split('access_token=')[1].split('&')[0];

const Auth = () => {
  const navigate = useNavigate();

  // var token;
  // if(afterHash !== undefined) {
  //   token = afterHash.split('access_token=')[1].split('&')[0];
  // } else {
  //   token = "";
  // }
  // console.log('token', token);
  useEffect(() => {
    // validateUser(token).then((result) => {
    //   console.log('result: ', result);
    //   setCurrentUser(token);
    //   navigate('/');
    // });
    navigate("/");
  });

  return (
    <div>
      <Spinner animation="border" variant="primary" />
      <Spinner animation="border" variant="secondary" />
      <Spinner animation="border" variant="success" />
      <Spinner animation="border" variant="danger" />
      <Spinner animation="border" variant="warning" />
      <Spinner animation="border" variant="info" />
      <Spinner animation="border" variant="light" />
      <Spinner animation="border" variant="dark" />
    </div>
  );
};

export default Auth;
