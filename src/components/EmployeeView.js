import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const API_URL = "employees/";
const CITY_API = "cities/";
const STATE_API = "states/";
const COUNTRY_API = "countries/";

const EmployeeView = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    axiosInstance.get(`${API_URL}${id}/`).then((res) => {
      setEmployee(res.data);

      if (res.data.city) {
        axiosInstance.get(`${CITY_API}${res.data.city}/`).then((c) => setCity(c.data.name));
      }
      if (res.data.state) {
        axiosInstance.get(`${STATE_API}${res.data.state}/`).then((s) => setState(s.data.name));
      }
      if (res.data.country) {
        axiosInstance.get(`${COUNTRY_API}${res.data.country}/`).then((co) => setCountry(co.data.name));
      }
    }).catch((error) => {
      console.error("Failed to load employee or location data:", error);
      // Optionally handle error, e.g. redirect to login if 401
    });
  }, [id]);

  if (!employee) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4 rounded-3">
        <h2 className="mb-4 text-primary">Employee Details</h2>

        {/* Profile Info */}
        <div className="row">
          <div className="col-md-6 mb-3"><strong>Full Name:</strong> {employee.full_name}</div>
          <div className="col-md-6 mb-3"><strong>Role:</strong> {employee.role}</div>
          <div className="col-md-6 mb-3">
            <strong>DOB:</strong> {employee.dob ? new Date(employee.dob).toLocaleDateString("en-GB", {day: "2-digit",month: "numeric",year: "numeric"}) : "-"}
          </div>
          <div className="col-md-6 mb-3"><strong>Gender:</strong> {employee.gender}</div>
          <div className="col-md-6 mb-3"><strong>Email:</strong> {employee.email}</div>
          <div className="col-md-6 mb-3"><strong>Phone:</strong> {employee.phone}</div>
          <div className="col-md-6 mb-3"><strong>Address:</strong> {employee.address}</div>
          <div className="col-md-6 mb-3"><strong>City:</strong> {city}</div>
          <div className="col-md-6 mb-3"><strong>State:</strong> {state}</div>
          <div className="col-md-6 mb-3"><strong>Country:</strong> {country}</div>
          <div className="col-md-6 mb-3"><strong>Marital Status:</strong> {employee.marital_status === "M" ? "Married" : "Single"}</div>
          <div className="col-md-6 mb-3"><strong>Job Title:</strong> {employee.job_title}</div>
          <div className="col-md-6 mb-3">
            <strong>Joining Date:</strong> {employee.joining_date ? new Date(employee.joining_date).toLocaleDateString("en-GB", {day: "2-digit",month: "numeric",year: "numeric"}) : "-"}
          </div>
          <div className="col-md-6 mb-3"><strong>PAN Number:</strong> {employee.pan_number}</div>
          <div className="col-md-6 mb-3"><strong>Aadhaar Number:</strong> {employee.aadhaar_number}</div>
          <div className="col-md-6 mb-3"><strong>Bank Account:</strong> {employee.bank_account}</div>

          {employee.role === "EMPLOYEE" && (
            <>
              <div className="col-md-6 mb-3"><strong>IFSC Code:</strong> {employee.ifsc_code || "-"}</div>
              <div className="col-md-6 mb-3"><strong>PF Number:</strong> {employee.pf_number || "-"}</div>
              <div className="col-md-6 mb-3"><strong>Previous Company:</strong> {employee.previous_company || "-"}</div>
              <div className="col-md-6 mb-3"><strong>Experience Years:</strong> {employee.experience_years || "0.0"}</div>
              <div className="col-md-6 mb-3">
                <strong>Experience Certificate:</strong>{" "}
                {employee.experience_certificate ? (
                  <a href={employee.experience_certificate} target="_blank" rel="noreferrer">View PDF</a>
                ) : (
                  "-"
                )}
              </div>
            </>
          )}

          <div className="col-md-6 mb-3"><strong>College Name:</strong> {employee.college_name}</div>
          <div className="col-md-6 mb-3"><strong>Course:</strong> {employee.course}</div>
          <div className="col-md-6 mb-3"><strong>Year of Pass:</strong> {employee.year_of_pass}</div>
        </div>

        <div className="text-end mt-4">
          <Link to="/dashboard" className="btn btn-secondary me-2" style={{ width: "100px" }}>Back</Link>
          <Link to={`/edit/${employee.id}`} className="btn btn-primary" style={{ width: "100px" }}>Edit</Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
