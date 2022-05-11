import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../services/auth-svc";

function SignIn() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user !== null) {
      console.log("user", user);
      if (user) navigate("/");
    }
    if (error) {
      console.log("error in auth state: ", error);
    }
  }, [user, loading, error, navigate]);
  return (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Button
            className="me-2"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </Button>
          <Button onClick={signInWithGoogle}>Login with Google</Button>
          <div>
            <Link to="/">Forgot Password</Link>
          </div>
          <div>
            Don't have an account? <Link to="/register">Register</Link> now.
          </div>
        </Form.Group>
      </Form>
  );
}
export default SignIn;
