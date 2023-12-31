import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs, where, query } from "../config";
import {Link} from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Query the Firestore collection for the provided username
      const userQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        // User not found
        setLoginError("Username not found");
        return;
      }

      // Retrieve the user data
      const userData = querySnapshot.docs[0].data();

      // Check if the provided password matches the stored password
      if (userData.password !== password) {
        setLoginError("Incorrect password");
        return;
      }

      // Successful login
      navigate("/home")
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Login</h1>
        {loginError && <p className="error-message">{loginError}</p>}
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
        <button type="submit">Login</button>
        <hr />
        <div className="new-user-button">
          <Link to="/registration">New User</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
