import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaChevronDown, FaChevronRight, FaUserPlus } from "react-icons/fa";
import "./Dashboard.css";
import { GiWorld } from "react-icons/gi";
import axiosInstance from "../api/axiosInstance";

const NavCate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("http://127.0.0.1:8000/logout/");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sidebar p-4">

      <ul>
        <li className={location.pathname === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard">🏠 Dashboard</Link>
        </li>

        <li
          className={`parent-menu ${openMenu ? "open" : ""}`}
          onClick={() => setOpenMenu(!openMenu)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          {openMenu ? (
            <FaChevronDown className="me-2" />
          ) : (
            <FaChevronRight className="me-2" />
          )}
          Employee
        </li>

        {openMenu && (
          <ul className="submenu">
            <li className={location.pathname === "/add/employee" ? "active" : ""}>

              <Link to="/add/employee"><FaUserPlus style={{ marginRight: "5px", color: "#4caf50" }} />Add Employee</Link>
            </li>
            <li className={location.pathname === "/country" ? "active" : ""}>
              <Link to="/country"><GiWorld style={{ marginRight: "8px", color: "#2196f3" }} />Add Location</Link>
            </li>
          </ul>
        )}

        <div className="logout-wrapper">
          <button onClick={handleLogout} className="logout-btn mt-5">
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </ul>
    </aside>
  );
};

export default NavCate;
