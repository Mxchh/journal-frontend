import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import About from "./pages/About";
import Logout from "./pages/Logout";
import Home from "./pages/Home";

function App() {
  return(
  <BrowserRouter>
    <Header title="My Journal"></Header>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  </BrowserRouter>);
  }

export default App;
