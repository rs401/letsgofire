import React, { useEffect, createContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";
import ReactRotatingText from "react-rotating-text";
import "./App.css";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom";
import BreadCrumb from "./BreadCrumb";

export const AuthContext = createContext();

function App() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const location  = useLocation();

  const allTheThings = [
    "Fishing 🎣",
    "Swimming 🏊",
    "to an Art show 🎨",
    "do some burnouts 🚓",
    "mountain biking 🚴",
    "UFO spotting 🛸 👽",
    "Running 🏃",
    "Magnet fishing 🧲",
    "Geo Caching 🧭",
  ];
  let accountNav;

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.log("error in auth state: ", error.message);
    }
  }, [user, loading, error]);

  async function signOut() {
    try {
      await auth.signOut().then(() => {
        console.log("sign out clicked");
        navigate("/", { replace: true });
      });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  if (!user) {
    accountNav = <Nav.Link href="/signin">SignIn / SignUp</Nav.Link>;
  } else {
    accountNav = (
      <>
        <Nav.Link href="/account">Account Dashboard</Nav.Link>;
        <Nav.Link onClick={signOut}>Sign Out</Nav.Link>;
      </>
    );
  }

  return (
    <AuthContext.Provider value={user}>
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
                  <NavDropdown.Item href="/privacy">Privacy</NavDropdown.Item>
                  <NavDropdown.Item href="/terms">Terms</NavDropdown.Item>
                  <NavDropdown.Divider />
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
          <BreadCrumb path={location.pathname} />
        </div>
        <Outlet />
        <div style={{ height: 100 }}></div>
        <div className="mt-4 mb-2 p-3 bg-dark text-light">
          &copy; 2022 Lets Go
        </div>
      </Container>
    </AuthContext.Provider>
  );
}

export default App;
