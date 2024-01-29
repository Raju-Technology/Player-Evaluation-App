import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  db,
  collection,
  query,
  where,
  getDocs,
} from "../config";
import { format } from "date-fns";

function Service() {
  const [formData, setFormData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [names, setNames] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const namesSnapshot = await getDocs(collection(db, "TgAiUsers"));
        const namesData = namesSnapshot.docs.map((doc) => doc.data().name);
        setNames(namesData);
      } catch (error) {
        console.error("Error fetching names: ", error);
      }
    };

    fetchNames();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Convert selectedDate to a format that matches your database
        const formattedDate = selectedDate
          ? format(selectedDate, "yyyy-MM-dd")
          : "";

        // Create a query with conditions
        const q = query(
          collection(db, "TgAiFormData"),
          where("selectedCreatedBy", "==", selectedName),
          where("createdAt", "==", formattedDate || 0)
        );

        // Get the documents based on the query
        const querySnapshot = await getDocs(q);

        // Process the documents and set the state
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [selectedName, selectedDate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="service-count">
        {isMobile ? <h3>Services</h3> : <h1>Services</h1>}
        {isMobile ? (
          <h5>Total Count: {formData.length}</h5>
        ) : (
          <h3>Total Count: {formData.length}</h3>
        )}
      </div>
      <div style={{marginBottom: "10px"}}>
        {/* <label htmlFor="nameDropdown">Select Name:</label> */}
        <select
          id="nameDropdown"
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        >
          <option value="">Select Name</option>
          {names.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMMM d, yyyy"
        placeholderText="Select Date"
        showTimeInput
      />
      <div className="service-content">
        <div className="id-container">
          <h4>Id</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <p>{data.id}</p>
            </div>
          ))}
        </div>
        <div className="name-container">
          <h4>Name</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <p>{data.name}</p>
            </div>
          ))}
        </div>
        <div className="description-container">
          <h4>description</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <p>{data.details}</p>
            </div>
          ))}
        </div>
        <div className="description-container">
          <h4>Specialization</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <p>{JSON.stringify(data.specialization)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Service;
