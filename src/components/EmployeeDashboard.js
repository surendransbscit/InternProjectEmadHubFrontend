import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSignOutAlt, FaTasks, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskCreate from "./TaskCreate";
import axiosInstance from "../api/axiosInstance";

function EmployeeDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [searchTitle, setSearchTitle] = useState("");
    const [searchDate, setSearchDate] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/",
    });

    // const fetchTasks = async () => {
    //     try {
    //         const res = await axios.get(
    //             `https://surendranss.pythonanywhere.com/tasks/${user.employee_id}/`,
    //             { headers: { Authorization: `Token ${token}` } }
    //         );
    //         setTasks(res.data);
    //         setLoading(false);
    //     } catch (err) {
    //         console.error("Error fetching tasks:", err);
    //         setLoading(false);
    //     }
    // };
    // useEffect(() => {
    //     if (user && user.employee_id) {
    //         fetchTasks(); 
    //     }
    // }, []);


    useEffect(() => {

        if (user && user.employee_id) {
            axios
                .get(`http://127.0.0.1:8000/employees/tasks/${user.employee_id}/`, {
                    headers: { Authorization: `Token ${token}` },
                })
                .then((res) => {
                    setTasks(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching tasks:", err);
                    setLoading(false);
                });

        }
    }, []);

    if (loading) {
        return <h2 className="text-center mt-4">Loading employee tasks...</h2>;
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesTitle = task.title
            .toLowerCase()
            .includes(searchTitle.toLowerCase());

        const matchesDate = searchDate
            ? new Date(task.date).toISOString().split("T")[0] === searchDate
            : true;

        return matchesTitle && matchesDate;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "Completed":
                return "badge bg-success";
            case "In Progress":
                return "badge bg-primary";
            case "Pending":
                return "badge bg-warning text-dark";
            case "Blocked":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "High":
                return "badge bg-danger";
            case "Medium":
                return "badge bg-warning text-dark";
            case "Low":
                return "badge bg-info text-dark";
            default:
                return "badge bg-secondary";
        }
    };

    const handleLogout = async () => {
        try {
            await api.post(
                "/logout/",
                {},
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            toast.success("Logged out successfully ", { position: "top-right" });
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error.response?.data || error);
            toast.error("Logout failed ", { position: "top-right" });
        }
    };

    const handleUpdate = (task) => {
        setSelectedTask(task);
        setShowCreateModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axiosInstance.delete(`/tasks/${id}/`);
                setTasks((prev) => prev.filter((t) => t.id !== id));
                toast.success("Task deleted successfully");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete task");
            }
        }
    };



    return (
        <div className="d-flex" style={{ backgroundColor: "#f2f8fdff" }}>
            {/* Left Sidebar */}
            <div
                className=" text-white p-3"
                style={{
                    width: "250px",
                    minHeight: "100vh",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                    backgroundColor: "#aacff1ff",
                }}
            >
                <ul className="nav flex-column gap-3 mt-5">
                    <li className="nav-item">
                        <button
                            className="btn btn-outline-light w-100 text-start"
                            onClick={() =>
                                navigate(`/tasks/assign/employee/${user.employee_id}/`)
                            }
                        >
                            <FaTasks className="me-2" /> My Tasks
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className="btn btn-outline-light w-100 text-start"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FaPlus className="me-2" /> Add Task
                        </button>
                    </li>

                    <li className="nav-item mt-auto">
                        <button
                            className="btn btn-danger w-100 text-start"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="me-2" /> Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="container mt-4">
                {/* Search Row */}
                <div className="row align-items-center mb-4">
                    <div className="col-md-6">
                        <h4 className="mb-0">
                            Hi 👋😊 {filteredTasks.length > 0 ? filteredTasks[0].employee_name : ""}
                        </h4>
                    </div>

                    <div className="col-md-6 d-flex justify-content-end gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title..."
                            style={{ maxWidth: "150px" }}
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />

                        <input
                            type="date"
                            className="form-control"
                            style={{ maxWidth: "150px" }}
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tasks Grid */}
                <div className="row">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <div key={task.id} className="col-md-4 mb-4 mt-4">
                                <div className="card shadow-sm h-100 p-3">
                                    <h5 className="mb-3 text-center">{task.title}</h5>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span>
                                            <strong>Date:</strong>{" "}
                                            {new Date(task.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <span className={getStatusBadge(task.status)}>
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <p className="mb-0">
                                            <strong>Hours:</strong> {task.estimated_hours || "-"}
                                        </p>
                                        <span className={getPriorityBadge(task.priority)}>
                                            {task.priority} Priority
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-end mt-3">
                                        <Button
                                            className="btn btn-color-primary me-2"
                                            onClick={() => setSelectedTask(task)}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button className="btn btn-danger me-2" onClick={() => handleDelete(task.id)}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No tasks found</p>
                    )}
                </div>
            </div>

            {/* Task View Modal */}
            {selectedTask && (
                <Modal
                    show={true}
                    onHide={() => setSelectedTask(null)}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedTask.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-between mb-3">
                            <span>
                                <strong>Date:</strong>{" "}
                                {new Date(selectedTask.date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                            <span className={getStatusBadge(selectedTask.status)}>
                                {selectedTask.status}
                            </span>
                            <span className={getPriorityBadge(selectedTask.priority)}>
                                {selectedTask.priority} Priority
                            </span>
                        </div>

                        <div className="mb-3">
                            <h6>Description</h6>
                            <p className="text-muted">{selectedTask.description}</p>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <strong>Estimated Hours:</strong>{" "}
                                {selectedTask.estimated_hours || "-"}
                            </div>
                            <div className="col-md-4">
                                <strong>Start Time:</strong> {selectedTask.start_time || "-"}
                            </div>
                            <div className="col-md-4">
                                <strong>End Time:</strong> {selectedTask.end_time || "-"}
                            </div>
                        </div>

                        <div className="mb-3">
                            {selectedTask.git_link && (
                                <p>
                                    🔗{" "}
                                    <a
                                        href={selectedTask.git_link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        GitHub Repository
                                    </a>
                                </p>
                            )}
                            {selectedTask.hosting_link && (
                                <p>
                                    🌐{" "}
                                    <a
                                        href={selectedTask.hosting_link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Hosting Link
                                    </a>
                                </p>
                            )}
                        </div>

                        <div>
                            <h6>Screenshots</h6>
                            <div className="d-flex flex-wrap">
                                {selectedTask.screenshots &&
                                    selectedTask.screenshots.length > 0 ? (
                                    selectedTask.screenshots.map((ss, i) => (
                                        <img
                                            key={i}
                                            src={ss.image}
                                            alt="screenshot"
                                            width="180"
                                            className="me-2 mb-2 rounded shadow-sm border"
                                        />
                                    ))
                                ) : (
                                    <p className="text-muted">No screenshots available</p>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn btn-info me-2"
                            onClick={() => {
                                setSelectedTask(selectedTask); // use selectedTask instead of task
                                setShowCreateModal(true);
                            }}
                        >
                            <FaEdit />
                        </Button>
                        <Button variant="secondary" onClick={() => setSelectedTask(null)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Add Task Modal */}
            <Modal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TaskCreate
                        employeeId={user?.employee_id}
                        employeeName={user?.full_name}
                        taskData={selectedTask}
                        onSuccess={(updatedTask) => {
                            // fetchTasks();
                            setTasks((prev) =>
                                prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
                            );
                            setShowCreateModal(false);
                        }}
                        onClose={() => setShowCreateModal(false)}
                    />
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default EmployeeDashboard;
