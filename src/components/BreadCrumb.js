import React, { useState, useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import { getThread } from "../services/category-svc";

const BreadCrumb = ({ path }) => {
  const [parts, setParts] = useState([]);
  const [isThread, setIsThread] = useState(false);
  const [thread, setThread] = useState({});
  let params = useParams();

  useEffect(() => {
    let slice = path.split("/");
    slice.shift();
    setParts(slice);

    if (slice.includes("newthread")) {
      setIsThread(false);
      setThread({});
      return;
    }
    if (slice.includes("signin")) {
      setIsThread(false);
      setThread({});
      return;
    }
    if (slice.length >= 3) {
      async function fetchThread() {
        let t = await getThread(params.threadId);
        setThread(t);
      }
      fetchThread()
        .then(() => {
          setIsThread(true);
        })
        .catch((err) => {
          console.log("error fetching threads: ", err);
        });
    }
    if (slice.length < 3) {
      setIsThread(false);
      setThread({});
    }
  }, [path, params.threadId]);

  if (parts.length === 1) {
    return <></>;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/category/${params.catId}`}>{params.catId}</Link>
        </Breadcrumb.Item>
        {isThread ? (
          <Breadcrumb.Item active>
            <Link to={`/category/${params.catId}/thread/${params.threadId}`}>
              {thread.title}
            </Link>
          </Breadcrumb.Item>
        ) : null}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
