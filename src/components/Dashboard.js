import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { auth } from "../firebase-config";
import { fetchUser, updateUser } from "../services/auth-svc";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showsuccess, setShowsuccess] = useState(false);
  const [showerr, setShowerr] = useState(false);
  const [errmsg, setErrmsg] = useState("");

  async function handleSaveAccountChanges(e) {
    e.preventDefault();
    if (displayName.trim() === "") {
      setErrmsg("Display Name cannot be empty.");
      setShowerr(true);
      return;
    }
    // update user info in users collection
    updateUser(user.uid, profileImage, displayName).then(() => {
      navigate("/account", { replace: true });
    });
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (user) {
      fetchUser(user.uid).then((data) => {
        setDisplayName(data.displayName);
        setProfileImage(data.profileImage);
      });
    }
    if(error) {
      console.log("error in auth state: ", error);
    }
  }, [user, loading, error, navigate]);

  if (user) {
    return (
      <div>
        <Container>
          <h4>Hello {displayName}</h4>
          <Container className="p-2 border">
            <Form
              onSubmit={(e) => {
                handleSaveAccountChanges(e);
              }}
            >
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formProfilePicture"
              >
                <Form.Label column sm="2">
                  <img src={profileImage} alt="profile" />
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={profileImage}
                    onChange={(e) => {
                      setProfileImage(e.target.value);
                    }}
                  />
                  <Form.Text className="text-muted">
                    URL of your profile picture
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col sm="10">
                  <Form.Control plaintext readOnly defaultValue={user.email} />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextNickname"
              >
                <Form.Label column sm="2">
                  Display Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextNickname"
              >
                <Form.Label column sm="2"></Form.Label>
                <Col sm="10">
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Col>
              </Form.Group>
            </Form>
            <ToastContainer className="p-3" position="middle-center">
              <Toast
                bg="danger"
                show={showerr}
                onClose={() => setShowerr(false)}
                delay={5000}
                autohide
              >
                <Toast.Header>
                  <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>
                  <h4>{errmsg}</h4>
                </Toast.Body>
              </Toast>
            </ToastContainer>
            <ToastContainer className="p-3" position="middle-center">
              <Toast
                bg="success"
                show={showsuccess}
                onClose={() => setShowsuccess(false)}
                delay={5000}
                autohide
              >
                <Toast.Header>
                  <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>
                  <h4>Successfully updated your profile.</h4>
                </Toast.Body>
              </Toast>
            </ToastContainer>
          </Container>
        </Container>
      </div>
    );
  } else {
    return (
      <>
        <Spinner animation="border" variant="primary" />
        <Spinner animation="border" variant="secondary" />
        <Spinner animation="border" variant="success" />
        <Spinner animation="border" variant="danger" />
        <Spinner animation="border" variant="warning" />
        <Spinner animation="border" variant="info" />
        <Spinner animation="border" variant="light" />
        <Spinner animation="border" variant="dark" />
      </>
    );
  }

  // return (
  //   <div >
  //      <div >
  //       Logged in as
  //        <div>{name}</div>
  //        <div>{user?.email}</div>
  //        <button  onClick={signOut}>
  //         Logout
  //        </button>
  //      </div>
  //    </div>
  // );
}
export default Dashboard;
