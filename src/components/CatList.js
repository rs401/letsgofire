import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";
import { Link } from "react-router-dom";
import { getCats } from "../services/category-svc";



const CatList = () => {
  const [cats, setCats] = useState([]);

  async function fetchCats() {
    await getCats().then(data => {
      console.log("data",data);
      setCats(data);
    });
  }

  useEffect(() => {
    fetchCats();
    
  }, []);

  if (cats.length === 0) {
    return (
      <div className="mt-3">
        <h3>Categories</h3>
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
      <div className="mt-3">
        <h3>Categories</h3>
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
                    {/* <small className="pe-3">Threads:{cat.threads}</small>
                    <small className="pe-3">Messages: {cat.messages}</small>
                    <small className="pe-3">Views: {cat.views}</small> */}
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
