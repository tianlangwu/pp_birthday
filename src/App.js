import { Routes, Route } from "react-router-dom";
import BirthdayWelcome from "./BirthdayWelcome";
import BirthdayWheel from "./BirthdayWheel";

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
