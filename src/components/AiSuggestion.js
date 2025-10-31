import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { FaArrowLeft, FaCamera } from "react-icons/fa"; 
import "./TaskSuggestions.css";

const TaskSuggestions = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [nextTasks, setNextTasks] = useState("");
  const [loading, setLoading] = useState(true);
  const screenshotRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(
          `/tasks/aisuggestions/${pk}/`
        );
        setEmployeeTasks(response.data.employee_tasks);
        setNextTasks(response.data.next_tasks);
      } catch (error) {
        console.error("Error fetching AI task suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [pk]);

  if (loading) {
    return <center><h2 className="loading-text">Loading tasks...</h2></center>;
  }

  // Convert AI response string into structured task objects
  const parseNextTasks = (text) => {
    const tasks = text
      .trim()
      .split("\n\n")
      .map((block) => {
        const titleMatch = block.match(/Title:\s*(.*)/);
        const descMatch = block.match(/Description:\s*(.*)/);
        const priorityMatch = block.match(/Priority:\s*(.*)/);

        return {
          title: titleMatch ? titleMatch[1] : "",
          description: descMatch ? descMatch[1] : "",
          priority: priorityMatch ? priorityMatch[1] : "",
        };
      });
    return tasks;
  };

  const suggestedTasks = parseNextTasks(nextTasks);

  // Take Screenshot Function
  const handleScreenshot = () => {
    if (screenshotRef.current) {
      html2canvas(screenshotRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const now = new Date();
        const timestamp = now
          .toISOString()
          .replace(/T/, "_")
          .replace(/:/g, "-")
          .split(".")[0]; // YYYY-MM-DD_HH-MM-SS
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `task_suggestions_${pk}_${timestamp}.png`;
        link.click();
      });
    }
  };

  return (
    <div className="task-page">
      <div className="header-bar">
        <h2 className="section-title">AI Suggested Next Tasks</h2>
        <div className="button-group">
          <button className="btn back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="icon" /> Back
          </button>
          <button className="btn screenshot-btn" onClick={handleScreenshot}>
            <FaCamera className="icon" /> Screenshot
          </button>
        </div>
      </div>

      <div ref={screenshotRef}>
        <div className="task-grid">
          {suggestedTasks.map((task, index) => (
            <div key={index} className="task-card ai-card">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              <span className={`badge ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskSuggestions;
