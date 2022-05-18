import React, { useState, useMemo, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import {
  deleteThread,
  updateThread,
  getStates,
  getThread,
} from "../services/category-svc";
import { AuthContext } from "./App";
import { fetchUser } from "../services/auth-svc";

const ThreadInfo = ({ tid }) => {
  const user = useContext(AuthContext);
  const [thread, setThread] = useState({});
  const [threadOwner, setThreadOwner] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [newTitleText, setNewTitleText] = useState("");
  const [newMsgText, setNewMsgText] = useState("");
  const [usstate, setUsstate] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [threadUpdate, setThreadUpdate] = useState(0);
  const toggleShowConfirmDelete = () => setShowConfirmDelete((val) => !val);
  const toggleShowEditForm = () => setShowEditForm((val) => !val);
  let states = getStates();

  const navigate = useNavigate();

  useMemo(() => {
    async function fetchThread() {
      let t = await getThread(tid);
      setThread(t);
    }
    if (threadUpdate > 0) {
      fetchThread().catch((err) => {
        console.log("error fetching threads: ", err);
      });
    }
  }, [threadUpdate, tid]);

  useEffect(() => {
    async function fetchThread() {
      let t = await getThread(tid);
      setThread(t);
      let u = await fetchUser(t.owner);
      setThreadOwner(u);
    }
    fetchThread().catch((err) => {
      console.log("error fetching threads: ", err);
    });
  }, [tid]);

  async function handleDeleteThread() {
    toggleShowConfirmDelete();
    deleteThread(tid).then(() => {
      navigate("/");
    });
  }

  function handleEditClick() {
    setNewTitleText(thread.title);
    setUsstate(thread.state);
    setNewMsgText(thread.message);
    toggleShowEditForm();
  }

  function handleDeleteClick(e) {
    // Show modal to confirm delete, then call delete on thread
    toggleShowConfirmDelete();
  }

  async function handleEditThread(e) {
    // Validate data and call edit thread
    e.preventDefault();
    if (
      newTitleText.trim() === "" ||
      newMsgText.trim() === "" ||
      usstate.trim() === ""
    ) {
      console.log("error: values cannot be empty for: title, message, state.");
      setShowErr(true);
      return;
    }
    let t = {
      title: newTitleText,
      message: newMsgText,
      category: thread.category,
      state: usstate,
    };
    console.log("submitting updated thread: ", t);
    updateThread(tid, t).then(() => {
      setThreadUpdate((val) => (val += 1));
      toggleShowEditForm();
    });
  }

  return (
    <div>
      <Modal show={showConfirmDelete} onHide={toggleShowConfirmDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Thread?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to DELETE this thread? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleShowConfirmDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteThread}>
            Delete!
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className="p-2 mb-2 shadow">
        <Card.Body>
          <Row>
            <Col>
              <img
                className="shadow rounded mb-2"
                alt=""
                src={threadOwner.profileImage}
              />
              <br />
              <span className="">{threadOwner.displayName}</span>
            </Col>
            <Col xs={10}>
              <Card.Title>{thread.title}</Card.Title>
              <Card.Text>{thread.message}</Card.Text>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          {user !== null && user.uid === thread.owner ? (
            <>
              <Button className="me-2" size="sm" onClick={handleEditClick}>
                Edit
              </Button>
              <Button className="me-2" size="sm" onClick={handleDeleteClick}>
                Delete
              </Button>
            </>
          ) : null}
        </Card.Footer>
        {showEditForm ? (
          <Container className="mb-2">
            <Form
              onSubmit={(e) => {
                handleEditThread(e);
              }}
            >
              <Form.Group className="mb-3" controlId="formThreadState">
                <Form.Label>Thread State</Form.Label>
                <Form.Select
                  className="shadow-sm"
                  onChange={(e) => {
                    setUsstate(e.target.value);
                  }}
                  aria-label="Choose a state"
                >
                  <option value={thread.state}>{thread.state}</option>
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
                  value={newTitleText}
                  onChange={(e) => {
                    setNewTitleText(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message:</Form.Label>
                <Form.Control
                  value={newMsgText}
                  onChange={(e) => {
                    setNewMsgText(e.target.value);
                  }}
                  as="textarea"
                  rows={3}
                />
              </Form.Group>

              <Button className="me-2" variant="primary" type="submit">
                Submit
              </Button>
              <Button
                onClick={toggleShowEditForm}
                className="me-2"
                variant="primary"
              >
                Cancel
              </Button>
            </Form>
          </Container>
        ) : null}
      </Card>
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
            Values cannot be empty for: title, message, state.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ThreadInfo;
