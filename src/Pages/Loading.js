import React from "react"

function Loading() {
    return(
        <div style={{backgroundColor: "#3A434E", color: "white", height: "100vh"}}>
           <h2 style={{position:"fixed", top:"50%", left:"50%"}}>...Processing</h2>
        </div>
    )
}

export default Loading
