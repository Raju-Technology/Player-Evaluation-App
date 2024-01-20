import React from "react"
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
    return(
        <div className="error-msg">
            <h2>Please Login! to Continue</h2>
            <button onClick={handleLoginClick} style={{backgroundColor: '#526681'}}>Login</button>
        </div>
    )
}

export default Error