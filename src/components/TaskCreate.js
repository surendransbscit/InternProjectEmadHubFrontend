import React, { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../api/axiosInstance";

function TaskCreate({ employeeId, employeeName, taskData, onSuccess, onClose }) {
    const [task, setTask] = useState({
        title: "",
        description: "",
        date: "",
        status: "Pending",
        priority: "Medium",
        employee: employeeId,
        git_link: "",
        hosting_link: "",
        task_type: "",
        start_hour: "12",
        start_minute: "00",
        start_ampm: "AM",
        end_hour: "12",
        end_minute: "00",
        end_ampm: "AM",
    });

    const [screenshots, setScreenshots] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        if (employeeId) setTask((prev) => ({ ...prev, employee: employeeId }));

        if (taskData) {
            const [startHour, startMin] = taskData.start_time?.split(":") || ["12", "00"];
            const [endHour, endMin] = taskData.end_time?.split(":") || ["12", "00"];

            setTask({
                ...task,
                title: taskData.title || "",
                description: taskData.description || "",
                date: taskData.date || "",
                status: taskData.status || "Pending",
                priority: taskData.priority || "Medium",
                git_link: taskData.git_link || "",
                hosting_link: taskData.hosting_link || "",
                task_type: taskData.task_type || "",
                start_hour: startHour,
                start_minute: startMin,
                start_ampm: "AM",
                end_hour: endHour,
                end_minute: endMin,
                end_ampm: "AM",
            });

            if (taskData.screenshots) {
                setPreviewImages(taskData.screenshots.map((ss) => ss.image));
            }
        }
    }, [employeeId, taskData]);

    const handleChange = (e) => setTask({ ...task, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setScreenshots(files);
        setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    };

    const formatTime = (hour, minute, ampm) => {
        let h = parseInt(hour);
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return `${h.toString().padStart(2, "0")}:${minute}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const start_time = formatTime(task.start_hour, task.start_minute, task.start_ampm);
            const end_time = formatTime(task.end_hour, task.end_minute, task.end_ampm);

            const formData = new FormData();
            Object.keys(task).forEach((key) => {
                if (!["start_hour", "start_minute", "start_ampm", "end_hour", "end_minute", "end_ampm"].includes(key)) {
                    formData.append(key, task[key]);
                }
            });
            formData.append("start_time", start_time);
            formData.append("end_time", end_time);
            screenshots.forEach((file) => formData.append("screenshots", file));

            let response;
            if (taskData?.id) {
                response = await axiosInstance.put(`/tasks/${taskData.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Task updated successfully!");
            } else {
                response = await axiosInstance.post("/tasks/create/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Task created successfully!");
            }

            onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save task");
        }
    };

    const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
    const minuteOptions = ["00", "15", "30", "45"];
    const ampmOptions = ["AM", "PM"];

    return (
        <Card sx={{ maxWidth: 720, mx: "auto", mt: 4, p: 4, borderRadius: 4, boxShadow: 3 }}>
            <ToastContainer />
            <CardContent>
                <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
                    {taskData ? "Update Task" : "Create Task"}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Title"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Description"
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            required
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select name="status" value={task.status} onChange={handleChange} label="Status">
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select name="priority" value={task.priority} onChange={handleChange} label="Priority">
                                        <MenuItem value="Low">Low</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="High">High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Git Link"
                                    name="git_link"
                                    value={task.git_link}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Hosting Link"
                                    name="hosting_link"
                                    value={task.hosting_link}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Task Type"
                            name="task_type"
                            value={task.task_type}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Date"
                            type="date"
                            name="date"
                            value={task.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />

                        {/* Time Selection */}
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                Start & End Time
                            </Typography>
                            <Grid container spacing={2}>
                                {["Start", "End"].map((label) => (
                                    <Grid item xs={6} key={label}>
                                        <Stack direction="row" spacing={1}>
                                            <FormControl fullWidth>
                                                <Select
                                                    name={`${label.toLowerCase()}_hour`}
                                                    value={task[`${label.toLowerCase()}_hour`]}
                                                    onChange={handleChange}
                                                >
                                                    {hourOptions.map((h) => (
                                                        <MenuItem key={h} value={h}>
                                                            {h}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <Select
                                                    name={`${label.toLowerCase()}_minute`}
                                                    value={task[`${label.toLowerCase()}_minute`]}
                                                    onChange={handleChange}
                                                >
                                                    {minuteOptions.map((m) => (
                                                        <MenuItem key={m} value={m}>
                                                            {m}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <Select
                                                    name={`${label.toLowerCase()}_ampm`}
                                                    value={task[`${label.toLowerCase()}_ampm`]}
                                                    onChange={handleChange}
                                                >
                                                    {ampmOptions.map((a) => (
                                                        <MenuItem key={a} value={a}>
                                                            {a}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Screenshots */}
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ width: 400, display: "flex", justifyContent: "center", gap: 1 }}
                        >
                            <CloudUploadIcon />
                            Upload Screenshots
                            <input type="file" hidden multiple onChange={handleFileChange} />
                        </Button>

                        {previewImages.length > 0 && (
                            <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
                                {previewImages.map((src, idx) => (
                                    <Box
                                        key={idx}
                                        component="img"
                                        src={src}
                                        alt={`screenshot-${idx}`}
                                        sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 2, border: "1px solid #ccc" }}
                                    />
                                ))}
                            </Stack>
                        )}

                        <center><Button type="submit" variant="contained" color="primary" style={{ width: "200px" }}>
                            {taskData ? "Update Task" : "Create Task"}
                        </Button></center>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
}

export default TaskCreate;
