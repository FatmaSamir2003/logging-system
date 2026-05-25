import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import API from "../api";

function ApplicationDetails() {
  const { name } = useParams();

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");

  const limit = 10;

  // =========================
  // FETCH LOGS
  // =========================
  const fetchLogs = async () => {
    try {
      const response = await API.get(`/api/applications/${name}/logs`, {
        params: {
          page,
          limit,
          level,
          search,
        },
      });

      console.log(response.data);

      setLogs(response.data.logs);
      setTotal(response.data.total);
    } catch (error) {
      console.log("API ERROR:", error.response?.data || error.message);

      alert("Error fetching logs");
    }
  };

  // =========================
  // AUTO FETCH
  // =========================
  useEffect(() => {
    // schedule fetchLogs in a microtask to avoid setting state synchronously within the effect
    Promise.resolve().then(() => fetchLogs());
  }, [page, level]);

  return (
    <div className="logs-page">
      <h2>Application: {name}</h2>

      {/* FILTERS */}
      <div className="filters">
        <select
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>

        <input
          type="text"
          placeholder="Search message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={fetchLogs}>Search</button>
      </div>

      {/* TABLE */}
      <table className="logs-table">
        <thead>
          <tr>
            <th>Message</th>
            <th>Level</th>
            <th>Count</th>
            <th>First Occurrence</th>
            <th>Last Updated</th>
          </tr>
        </thead>

        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log._id}>
                <td>{log.message}</td>

                <td>{log.level}</td>

                <td>{log.count}</td>

                <td>{new Date(log.createdAt).toLocaleString()}</td>

                <td>{new Date(log.updatedAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No logs found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>Page {page}</span>

        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetails;
