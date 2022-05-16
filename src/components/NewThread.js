import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { getStates, createThread } from "../services/category-svc";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./App";

const NewThread = () => {
  let navigate = useNavigate();
  let states = getStates();
  let params = useParams();
  let catId = params.catId;
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [usstate, setUsstate] = useState("");
  const [showErr, setShowErr] = useState(false);
  const user = useContext(AuthContext);
  const returnTo = useLocation().pathname;

  useEffect(() => {
    if (user === null) {
      navigate(`/signin?returnto=${returnTo}`);
    }
  }, [navigate, returnTo, user]);

  async function handleAddThread(e) {
    e.preventDefault();
    if (title.trim() === "" || message.trim() === "" || usstate.trim() === "") {
      console.log("error: values cannot be empty for: title, message, state.");
      setShowErr(true);
      return;
    }
    let t = {
      owner: user.uid,
      title: title,
      message: message,
      category: catId,
      state: usstate,
    };
    console.log("submitting new thread: ", t);
    const newThread = await createThread(t);
    navigate(`/thread/${newThread}`);
  }

  return (
    <div className="py-4">
      <Form
        onSubmit={(e) => {
          handleAddThread(e);
        }}
      >
        <Form.Group className="mb-3" controlId="formThreadState">
          <Form.Label>Thread State</Form.Label>
          <Form.Select
            className="shadow-sm"
            onChange={(e) => {
              setUsstate(e.target.value);
            }}
            aria-label="Filter by state"
          >
            <option value="">Select your State</option>
            {states.map((state) => {
              return (
                <option key={state} value={state}>
                  {state}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formThreadTitle">
          <Form.Label>Thread Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formThreadMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer className="p-3" position="middle-center">
        <Toast
          onClose={() => setShowErr(false)}
          show={showErr}
          delay={5000}
          autohide
          bg="danger"
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>
            Values cannot be empty for: Thread Title, Message, OR Thread State.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default NewThread;
