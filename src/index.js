import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import Category from "./components/Category";
import CatList from "./components/CatList";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import NewThread from "./components/NewThread";
import Thread from "./components/Thread";
import Dashboard from "./components/Dashboard";
import User from "./components/User";
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import "bootstrap/dist/css/bootstrap.min.css";

export const routes = [
  {
    path: "",
    name: "Home",
    Component: <CatList />
  },
  {
    path: "signin/",
    name: "Sign In",
    Component: <SignIn />
  },
  {
    path: "register/",
    name: "Register",
    Component: <Register />
  },
  {
    path: "category/:catId",
    name: "Category",
    Component: <Category />
  },
  {
    path: "category/:catId/newthread",
    name: "NewThread",
    Component: <NewThread />
  },
  {
    path: "category/:catId/thread/:threadId",
    name: "Thread",
    Component: <Thread />
  },
  {
    path: "account/",
    name: "Dashboard",
    Component: <Dashboard />
  },
  {
    path: "user/:uid",
    name: "User",
    Component: <User />
  },
  {
    path: "privacy/",
    name: "Privacy",
    Component: <Privacy />
  },
  {
    path: "terms/",
    name: "Terms",
    Component: <Terms />
  }
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          {routes.map(({path, Component}, key) => (
            <Route key={key} path={path} element={Component} />
          ))}
          {/* <Route path="" element={<CatList />} />
          <Route path="signin/" element={<SignIn />} />
          <Route path="register/" element={<Register />} />
          <Route path="category/:catId" element={<Category />} />
          <Route path="newthread/:catId" element={<NewThread />} />
          <Route path="thread/:threadId" element={<Thread />} />
          <Route path="account/" element={<Dashboard />} /> */}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
