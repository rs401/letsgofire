import React, { useState, useEffect, useMemo } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams, Link } from "react-router-dom";
import { getStates, getThreads } from "../services/category-svc";

function Category() {
  let params = useParams();
  let states = getStates();
  const cat = params.catId;
  const [location, setLocation] = useState("");
  const [threads, setThreads] = useState([]);
  const [fetched, setFetched] = useState(false);

  const filteredThreads = useMemo(() => {
    if(location === "") {
      return threads;
    } else {
      return threads.filter((thread) => thread.data().state === location);
    }
  },[location, threads]);

  async function fetchThreads() {
    try {
      const threadsData = await getThreads(cat);
      setThreads(threadsData);
    } catch (err) {
      console.log("error fetching threads.", err);
    }
  }

  useEffect(() => {
    if (!fetched) {
      setFetched(true);
      fetchThreads();
    }
  }, [fetched]);

  function filterByState(e) {
    if (e.target.value === "") {
      setLocation("");
    } else {
      setLocation(e.target.value);
    }
  }

  return (
    <div>
      <Form.Select
        className="shadow-sm"
        onChange={filterByState}
        aria-label="Filter by state"
      >
        <option value="">Filter by state</option>
        {states.map((state) => {
          return (
            <option key={state} value={state}>
              {state}
            </option>
          );
        })}
      </Form.Select>
      <Card className="my-2 shadow-sm">
        <Card.Body>
          <div className="p-3">Category: <h3>{cat}</h3></div>
          <div className="justify-content-end">
            <Button href={`/newthread/${cat}`} variant="outline-primary">
              New Thread
            </Button>{" "}
          </div>
        </Card.Body>
      </Card>

      <ListGroup className="shadow-sm">
        {filteredThreads.map((thread, index) => {
          return (
            <Link
              key={thread.id}
              to={`/thread/${thread.id}`}
              style={{ textDecoration: "none" }}
            >
              <ListGroup.Item
                action
                variant="light"
                className="p-3 d-flex justify-content-between align-items-start"
              >
                <div>{thread.data().title}</div>
                <div>
                  <span>{thread.data().state}</span>
                  {"  "}
                  <Badge bg="primary" pill>
                    1
                  </Badge>
                </div>
              </ListGroup.Item>
            </Link>
          );
        })}
      </ListGroup>
    </div>
  );
}

export default Category;
