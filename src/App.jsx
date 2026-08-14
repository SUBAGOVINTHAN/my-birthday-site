import { BrowserRouter } from "react-router-dom";
import BirthdayQuest from "./components/birthday";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <BirthdayQuest />
    </BrowserRouter>
  );
}

export default App;