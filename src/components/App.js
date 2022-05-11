import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";
import ReactRotatingText from "react-rotating-text";
import "./App.css";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../services/auth-svc";

// import { addCat } from "../services/category-svc";

function App() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState({});

  let allTheThings = [
    "Fishing 🎣",
    "Swimming 🏊",
    "to an Art show 🎨",
    "do some burnouts 🚓",
    "mountain biking 🚴",
    "UFO spotting 🛸 👽",
    "Running 🏃",
    "Magnet fishing 🧲",
  ];
  let accountNav;

  /* seed data */
  // const [seeded, setSeeded] = useState(false);
  // if(!seeded) {
  //   setSeeded(true);
  //   let cats = ["Academic","Art","ATV","Audio","Aviation","Baking","Band","Ball Sports","Beach","Bicycle","Boat","Brewing","Camping","Carnival","Children","Coffee","Combat Sports","Comic Books","Computers","Concert","County Fair","Crafts","Dancing","Dog Park","E-Sports","Electronics","Exploring","Farming","Festival","Fishing","Fitness","Gardening","Geo Caching","Glass Blowing","Go Karts","Gun Range","Hiking","Horse Riding","Hunting","Ice Sports","Magnet Fishing","Martial Arts","Movies","Motor Sports","Mountain Biking","Mushroom Hunting","Music","Other","Park","Pets","Photography","Playground","Recreation","Water Sports","Wheeled Sports"];
  //   cats.forEach((cat) => {
  //     addCat(cat);
  //   });
  // }

  useEffect(() => {
    if (loading) return;
    if (user) {
      // setCurrUser(user);
      fetchUser(user.uid).then((data) => {
        setCurrUser(data);
      });
    };
  }, [user, loading]);

  async function signOut() {
    try {
      await auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  if (currUser === null) {
    accountNav = <Nav.Link href="/signin">SignIn / SignUp</Nav.Link>;
  } else {
    accountNav = (
      <>
        <Nav.Link href="/account">
          Welcome, {currUser.displayName}!
        </Nav.Link>
        ;<Nav.Link onClick={signOut}>Sign Out</Nav.Link>;
      </>
    );
  }

  return (
    <Container>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow mb-2">
        <Container>
          <Navbar.Brand>Lets Go</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/">About</Nav.Link>
              <NavDropdown title="Info" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="justify-content-end">{accountNav}</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="p-2">
        <h3>
          Lets Go <ReactRotatingText items={allTheThings} />
        </h3>
      </div>
      <Outlet />
      <div style={{ height: 100 }}></div>
      <div className="mt-4 mb-2 p-3 bg-dark text-light">
        &copy; 2022 Lets Go
      </div>
    </Container>
  );
}

export default App;
