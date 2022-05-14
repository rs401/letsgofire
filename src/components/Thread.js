import React, { useEffect, useState, useMemo } from "react";
import Reply from "./Reply";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  getStates,
  getThread,
  getReplies,
  createReply,
  updateThread,
  deleteThread,
} from "../services/category-svc";
import { auth } from "../firebase-config";

function Thread() {
  const [user, loading, error] = useAuthState(auth);
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [thread, setThread] = useState({});
  const [replies, setReplies] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newReplyText, setNewReplyText] = useState("");
  const [newTitleText, setNewTitleText] = useState("");
  const [newMsgText, setNewMsgText] = useState("");
  const toggleShowReplyForm = () => setShowReplyForm((val) => !val);
  const toggleShowEditForm = () => setShowEditForm((val) => !val);
  const toggleShowConfirmDelete = () => setShowConfirmDelete((val) => !val);
  const navigate = useNavigate();
  const [usstate, setUsstate] = useState("");
  const [threadUpdate, setThreadUpdate] = useState(0);
  let states = getStates();

  useMemo(() => {
    async function fetchThread() {
      let t = await getThread(params.threadId);
      setThread(t);
    }
    if(threadUpdate > 0) {
      fetchThread().catch((err) => {
        console.log("error fetching threads: ", err);
      });
    }
  }, [threadUpdate, params.threadId]);

  function handleReplyClick() {
    toggleShowReplyForm();
  }

  function handleEditClick() {
    setNewTitleText(thread.title);
    setUsstate(thread.state);
    setNewMsgText(thread.message);
    toggleShowEditForm();
  }

  async function handleAddReply(e) {
    e.preventDefault();
    if (newReplyText.trim().length < 20) {
      setShowErr(true);
    }
    // call a method in category-svc to add reply
    let r = {
      owner: user.uid,
      message: newReplyText,
      thread: params.threadId,
    };
    const results = await createReply(r);
    if (results !== "") {
      setNewReplyText("");
      toggleShowReplyForm();
      console.log("added new reply");
    }
  }

  function handleDeleteClick(e) {
    // Show modal to confirm delete, then call delete on thread
    toggleShowConfirmDelete();
  }
  
  async function handleDeleteThread() {
    toggleShowConfirmDelete();
    deleteThread(params.threadId).then(() => {
      navigate("/");
    });
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
      return;
    }
    let t = {
      owner: user.uid,
      title: newTitleText,
      message: newMsgText,
      category: thread.category,
      state: usstate,
    };
    console.log("submitting updated thread: ", t);
    updateThread(params.threadId, t).then(() => {
      setThreadUpdate((val) => val += 1);
      toggleShowEditForm();
    });
  }

  useEffect(() => {
    if (loading) return;
    async function fetchThread() {
      let t = await getThread(params.threadId);
      setThread(t);
    }

    async function fetchReplies() {
      let r = await getReplies(params.threadId);
      setReplies(r);
    }

    fetchThread().catch((err) => {
      console.log("error fetching threads: ", err);
    });
    fetchReplies().catch((err) => {
      console.log("error fetching replies: ", err);
    });
    if (error) {
      console.log("error in auth state: ", error);
    }
    setLoaded(true);
  }, [loading, error, params.threadId]);

  if (replies.length === 0) {
    return (
      <div className="mt-3">
        <Card className="p-2 mb-2 shadow">
          <Card.Body>
            <Card.Title>{thread.title}</Card.Title>
            <Card.Text>{thread.message}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button onClick={handleReplyClick}>Reply</Button>
          </Card.Footer>
        </Card>
        {showReplyForm ? (
          <Container className="mb-2">
            <Form
              onSubmit={(e) => {
                handleAddReply(e);
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Your reply message:</Form.Label>
                <Form.Control
                  value={newReplyText}
                  onChange={(e) => {
                    setNewReplyText(e.target.value);
                  }}
                  as="textarea"
                  rows={3}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Container>
        ) : null}
        {!loaded ? (
          <ListGroup>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
            <ListGroup.Item>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
          </ListGroup>
        ) : (
          <div>No replies yet.</div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <Modal show={showConfirmDelete} onHide={toggleShowConfirmDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Thread?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to DELETE this thread? This cannot be undone.</Modal.Body>
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
            <Card.Title>{thread.title}</Card.Title>
            <Card.Text>{thread.message}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button className="me-2" size="sm" onClick={handleReplyClick}>Reply</Button>
            {user.uid === thread.owner ? (
              <>
                <Button className="me-2" size="sm" onClick={handleEditClick}>Edit</Button>
                <Button className="me-2" size="sm" onClick={handleDeleteClick}>Delete</Button>
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
                <Button onClick={toggleShowEditForm} className="me-2" variant="primary">
                  Cancel
                </Button>
              </Form>
            </Container>
          ) : null}
        </Card>
        {showReplyForm ? (
          <Container className="mb-2">
            <Form
              onSubmit={(e) => {
                handleAddReply(e);
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Your reply message:</Form.Label>
                <Form.Control
                  value={newReplyText}
                  onChange={(e) => {
                    setNewReplyText(e.target.value);
                  }}
                  as="textarea"
                  rows={3}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="danger" onClick={handleReplyClick}>
                Cancel
              </Button>
            </Form>
          </Container>
        ) : null}
        <ListGroup className="shadow">
          {replies.map((reply) => {
            return (
              <ListGroup.Item key={reply.id} variant="light" className="p-3">
                <Reply reply={reply} />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
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
              Your message must be at least 20 characters.
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    );
  }
}

export default Thread;
