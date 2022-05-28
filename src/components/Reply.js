import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { AuthContext } from "./App";
import { ReplyUpdateContext } from "./Thread";
import { updateReply, deletereply } from "../services/category-svc";
import { fetchUser } from "../services/auth-svc";
import {Link} from "react-router-dom";

function Reply({ reply }) {
  const user = useContext(AuthContext);
  const update = useContext(ReplyUpdateContext);
  const [replyOwner, setReplyOwner] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newMsgText, setNewMsgText] = useState("");
  const [showErr, setShowErr] = useState(false);
  const toggleShowConfirmDelete = () => setShowConfirmDelete((val) => !val);
  const toggleShowEditForm = () => setShowEditForm((val) => !val);

  function handleEditClick() {
    setNewMsgText(reply.data().message);
    toggleShowEditForm();
  }

  function handleDeleteClick() {
    toggleShowConfirmDelete();
  }

  async function handleEditReply(e) {
    // Validate data and call edit thread
    e.preventDefault();
    if (newMsgText.trim() === "") {
      console.log("error: value cannot be empty for message.");
      setShowErr(true);
      return;
    }
    let r = {
      message: newMsgText,
    };
    console.log("submitting updated reply: ", r);
    updateReply(reply.id, r).then(() => {
      toggleShowEditForm();
      update((val) => (val += 1));
    });
  }

  async function handleDeleteReply() {
    toggleShowConfirmDelete();
    deletereply(reply.id).then(() => {
      update((val) => (val += 1));
    });
  }

  function characterCount() {
    if (newMsgText.trim().length > 20) {
      return 0;
    }
    return 20 - newMsgText.trim().length;
  }

  useEffect(() => {
    async function getOwner() {
      let u = await fetchUser(reply.data().owner);
      setReplyOwner(u);
    }
    getOwner().catch((err) => console.log("error: ", err));
  }, [reply]);

  return (
    <div>
      <Modal show={showConfirmDelete} onHide={toggleShowConfirmDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Reply?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to DELETE this reply? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleShowConfirmDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteReply}>
            Delete!
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col>
          <img
            className="rounded"
            alt="Profile"
            src={replyOwner.profileImage}
            referrerPolicy="no-referrer"
          />
          <br />
          <Link to={`/user/${replyOwner.uid}`} className="">{replyOwner.displayName}</Link>
        </Col>
        <Col xs={10}>{reply.data().message}</Col>
      </Row>
      {user !== null && user.uid === reply.data().owner ? (
        <div>
          <Button className="me-2" size="sm" onClick={handleEditClick}>
            Edit
          </Button>
          <Button className="me-2" size="sm" onClick={handleDeleteClick}>
            Delete
          </Button>
        </div>
      ) : null}
      {showEditForm ? (
        <Container className="mb-2">
          <Form
            onSubmit={(e) => {
              handleEditReply(e);
            }}
          >
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
              <Form.Text>
                Minimum message length: {characterCount()} more characters.
              </Form.Text>
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
          <Toast.Body>Value cannot be empty for message.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Reply;
