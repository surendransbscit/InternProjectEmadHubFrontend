import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash, FaSignOutAlt, FaRobot, FaSearch } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import NavCate from "./Navbar";
import axiosInstance from "../api/axiosInstance";


// const API_URL = "https://surendranss.pythonanywhere.com/employees/";
const API_URL = "http://127.0.0.1:8000/employees/";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [loginUser, setLoginUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees("", 1);
  }, []);

  const loadEmployees = async (searchTerm = "", page = 1) => {
    try {
      let url = `${API_URL}?page=${page}&page_size=${pageSize}`;

      if (searchTerm) {
        url += `&name=${encodeURIComponent(searchTerm)}&email=${encodeURIComponent(
          searchTerm
        )}&role=${encodeURIComponent(searchTerm)}`;
      }

      const res = await axiosInstance.get(url);

      setEmployees(res.data.results || []);
      setCurrentPage(res.data.current_page || 1);
      setTotalPages(res.data.total_pages || 1);

      setLoginUser(res.data.login_user || "");
    } catch (error) {
      console.error("Failed to load employees", error);
    }
  };


  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axiosInstance.delete(`${API_URL}${id}/`);
        toast.success("Employee deleted successfully ✅", {
          position: "top-right",
        });
        loadEmployees(search, currentPage);
      } catch (error) {
        toast.error("Failed to delete employee ❌", { position: "top-right" });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("http://127.0.0.1:8000/logout/");
      localStorage.removeItem("token");
      toast.success("Logged out successfully ✅", { position: "top-right" });
      navigate("/");
    } catch (error) {
      toast.error("Logout failed ❌", { position: "top-right" });
    }
  };

  return (
    <div className="dashboard">
      <NavCate />
      <main className="content" style={{ marginLeft: "220px" }}>
        <div className="page-header">
          <h2 className="page-title">Hi 👋😊 {loginUser}</h2>
          <div className="search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon me-2" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  setCurrentPage(1);
                  loadEmployees(value, 1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.role}</td>
                  <td>
                    {emp.dob
                      ? new Date(emp.dob).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "numeric",
                        year: "numeric",
                      })
                      : "-"}
                  </td>
                  <td>{emp.gender}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/view/${emp.id}`)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => navigate(`/edit/${emp.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/tasks/${emp.id}`)}
                    >
                      <BiDetail />
                    </button>
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => navigate(`/aisuggestions/${emp.id}`)}
                    >
                      <FaRobot />
                    </button>
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      className="btn-action delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => loadEmployees(search, currentPage - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => loadEmployees(search, i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => loadEmployees(search, currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default EmployeeList;
