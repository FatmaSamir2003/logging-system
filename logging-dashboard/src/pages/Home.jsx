import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <h1>Log Management System</h1>

      <p>
        A system for developers to monitor, manage, and analyze application logs
        in real time.
      </p>

      <div className="home-actions">
        <Link to="/login" className="btn">
          Login
        </Link>

        <Link to="/register" className="btn btn-outline">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
