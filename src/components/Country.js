import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import NavCate from "./Navbar";

// const API_BASE = "https://surendranss.pythonanywhere.com/";
const API_BASE = "http://127.0.0.1:8000/";
const COUNTRY_API = API_BASE + "countries/";
const STATE_API = API_BASE + "states/";
const CITY_API = API_BASE + "cities/";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [activeTab, setActiveTab] = useState("country");
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [editing, setEditing] = useState({ type: "", id: null });

  useEffect(() => {
    loadCountries();
    loadStates();
    loadCities();
  }, []);

  const loadCountries = async () => {
    try {
      const res = await axiosInstance.get("countries/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setCountries(data || []);
    } catch (error) {
      console.error("Failed to load countries:", error);
      setCountries([]);
    }
  };

  const loadStates = async () => {
    try {
      const res = await axiosInstance.get("states/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setStates(data || []);
    } catch (error) {
      console.error("Failed to load states:", error);
      setStates([]);
    }
  };

  const loadCities = async () => {
    try {
      const res = await axiosInstance.get("cities/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setCities(data || []);
    } catch (error) {
      console.error("Failed to load cities:", error);
      setCities([]);
    }
  };

  const handleCountry = async () => {
    if (!countryName) {
      toast.error("Country name required!");
      return;
    }
    if (editing.type === "country") {
      await axiosInstance.put(`countries/${editing.id}/`, { name: countryName });
      toast.success("Country updated successfully!");
    } else {
      await axiosInstance.post("countries/", { name: countryName });
      toast.success("Country added successfully!");
    }
    setCountryName("");
    setEditing({ type: "", id: null });
    loadCountries();
  };

  const handleState = async () => {
    if (!stateName || !selectedCountry) {
      toast.error("State name and country required!");
      return;
    }
    if (editing.type === "state") {
      await axiosInstance.put(`states/${editing.id}/`, {
        name: stateName,
        country: selectedCountry,
      });
      toast.success("State updated successfully!");
    } else {
      await axiosInstance.post("states/", {
        name: stateName,
        country: selectedCountry,
      });
      toast.success("State added successfully!");
    }
    setStateName("");
    setSelectedCountry("");
    setEditing({ type: "", id: null });
    loadStates();
  };

  const handleCity = async () => {
    if (!cityName || !selectedState) {
      toast.error("City name and state required!");
      return;
    }
    if (editing.type === "city") {
      await axiosInstance.put(`cities/${editing.id}/`, {
        name: cityName,
        state: selectedState,
      });
      toast.success("City updated successfully!");
    } else {
      await axiosInstance.post("cities/", { name: cityName, state: selectedState });
      toast.success("City added successfully!");
    }
    setCityName("");
    setSelectedState("");
    setEditing({ type: "", id: null });
    loadCities();
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    if (type === "country") await axios.delete(`${COUNTRY_API}${id}/`);
    if (type === "state") await axios.delete(`${STATE_API}${id}/`);
    if (type === "city") await axios.delete(`${CITY_API}${id}/`);
    toast.info(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    loadCountries();
    loadStates();
    loadCities();
  };

  const startEdit = (type, item) => {
    setEditing({ type, id: item.id });
    if (type === "country") setCountryName(item.name);
    if (type === "state") {
      setStateName(item.name);
      setSelectedCountry(item.country);
    }
    if (type === "city") {
      setCityName(item.name);
      setSelectedState(item.state);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* ✅ Reuse Sidebar */}
        <div className="col-md-2 col-lg-2">
          <NavCate />
        </div>

        {/* Main Content */}
        <div className="col-md-10 col-lg-10">
          <div className="row mt-3">
            <div className="col-md-10">
              <h4 className="fw-bold mb-4 mt-3">Country / State / City</h4>
            </div>

            {/* Tab Buttons */}
            <div className="col-md-2 d-flex mb-4 mt-3" style={{ marginLeft: "-20px" }}>
              <button
                className={`btn me-2 ${activeTab === "country" ? "btn-secondary" : "btn-outline-muted"}`}
                onClick={() => setActiveTab("country")}
              >
                Country
              </button>
              <button
                className={`btn me-2 ${activeTab === "state" ? "btn-secondary" : "btn-outline-muted"}`}
                onClick={() => setActiveTab("state")}
              >
                State
              </button>
              <button
                className={`btn ${activeTab === "city" ? "btn-secondary" : "btn-outline-muted"}`}
                onClick={() => setActiveTab("city")}
              >
                City
              </button>
            </div>
          </div>

          <ToastContainer position="top-right" autoClose={3000} />

          {/* ✅ Country Section */}
          {activeTab === "country" && (
            <div className="card p-3 shadow-sm">
              <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Country Name"
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  style={{ width: "200px", marginLeft: "900px" }}
                />
                <button className="btn btn-success" onClick={handleCountry} style={{ width: "110px" }}>
                  {editing.type === "country" ? "Update" : "Add"}
                </button>
              </div>
              <table className="table table-hover">
                <thead className="table-secondary">
                  <tr>
                    <th>Index</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((c, index) => (
                    <tr key={c.id}>
                      <td>{index + 1}</td>
                      <td>{c.name}</td>
                      <td>
                        <button className="btn btn-sm btn-success me-2" onClick={() => startEdit("country", c)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteItem("country", c.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {countries.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No countries
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ State Section */}
          {activeTab === "state" && (
            <div className="card p-3 shadow-sm">
              <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="State Name"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  style={{ width: "200px", marginLeft: "700px" }}
                />
                <select
                  className="form-select me-2"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  style={{ width: "200px" }}
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={handleState} style={{ width: "110px" }}>
                  {editing.type === "state" ? "Update" : "Add"}
                </button>
              </div>
              <table className="table table-hover">
                <thead className="table-secondary">
                  <tr>
                    <th>Index</th>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map((s, index) => (
                    <tr key={s.id}>
                      <td>{index + 1}</td>
                      <td>{s.name}</td>
                      <td>{s.country_name}</td>
                      <td>
                        <button className="btn btn-sm btn-success me-2" onClick={() => startEdit("state", s)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteItem("state", s.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {states.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No states
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ City Section */}
          {activeTab === "city" && (
            <div className="card p-3 shadow-sm">
              <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="City Name"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  style={{ width: "200px", marginLeft: "750px" }}
                />
                <select
                  className="form-select me-2"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{ width: "200px" }}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={handleCity} style={{ width: "110px" }}>
                  {editing.type === "city" ? "Update" : "Add"}
                </button>
              </div>
              <table className="table table-hover">
                <thead className="table-secondary">
                  <tr>
                    <th>Index</th>
                    <th>Name</th>
                    <th>State</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((c, index) => (
                    <tr key={c.id}>
                      <td>{index + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.state_name}</td>
                      <td>{c.country_name}</td>
                      <td>
                        <button className="btn btn-sm btn-success me-2" onClick={() => startEdit("city", c)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteItem("city", c.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cities.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No cities
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Country;
