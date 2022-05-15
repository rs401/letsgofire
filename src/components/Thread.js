import React, { useEffect, useState, useContext } from "react";
import Reply from "./Reply";
import ListGroupPlaceholder from "./ListGroupPlaceholder";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams } from "react-router-dom";
import {
  getReplies,
  createReply,
} from "../services/category-svc";
import { AuthContext } from "./App";
import ThreadInfo from "./ThreadInfo";

function Thread() {
  const user = useContext(AuthContext);
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
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
    if (results !== "") {
      setNewReplyText("");
      toggleShowReplyForm();
      console.log("added new reply");
    }
  }


  useEffect(() => {
    async function fetchReplies() {
      let r = await getReplies(params.threadId);
      setReplies(r);
    }

    
    fetchReplies().catch((err) => {
      console.log("error fetching replies: ", err);
    });
    setLoaded(true);
  }, [params.threadId]);

  if (replies.length === 0) {
    return (
      <div className="mt-3">
        <ThreadInfo tid={params.threadId} />
        <Button className="me-2" size="sm" onClick={handleReplyClick}>Reply</Button>
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
          <ListGroupPlaceholder />
        ) : (
          <div>No replies yet.</div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <ThreadInfo tid={params.threadId} />
        <Button className="me-2" size="sm" onClick={handleReplyClick}>Reply</Button>
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
