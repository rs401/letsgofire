import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import {
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../services/auth-svc";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [showErr, setShowErr] = useState(false);


  function handleRegisterSubmit(e) {
    e.preventDefault();
    if(email.trim() === "" || password.trim() === "") {
      setErrMsg("Name, Email and Password cannot be empty.");
      setShowErr(true);
      return;
    }
    if(password !== password2) {
      console.log("passwords don't match: ", password, password2);
      setErrMsg("Passwords do not match.");
      setShowErr(true);
      return;
    }

    registerWithEmailAndPassword(email, password);
  }

  function closeToast() {
    setShowErr(false);
    setErrMsg("");
  }

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/");
    if (error) {
      console.log("error in auth state: ", error);
    }
  }, [user, loading, error, navigate]);

  return (
    <div>
      <Form onSubmit={e => handleRegisterSubmit(e)}>

        <Form.Group className="mb-3" >
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" value={email} onChange={e => {setEmail(e.target.value)}} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => {setPassword(e.target.value)}} />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" value={password2} onChange={e => {setPassword2(e.target.value)}} />
        </Form.Group>
        <Button className="me-2" variant="primary" type="submit">
          Register
        </Button>
        <Button onClick={signInWithGoogle}>Login with Google</Button>
      </Form>
      <ToastContainer className="p-3" position="middle-center">
          <Toast
            onClose={() => closeToast()}
            show={showErr}
            delay={5000}
            autohide
            bg="danger"
          >
            <Toast.Header>
              <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>
              {errMsg}
            </Toast.Body>
          </Toast>
        </ToastContainer>
    </div>
  );
};

export default Register;
