import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import { getCats } from "../services/category-svc";
import ListGroupPlaceholder from "./ListGroupPlaceholder";
// import Button from "react-bootstrap/Button";
// import { createThread } from "../services/category-svc";

const CatList = () => {
  const [cats, setCats] = useState([]);

  async function fetchCats() {
    await getCats().then((data) => {
      setCats(data);
    });
  }

  // async function seedThreads() {
  //   console.log('Seeding Threads...');
  //   cats.forEach(async(cat) => {
  //     let t = {
  //       owner: "cIbJcrEp3ufBDaNCRtHuz32MhFs2",
  //       title: "Welcome to Lets Go",
  //       message: `This is category ${cat.data().name}`,
  //       category: cat.id,
  //       state: "AL",
  //     };
  //   const newThread = await createThread(t);
  //   console.log(`Created thread: ${newThread}`);
  //   });
  // }

  useEffect(() => {
    fetchCats();
  }, []);

  if (cats.length === 0) {
    return (
      <div className="mt-3">
        <h3>Categories</h3>
        <ListGroupPlaceholder />
      </div>
    );
  } else {
    return (
      <div className="mt-3">
        <h3>Categories</h3>
        {/* <Button onClick={seedThreads}>Seed Threads</Button> */}
        <ListGroup>
          {cats.map((cat, index) => {
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                style={{ textDecoration: "none" }}
              >
                <ListGroup.Item
                  action
                  variant="light"
                  className="p-3 d-flex justify-content-between align-items-start"
                >
                  <div>{cat.id}</div>
                  <div>
                    <small className="pe-3">
                      Threads: {cat.data().count || 0}
                    </small>
                    {/* <small className="pe-3">Messages: {cat.messages}</small> */}
                  </div>
                </ListGroup.Item>
              </Link>
            );
          })}
        </ListGroup>
      </div>
    );
  }
};

export default CatList;
