import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      setToken(!!localStorage.getItem("token"));
    };
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Log System</h2>

      <div className="links">
        <Link to="/">Home</Link>

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <span
            onClick={handleLogout}
            className="nav-link logout-link btn-danger"
          >
            Logout
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
