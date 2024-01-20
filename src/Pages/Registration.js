import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, addDoc } from "../config";

function Registration() {

  const navigate = useNavigate()
  // Define state variables to hold user input
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const hashPassword = (password) => {
    let hash = 0;
  
    if (password.length === 0) {
      return hash;
    }
  
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
  
    return hash.toString();
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Create an object with user data
      const hashedPassword = hashPassword(password);
      const userData = {
        name,
        phone,
        username,
        password:hashedPassword,
        adminaccess:"false",
      };

      // Add the user data to Firebase Firestore
      const docRef = await addDoc(collection(db, "TgAiUsers"), userData);
      console.log("Document written with ID: ", docRef.id);

      // Clear the form after successful registration
      setName("");
      setPhone("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      navigate("/login")
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h1>Register Screen</h1>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Registration;
