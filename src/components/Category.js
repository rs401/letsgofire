import React, { useState, useEffect, useMemo } from "react";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams, Link } from "react-router-dom";
import { getStates, getThreads, getCat } from "../services/category-svc";

function Category() {
  let params = useParams();
  let states = getStates();
  const cat = params.catId;
  document.title = `Lets GO! - ${cat}`;
  const [location, setLocation] = useState("");
  const [threads, setThreads] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [catData, setCatData] = useState({});

  const filteredThreads = useMemo(() => {
    if (location === "") {
      return threads;
    } else {
      return threads.filter((thread) => thread.data().state === location);
    }
  }, [location, threads]);

  useEffect(() => {
    async function fetchThreads() {
      try {
        const threadsData = await getThreads(cat);
        setThreads(threadsData);
      } catch (err) {
        console.log("error fetching threads.", err);
      }
    }

    async function fetchCat() {
      try {
        const data = await getCat(cat);
        setCatData(data);
      } catch (err) {
        console.log("error fetching threads.", err);
      }
    }

    if (!fetched) {
      setFetched(true);
      fetchThreads();
      fetchCat();
    }
  }, [fetched, cat]);

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
      <Stack className="my-2 shadow-sm p-1" direction="horizontal" gap={3}>
        <div className="ps-3"><h3>Category: {cat}</h3></div>
        <div className="ms-auto">Thread Count: {catData.count || 0}</div>
        <div className="vr" />
        <div className="py-2">
          <Button href={`/category/${cat}/newthread/`} variant="outline-primary">
            New Thread
          </Button>{" "}
        </div>
      </Stack>

      <ListGroup className="shadow-sm">
        {filteredThreads.length === 0 ? (
          <div>No threads for this filter.</div>
        ) : (
          <>
            {filteredThreads.map((thread, index) => {
              return (
                <Link
                  key={thread.id}
                  to={`/category/${cat}/thread/${thread.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ListGroup.Item
                    action
                    variant="light"
                    className="p-3 d-flex justify-content-between align-items-start"
                  >
                    <div>{thread.data().title}</div>
                    <div>
                      <Badge bg="primary" pill>
                        State: {thread.data().state}
                      </Badge>
                      {"  "}
                      <Badge bg="primary" pill>
                        Replies: {thread.data().count || 0}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                </Link>
              );
            })}
          </>
        )}
      </ListGroup>
    </div>
  );
}

export default Category;
