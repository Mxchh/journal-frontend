import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="menu-btn" onClick={onToggle} aria-label={isOpen ? "Close sidebar" : "Open sidebar"} aria-expanded={isOpen}>
        ☰
      </button>
      {isOpen && (
        <div className="sidebar-content">
          <h2>Journal</h2>
          <nav aria-label="Main navigation">
            <Link to="/">Dashboard</Link>
            <Link to="/about">About</Link>
          </nav>
          <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </aside>
  );
}
