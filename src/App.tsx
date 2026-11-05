import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import Register from "./pages/Registration";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
