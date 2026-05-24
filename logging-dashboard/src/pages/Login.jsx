import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // تحديث البيانات أثناء الكتابة
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // إرسال login request
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/api/users/login", formData);

      const data = response.data;

      // تخزين التوكن
      localStorage.setItem("token", data.token);

      alert("Login successful");

      // تحويل للدashboard
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
