import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getStates, createThread } from "../services/category-svc";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

const NewThread = () => {
  let navigate = useNavigate();
  let states = getStates();
  let params = useParams();
  let catId = params.catId;
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(''); 
  const [usstate, setUsstate] = useState('');
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    // if (!user) return navigate("/");
  }, [user, loading]);

  async function handleAddThread(e) {
    e.preventDefault();
    if(title.trim() === "" || message.trim() === "" || usstate.trim() === "") {
      console.log('error: values cannot be empty for: title, message, state.');
      return;
    }
    let t = {
      owner: user.uid,
      title: title,
      message: message,
      category: catId,
      state: usstate,
    };
    console.log('submitting new thread: ', t);
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
        onChange={e => { setUsstate(e.target.value)}}
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
          <Form.Control type="text" value={title} onChange={e => { setTitle(e.target.value)}} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formThreadMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} value={message} onChange={e => { setMessage(e.target.value)}} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );

};

export default NewThread;
