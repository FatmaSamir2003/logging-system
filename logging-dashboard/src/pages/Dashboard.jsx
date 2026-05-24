import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);

  const [apiKey, setApiKey] = useState("");

  const [appName, setAppName] = useState("");

  // =========================
  // GET PROFILE + APPS
  // =========================
  const fetchData = useCallback(async () => {
    try {
      // profile
      const profileResponse = await API.get("/api/users/profile");

      setApiKey(profileResponse.data.apiKey);

      // applications
      const appsResponse = await API.get("/api/applications");

      setApps(appsResponse.data.apps);
    } catch (error) {
      console.log(error);

      alert("Unauthorized");

      navigate("/");
    }
  }, [navigate]);

  // =========================
  // CREATE APPLICATION
  // =========================
  const createApp = async () => {
    try {
      const response = await API.post("/api/applications", {
        name: appName,
      });

      alert(response.data.message);

      setAppName("");

      fetchData();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  // =========================
  // DELETE APPLICATION
  // =========================
  const deleteApp = async (name) => {
    try {
      const confirmDelete = window.confirm("Delete this application?");

      if (!confirmDelete) return;

      const response = await API.delete(`/api/applications/${name}`);

      alert(response.data.message);

      fetchData();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Developer Dashboard</h1>

        <button onClick={logout}>Logout</button>
      </div>

      {/* API KEY */}
      <div className="api-box">
        <h3>Your API Key</h3>

        <p>{apiKey}</p>
      </div>

      {/* CREATE APP */}
      <div className="create-app">
        <input
          type="text"
          placeholder="Application Name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
        />

        <button onClick={createApp}>Create</button>
      </div>

      {/* APPLICATIONS */}
      <div className="apps-grid">
        {apps.map((app) => (
          <div key={app._id} className="app-card">
            <h3>{app.name}</h3>

            <p>Created: {new Date(app.createdAt).toLocaleString()}</p>

            <div className="card-buttons">
              <button onClick={() => navigate(`/applications/${app.name}`)}>
                Open
              </button>

              <button onClick={() => deleteApp(app.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
