import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Travel from "./travel/travel";
import CreateUserForm from "./travel/create";
import CreateSigninForm from "./travel/signin";
import Profile from "./travel/authorized/profile";

const basename = '/Disclosure';

const App = () => {
  
  return (
    <div>
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Travel />} />
          <Route path="/create" element={<CreateUserForm />} />
          <Route path="/signin" element={<CreateSigninForm />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;