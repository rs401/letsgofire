import React, { useEffect, useState } from "react";
import Reply from "./Reply";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getThread, getReplies, createReply } from "../services/category-svc";
import { auth } from "../firebase-config";

function Thread() {
  const [user, loading, error] = useAuthState(auth);
  const params = useParams();
  const [thread, setThread] = useState({});
  const [replies, setReplies] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [newReplyText, setNewReplyText] = useState("");
  const toggleShowReplyForm = () => setShowReplyForm((val) => !val);

  function handleReplyClick() {
    toggleShowReplyForm();
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
    if(results !== "") {
      setNewReplyText("");
      toggleShowReplyForm();
      console.log("added new reply");
    }
  }

  async function fetchThread() {
    let t = await getThread(params.threadId);
    setThread(t);
  }

  async function fetchReplies() {
    let r = await getReplies(params.threadId);
    setReplies(r);
  }

  useEffect(() => {
    if (loading) return;
    // fetchThread();
    getThread(params.threadId).then((data) => {
      setThread(data);
    });
    // fetchReplies();
    getReplies(params.threadId).then((data) => {
      setReplies(data);
    });
    if (error) {
      console.log("error in auth state: ", error);
    }
  }, [loading, error,params.threadId]);

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
      </div>
    );
  } else {
    return (
      <div>
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
        <ListGroup className="shadow">
          {replies.map((reply) => {
            return (
              <ListGroup.Item key={reply.id} variant="light" className="p-3">
                <Reply reply={reply.message} />
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
