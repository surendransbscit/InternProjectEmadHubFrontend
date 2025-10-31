import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeView from "./components/EmployeeView";
import Country from "./components/Country";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import AiSuggestion from "./components/AiSuggestion";
import EmployeeDashboard from "./components/EmployeeDashboard";
import TaskAssignView from "./components/TaskAssignDetail";
import TaskCreate from "./components/TaskCreate";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<EmployeeList />} />
        <Route path="/add/employee" element={<EmployeeForm />} />
        <Route path="/edit/:id" element={<EmployeeForm />} />
        <Route path="/view/:id" element={<EmployeeView />}/>
        <Route path="/Country" element={<Country />} />
        <Route path="/tasks/:id" element={<TaskList />} />
        <Route path="/aisuggestions/:pk" element={<AiSuggestion />} />
        <Route path="/employeedashboard" element={<EmployeeDashboard />} />
        <Route path="/tasks/assign/employee/:id" element={<TaskAssignView />} />
        <Route path="/tasks/add" element={<TaskCreate />} />

      </Routes>
    </Router>
  );
}

export default App;
