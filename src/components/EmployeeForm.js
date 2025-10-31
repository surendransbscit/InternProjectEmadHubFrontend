import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../api/axiosInstance";
import NavCate from "./Navbar";
import "./Dashboard.css";

const API_URL = "employees/";
const COUNTRY_API = "countries/";
const STATE_API = "states/";
const CITY_API = "cities/";

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({
    user: 1,
    role: "",
    full_name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    marital_status: "",
    job_title: "",
    joining_date: "",
    pan_number: "",
    aadhaar_number: "",
    bank_account: "",
    ifsc_code: "",
    pf_number: "",
    previous_company: "",
    experience_years: "",
    experience_certificate: "",
    college_name: "",
    course: "",
    year_of_pass: "",
    created_by: 1,
    updated_by: 1,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Load countries
    axiosInstance.get(COUNTRY_API)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setCountries(data || []);
      })
      .catch(() => setCountries([]));

    if (id) {
      axiosInstance.get(`${API_URL}${id}/`)
        .then((res) => {
          const emp = res.data;
          setEmployee(emp);

          if (emp.country) {
            axiosInstance.get(STATE_API)
              .then((s) => {
                const statesData = Array.isArray(s.data) ? s.data : s.data.results;
                setStates(statesData.filter((st) => st.country === emp.country));

                if (emp.state) {
                  axiosInstance.get(CITY_API)
                    .then((c) => {
                      const citiesData = Array.isArray(c.data) ? c.data : c.data.results;
                      setCities(citiesData.filter((ct) => ct.state === emp.state));
                    })
                    .catch(() => setCities([]));
                }
              })
              .catch(() => setStates([]));
          }
        })
        .catch((err) => console.error("Failed to load employee:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.files[0] });
  };

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setEmployee({ ...employee, country: countryId, state: "", city: "" });

    if (countryId) {
      axiosInstance.get(STATE_API)
        .then((res) => {
          const statesData = Array.isArray(res.data) ? res.data : res.data.results;
          setStates(statesData.filter((s) => s.country == countryId));
          setCities([]);
        })
        .catch(() => {
          setStates([]);
          setCities([]);
        });
    } else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setEmployee({ ...employee, state: stateId, city: "" });

    if (stateId) {
      axiosInstance.get(CITY_API)
        .then((res) => {
          const citiesData = Array.isArray(res.data) ? res.data : res.data.results;
          setCities(citiesData.filter((c) => c.state == stateId));
        })
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(employee).forEach((key) => {
      let value = employee[key];
      if (!value) return;

      if (key === "experience_certificate" && value instanceof File) {
        formData.append(key, value);
      } else if (
        ["country", "state", "city", "year_of_pass", "experience_years"].includes(key)
      ) {
        formData.append(key, Number(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (id) {
        await axiosInstance.put(`${API_URL}${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Employee updated successfully!");
      } else {
        await axiosInstance.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Employee created successfully!");
      }
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;

        // If backend returns field-specific errors (dict like {email: ["Invalid"], phone: ["Too short"]})
        Object.keys(backendErrors).forEach((field) => {
          const messages = backendErrors[field];
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(` ${msg}`));
          } else {
            toast.error(` ${messages}`);
          }
        });

        // If backend returns a general error string
        if (typeof backendErrors === "string") {
          toast.error(backendErrors);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };


  const RequiredLabel = ({ required }) => (
    <span style={{ color: "red" }}>{required && "*"}</span>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 col-lg-2">
          <NavCate />
        </div>

        <div className="col-md-10 col-lg-10 p-2">
          <ToastContainer position="top-right" autoClose={3000} />
          <h4 className="mb-3 mt-4">{id ? "Edit Employee" : "Add Employee"}</h4>

          <form onSubmit={handleSubmit} className="card shadow-sm p-4 mt-4">
            <div className="row">
              {/* Role */}
              <div className="col-md-6 mb-3">
                <label>Role</label><RequiredLabel required={true} />
                <select
                  name="role"
                  className="form-control custom-select-arrow"
                  value={employee.role}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                >
                  <option value="">Select Role</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="col-md-6 mb-3">
                <label>Full Name</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  value={employee.full_name}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* DOB */}
              <div className="col-md-6 mb-3">
                <label>DOB</label><RequiredLabel required={true} />
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={employee.dob}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* Gender */}
              <div className="col-md-6 mb-3">
                <label>Gender</label><RequiredLabel required={true} />
                <select
                  name="gender"
                  className="form-control custom-select-arrow"
                  value={employee.gender}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                >
                  <option value="">--Select--</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label>Email</label><RequiredLabel required={true} />
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={employee.email}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <label>Phone</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={employee.phone}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* Address */}
              <div className="col-md-6 mb-3">
                <label>Address</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={employee.address}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* Country */}
              <div className="col-md-6 mb-3">
                <label>Country</label><RequiredLabel required={true} />
                <select
                  name="country"
                  className="form-control custom-select-arrow"
                  value={employee.country}
                  onChange={handleCountryChange}
                  required
                  style={{ width: "550px" }}
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="col-md-6 mb-3">
                <label>State</label><RequiredLabel required={true} />
                <select
                  name="state"
                  className="form-control custom-select-arrow"
                  value={employee.state}
                  onChange={handleStateChange}
                  required
                  style={{ width: "550px" }}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="col-md-6 mb-3">
                <label>City</label><RequiredLabel required={true} />
                <select
                  name="city"
                  className="form-control custom-select-arrow"
                  value={employee.city}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Marital Status */}
              <div className="col-md-6 mb-3">
                <label>Marital Status</label><RequiredLabel required={true} />
                <select
                  name="marital_status"
                  className="form-control custom-select-arrow"
                  value={employee.marital_status}
                  onChange={handleChange}
                  style={{ width: "550px" }}
                >
                  <option value="">Select</option>
                  <option value="MARRIED">Married</option>
                  <option value="SINGLE">Single</option>
                </select>
              </div>

              {/* Job Title */}
              <div className="col-md-6 mb-3">
                <label>Job Title</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="job_title"
                  className="form-control"
                  value={employee.job_title}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* Joining Date */}
              <div className="col-md-6 mb-3">
                <label>Joining Date</label><RequiredLabel required={true} />
                <input
                  type="date"
                  name="joining_date"
                  className="form-control"
                  value={employee.joining_date}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* PAN Number */}
              <div className="col-md-6 mb-3">
                <label>PAN Number</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="pan_number"
                  className="form-control"
                  value={employee.pan_number}
                  onChange={handleChange}
                  style={{ width: "550px" }}
                />
              </div>

              {/* Aadhaar Number */}
              <div className="col-md-6 mb-3">
                <label>Aadhaar Number</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="aadhaar_number"
                  className="form-control"
                  value={employee.aadhaar_number}
                  onChange={handleChange}
                  required
                  style={{ width: "550px" }}
                />
              </div>

              {/* Bank Account */}
              <div className="col-md-6 mb-3">
                <label>Bank Account</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="bank_account"
                  className="form-control"
                  value={employee.bank_account}
                  onChange={handleChange}
                  style={{ width: "550px" }}
                />
              </div>

              {employee.role === "EMPLOYEE" && (
                <>
                  <div className="col-md-6 mb-3">
                    <label>Previous Company</label>
                    <RequiredLabel label="Full Name" required={true} />
                    <input
                      type="text"
                      name="previous_company"
                      className="form-control"
                      value={employee.previous_company}
                      onChange={handleChange}
                      style={{ width: "550px" }}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Experience Years</label>
                    <RequiredLabel label="Full Name" required={true} />
                    <input
                      type="number"
                      step="0.1"
                      name="experience_years"
                      className="form-control"
                      value={employee.experience_years}
                      onChange={handleChange}
                      style={{ width: "550px" }}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>PF Number</label>
                    <RequiredLabel label="Full Name" required={true} />
                    <input
                      type="text"
                      name="pf_number"
                      className="form-control"
                      value={employee.pf_number || ""}
                      onChange={handleChange}
                      style={{ width: "550px" }}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>IFSC Code</label>
                    <RequiredLabel label="Full Name" required={true} />
                    <input
                      type="text"
                      name="ifsc_code"
                      className="form-control"
                      value={employee.ifsc_code || ""}
                      onChange={handleChange}
                      style={{ width: "550px" }}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Experience Certificate</label>
                    <RequiredLabel label="Full Name" required={true} />
                    <input
                      type="file"
                      name="experience_certificate"
                      className="form-control"
                      onChange={handleFileChange}
                      style={{ width: "550px" }}
                    />
                    {employee.experience_certificate &&
                      typeof employee.experience_certificate === "string" && (
                        <a
                          href={employee.experience_certificate}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Uploaded File
                        </a>
                      )}
                  </div>
                </>
              )}

              {/* College Name */}
              <div className="col-md-6 mb-3">
                <label>College Name</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="college_name"
                  className="form-control"
                  value={employee.college_name}
                  onChange={handleChange}
                  style={{ width: "550px" }}
                />
              </div>

              {/* Course */}
              <div className="col-md-6 mb-3">
                <label>Course</label><RequiredLabel required={true} />
                <input
                  type="text"
                  name="course"
                  className="form-control"
                  value={employee.course}
                  onChange={handleChange}
                  style={{ width: "550px" }}
                />
              </div>

              {/* Year of Pass */}
              <div className="col-md-6 mb-3">
                <label>Year of Pass</label><RequiredLabel required={true} />
                <input
                  type="number"
                  name="year_of_pass"
                  className="form-control"
                  value={employee.year_of_pass}
                  onChange={handleChange}
                  style={{ width: "550px" }}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <Link to="/dashboard" className="btn btn-secondary me-2" style={{ width: "170px" }}>Back To Dashboard</Link>
              <button className="btn btn-success" style={{ width: "170px" }}>
                {id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
