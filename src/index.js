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
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<CatList />} />
          <Route path="signin/" element={<SignIn />} />
          <Route path="register/" element={<Register />} />
          <Route path="category/:catId" element={<Category />} />
          <Route path="newthread/:catId" element={<NewThread />} />
          <Route path="thread/:threadId" element={<Thread />} />
          <Route path="account/" element={<Dashboard />} />
          {/* <Route path="auth" element={<Auth />} /> */}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
