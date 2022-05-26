import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";

const ListGroupPlaceholder = () => {
  const loops = Array.from({ length: 20 }, () => 0);
  return (
    <div>
      <ListGroup>
        {loops.map((_, i) => {
          return (
            <ListGroup.Item key={i}>
              <Placeholder xs={12}>
                <Placeholder as="p" animation="glow" />
              </Placeholder>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default ListGroupPlaceholder;
