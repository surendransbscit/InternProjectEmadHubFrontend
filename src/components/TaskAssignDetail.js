import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";


function TaskAssignView() {
  const { id } = useParams(); // employee id
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      // .get(`https://surendranss.pythonanywhere.com/tasks/assign/employee/${id}/`, {
      //   headers: { Authorization: `Token ${token}` },
      // })
      .get(`http://127.0.0.1:8000/tasks/assign/employee/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setAssignedTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assigned tasks:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h3 className="text-center mt-4">Loading assigned tasks...</h3>;



  const deleteTaskAssign = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // await axios.delete(
        //   `https://surendranss.pythonanywhere.com/assigentask/delete/${taskId}/`,
        //   { headers: { Authorization: `Token ${token}` } }
        // );
        await axios.delete(
          `http://127.0.0.1:8000/assigentask/delete/${taskId}/`,
          { headers: { Authorization: `Token ${token}` } }
        );

        setAssignedTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );

        toast.success("Task deleted successfully", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete task ", { position: "top-right" });
      }
    }
  };


  return (
    <div className="container mt-4">
      {/* Heading + Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Assigned Tasks</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <div className="row">
        {assignedTasks.length > 0 ? (
          assignedTasks.map((task) => (
            <div key={task.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 p-3">
                <h5 className="text-center">{task.title}</h5>
                <p className="text-muted">{task.description}</p>

                <div className="d-flex justify-content-between">
                  <span>
                    <strong>Priority:</strong> {task.priority}
                  </span>
                  <span>
                    <strong>Assigned At:</strong>{" "}
                    {new Date(task.assigned_at).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    onClick={() => deleteTaskAssign(task.id)}
                    className="btn btn-danger"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No tasks assigned yet.</p>
        )}

      </div>
    </div>
  );
}

export default TaskAssignView;
