import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Modal, Image } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { FaEye } from "react-icons/fa"; 

const EmployeeTasks = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployeeTasks();
    }, [id]);

    const fetchEmployeeTasks = async () => {
        try {
            const res = await axiosInstance.get(`employees/tasks/${id}/`);
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching employee tasks:", err);
        }
    };

    const handleShow = (task) => {
        setSelectedTask(task);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedTask(null);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="m-auto text-center flex-grow-1">Tasks for Employee</h2>
                <Button style={{width:"100px"}}variant="secondary" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>
            <div className="row mt-5">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div className="col-md-3 mb-3" key={task.id}>
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-center mb-3">{task.title}</Card.Title>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <small className="text-muted">
                                            {new Date(task.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "numeric",
                                                year: "numeric",
                                            })}
                                        </small>
                                        <span
                                            className={`badge ${task.status === "Completed"
                                                ? "bg-success"
                                                : task.status === "Pending"
                                                    ? "bg-warning text-dark"
                                                    : task.status === "In Progress"
                                                        ? "bg-primary"
                                                        : task.status === "Blocked"
                                                            ? "bg-danger"
                                                            : "bg-secondary"
                                                }`}
                                        >
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="mb-2">
                                        <span
                                            className={`badge ${task.priority === "High"
                                                ? "bg-danger"
                                                : task.priority === "Medium"
                                                    ? "bg-warning text-dark"
                                                    : "bg-success"
                                                }`}
                                        >
                                            {task.priority} Priority
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <small><strong>Hours:</strong> {task.estimated_hours}</small>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => handleShow(task)}
                                        >
                                            <FaEye />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                ) : (
                    <center><p>No tasks found for this employee.</p></center>
                )}
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
                        <>
                            <center><h5>{selectedTask.title}</h5></center>
                            <p className="mt-2"><strong>Description:</strong> {selectedTask.description}</p>
                            <p><strong>Type:</strong> {selectedTask.task_type}</p>
                            <p><strong>Status:</strong> {selectedTask.status}</p>
                            <p><strong>Priority:</strong> {selectedTask.priority}</p>
                            <p><strong>Date:</strong>
                            {new Date(selectedTask.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "numeric",
                                                year: "numeric",
                                            })}</p>
                            <p><strong>Start Time:</strong> {selectedTask.start_time}</p>
                            <p><strong>End Time:</strong> {selectedTask.end_time}</p>
                            <p><strong>Estimated Hours:</strong> {selectedTask.estimated_hours}</p>
                            <p><strong>GitHub Link:</strong> <a href={selectedTask.git_link} target="_blank" rel="noreferrer">{selectedTask.git_link}</a></p>
                            <p><strong>Hosting Link:</strong> <a href={selectedTask.hosting_link} target="_blank" rel="noreferrer">{selectedTask.hosting_link}</a></p>
                            <p><strong>Worker:</strong> {selectedTask.employee_name}</p>
                            <p><strong>Created At:</strong> {new Date(selectedTask.created_at).toLocaleString()}</p>

                            {selectedTask.screenshots?.length > 0 && (
                                <div className="mt-3">
                                    <h6>Screenshots:</h6>
                                    <div className="d-flex flex-wrap">
                                        {selectedTask.screenshots.map((shot) => (
                                            <Image
                                                key={shot.id}
                                                src={shot.image}
                                                alt="screenshot"
                                                thumbnail
                                                className="me-2 mb-2"
                                                style={{ width: "150px", height: "auto" }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeTasks;