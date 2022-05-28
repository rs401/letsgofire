import React, { useEffect, useState } from "react";
import { fetchUser } from "../services/auth-svc";
import { getThreadsByUser, getRepliesByUser } from "../services/category-svc";
import { useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const User = () => {
  let params = useParams();
  const uid = params.uid;
  const [theUser, setTheUser] = useState({});
  const [badId, setBadId] = useState(false);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    if (uid) {
      // Get the user
      fetchUser(uid)
        .then((user) => {
          setTheUser(user);
          document.title = `Lets GO! - User Profile: ${user.displayName}`;
        })
        .catch(() => {
          setBadId(true);
          return;
        });
      // Get the threads the user has created
      getThreadsByUser(uid).then((threadsData) => {
        setThreads(threadsData);
      });
      // Get the replies the user has created
      getRepliesByUser(uid).then((repliesData) => {
        setReplies(repliesData);
      });
    }
  }, [uid]);

  return (
    <Container>
      {badId ? (
        <div>No such User</div>
      ) : (
        <div>
          <Card className="text-center shadow mb-3 pt-2">
            <Card.Title>{theUser.displayName}</Card.Title>
            <Card.Body>
              <img alt="profile" src={theUser.profileImage} />
              <div>
                Number of Discussions started:&nbsp;
                {threads.length === 0 ? (
                  <span>0</span>
                ) : (
                  <span>{threads.length}</span>
                )}
              </div>
              <div>
                Number of Replies:&nbsp;
                {replies.length === 0 ? (
                  <span>0</span>
                ) : (
                  <span>{replies.length}</span>
                )}
              </div>
            </Card.Body>
          </Card>
          <div>
            <h5>Discussions By: {theUser.displayName}</h5>
            {threads.length === 0 ? (
              <span>No discussions started yet.</span>
            ) : (
              <div>
                <ListGroup
                  className="shadow border mb-2"
                  style={{ maxHeight: "40vh", overflow: "scroll" }}
                >
                  {threads.map((thread) => {
                    return (
                      <ListGroup.Item
                        key={thread.id}
                        variant="light"
                        className="p-3 d-flex justify-content-between align-items-start"
                      >
                        <Link
                          to={`/category/${thread.data().category}/thread/${
                            thread.id
                          }`}
                        >
                          {thread.data().title}
                        </Link>
                        <Link to={`/category/${thread.data().category}`}>{thread.data().category}</Link>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            )}
          </div>

          <div>
            <h5>Discussions {theUser.displayName} has participated in:</h5>
            {replies.length === 0 ? (
              <div>No discussions participated in yet.</div>
            ) : (
              <ListGroup
                className="shadow border mb-2"
                style={{ maxHeight: "40vh", overflow: "scroll" }}
              >
                {replies.map((reply) => {
                  return (
                    <Link
                    key={reply.id}
                      to={`/category/${reply.data().category}/thread/${reply.data().thread}`}
                    >
                    <ListGroup.Item
                      action
                      variant="light"
                      className="p-3 d-flex justify-content-between align-items-start"
                    >
                        {reply.data().message}
                    </ListGroup.Item>
                      </Link>
                  );
                })}
              </ListGroup>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default User;
