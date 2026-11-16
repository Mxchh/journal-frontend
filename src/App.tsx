import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import Register from "./pages/Registration";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Statistic from "./pages/Statistics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/statistic" element={<Statistic/>}></Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
