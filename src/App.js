import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BirthdayWheel from "./BirthdayWheel";
import BirthdayWelcome from "./BirthdayWelcome";

function App() {
  return (
    // Add Router with basename set to your repository name
    <Router basename="/pp_birthday">
      <div className="App">
        <Routes>
          <Route path="/" element={<BirthdayWelcome />} />
          <Route path="/birthday-wheel" element={<BirthdayWheel />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
