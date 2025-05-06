import React from "react";
import { Routes, Route } from "react-router-dom";
import BirthdayWheel from "./BirthdayWheel";
import BirthdayWelcome from "./BirthdayWelcome";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BirthdayWelcome />} />
        <Route path="/birthday-wheel" element={<BirthdayWheel />} />
      </Routes>
    </div>
  );
}

export default App;
