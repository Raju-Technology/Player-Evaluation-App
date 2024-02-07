import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  db,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "../config";
import { format } from "date-fns";

function Service() {
  const [formData, setFormData] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [modifiedDate, setModifiedDate] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [names, setNames] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  console.log(modifiedDate)

  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: '#526681',
            width: '100px',
            color: 'white',
            marginBottom: '10px',
            '&:hover': {
              backgroundColor: '#1565c0', // Change color on hover if needed
            },
          },
        },
      },
    },
  });

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
    fetchData();
  }, [selectedName, selectedFromDate,selectedToDate, modifiedDate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Calculate counts when formData changes
    const approved = formData.filter((data) => data.status === "Approved").length;
    const rejected = formData.filter((data) => data.status === "Rejected").length;
    setApprovedCount(approved);
    setRejectedCount(rejected);
  }, [formData]);

  // Function to fetch data based on selectedName and selectedDate
  const fetchData = async () => {
    try {
        const formattedFromDate = selectedFromDate ? format(selectedFromDate, "yyyy-MM-dd") : "";
        const formattedToDate = selectedToDate ? format(selectedToDate, "yyyy-MM-dd") : "";
        const formattedModifiedDate = modifiedDate ? format(modifiedDate, "yyyy-MM-dd") : "";

        console.log("Selected Name:", selectedName);
        console.log("Formatted From Date:", formattedFromDate);
        console.log("Formatted To Date:", formattedToDate);
        console.log("Formatted Modified Date:", formattedModifiedDate);

        let q;

        if (selectedName && !selectedFromDate && !selectedToDate && !modifiedDate) {
            // If only selectedName is provided, fetch data based on selectedName
            q = query(
                collection(db, "TgAiFormData"),
                where("selectedCreatedBy", "==", selectedName)
            );
        } else if (modifiedDate) {
            // If modifiedDate is provided, fetch data based on selectedName and modifiedDate
            q = query(
                collection(db, "TgAiFormData"),
                where("selectedCreatedBy", "==", selectedName),
                where("modifiedAt", "==", formattedModifiedDate)
            );
        } else {
            // Otherwise, fetch data based on selectedName and date range
            q = query(
                collection(db, "TgAiFormData"),
                where("selectedCreatedBy", "==", selectedName),
                where("createdAt", ">=", formattedFromDate),
                where("createdAt", "<=", formattedToDate)
            );
        }

        console.log("Query:", q);

        const querySnapshot = await getDocs(q);
        console.log("Query Snapshot:", querySnapshot);

        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setFormData(data);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

  

  // Function to handle approval of a data entry
  const handleApprove = async (data) => {
    console.log("Data:", data);
    try {
      // Fetch the document from Firestore to ensure data integrity
      const docRef = collection(db, "TgAiFormData");
      const q = query(docRef, where("id", "==", data.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // If the document exists, update the status
        const docToUpdate = querySnapshot.docs[0].ref;
        await updateDoc(docToUpdate, { status: "Approved" });
        console.log("Document successfully updated!");
        // After updating, re-fetch the data to reflect the changes
        fetchData();
      } else {
        console.error("Document does not exist:", data.id);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  

  // Function to handle rejection of a data entry
  const handleReject = async (data) => {
    console.log("Data:", data);
    try {
      // Fetch the document from Firestore to ensure data integrity
      const docRef = collection(db, "TgAiFormData");
      const q = query(docRef, where("id", "==", data.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // If the document exists, update the status
        const docToUpdate = querySnapshot.docs[0].ref;
        await updateDoc(docToUpdate, { status: "Rejected" });
        console.log("Document successfully updated!");
        // After updating, re-fetch the data to reflect the changes
        fetchData();
      } else {
        console.error("Document does not exist:", data.id);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDelete = async (data) => {
    console.log("Data:", data);
    try {
      // Fetch the document from Firestore to ensure data integrity
      const docRef = collection(db, "TgAiFormData");
      const q = query(docRef, where("id", "==", data.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // If the document exists, update the status
        const docToUpdate = querySnapshot.docs[0].ref;
        await updateDoc(docToUpdate, { status: "Deleted" });
        console.log("Document successfully updated!");
        // After updating, re-fetch the data to reflect the changes
        fetchData();
      } else {
        console.error("Document does not exist:", data.id);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  

  return (
    <div>
      <div className="service-count">
        {isMobile ? <h3>Services</h3> : <h1>Services</h1>}
        {isMobile ? (
          <h5>Total Count: {formData.length}</h5>
        ) : (
          <h3>Total Count: {formData.length}</h3>
        )}
        <h3>Approved: {approvedCount} </h3>
        <h3>Rejected: {rejectedCount}</h3>
      </div>
      <div style={{ marginBottom: "10px"}}>
        <select
          id="nameDropdown"
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#526681',
            color: '#fff',
            width: '200px' // Adjust width as needed
          }}
        >
          <option value="">Select Name</option>
          {names.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div style={{display: "flex", flexDirection:"row", marginBottom:"10px"}}>
        <DatePicker
            selected={selectedFromDate}
            onChange={(date) => setSelectedFromDate(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select From Date"
            showTimeInput
            className="custom-datepicker"
          />
        <DatePicker
            selected={selectedToDate}
            onChange={(date) => setSelectedToDate(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select To Date"
            showTimeInput
            className="custom-datepicker"
          />
      </div>
      <DatePicker
        selected={modifiedDate}
        onChange={(date) => setModifiedDate(date)}
        dateFormat="MMMM d, yyyy"
        placeholderText="Modified date"
        showTimeInput
        className="custom-datepicker"
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
          <h4>Description</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <div className="data-inner-container">
                 <p>{data.details}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="description-container">
          <h4>Specialization</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <div className="data-inner-container">
                 <p>{JSON.stringify(data.specialization)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="status-container">
          <h4>Status</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <ThemeProvider theme={theme}>
                 <Button variant="contained" onClick={() => handleApprove(data)}>Approve</Button>
              </ThemeProvider>
              <ThemeProvider theme={theme}>
                  <Button variant="contained" onClick={() => handleReject(data)}>Reject</Button>
              </ThemeProvider>
              <ThemeProvider theme={theme}>
                  <Button variant="contained" onClick={() => handleDelete(data)}>Delete</Button>
              </ThemeProvider>
            </div>
          ))}
        </div>
        <div className="reviewed-container">
          <h4>Approval Status</h4>
          {formData.map((data, index) => (
            <div key={index} className="service-container">
              <div className="data-inner-container">
                 <p>{data.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Service;
