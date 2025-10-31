import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import loginImg from "../img/login.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const RequiredLabel = ({ required }) => (
    <label>
      {required && <span style={{ color: "red" }}>*</span>}
    </label>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });

      const userData = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.is_staff) {
        navigate("/dashboard");
      } else {
        navigate("/employeedashboard");

        if (userData.employee_id) {
          try {
            const tasksRes = await axios.get(
              `http://127.0.0.1:8000/employees/tasks/${userData.employee_id}/`,
              {
                headers: {
                  Authorization: `Token ${res.data.token}`,
                },
              }
            );
            localStorage.setItem("employeeTasks", JSON.stringify(tasksRes.data));
          } catch (taskErr) {
            console.error("Error fetching employee tasks:", taskErr);
          }
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.username) setError(data.username);
        else if (data.password) setError(data.password);
        else if (data.non_field_errors) setError(data.non_field_errors.join(" "));
        else setError("Invalid credentials, please try again!");
      } else {
        setError("Network or server error, please try again!");
      }
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side */}
        <div className="login-left">
          <div className="image-box">
            <img src={loginImg} alt="login" className="login-img" />
          </div>
          {/* <p>Login To Access For Employees Details</p> */}
        </div>

        {/* Right Side */}
        <div className="login-right">
          <h2>Welcome back</h2>
          <form onSubmit={handleLogin}>
            <label>
              Username <RequiredLabel required={true} />
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>
              Password <RequiredLabel required={true} />
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
