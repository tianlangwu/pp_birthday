import { Routes, Route } from "react-router-dom";
import BirthdayWelcome from "./BirthdayWelcome";
import BirthdayWheel from "./BirthdayWheel";
import RomanticSurprise from "./RomanticSurprise";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BirthdayWelcome />} />
        <Route path="/birthday-wheel" element={<BirthdayWheel />} />
        <Route path="/romantic-surprise" element={<RomanticSurprise />} />
      </Routes>
    </div>
  );
}

export default App;
