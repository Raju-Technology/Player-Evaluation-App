import React from "react"
import SAT_1 from "../Images/SAT_1.JPG"
import SAT_2 from "../Images/SAT_2.JPG"
import SAT_3 from "../Images/SAT_3.JPG"

function Studio() {
    return(
        <div className="studio-parent">
            <div className="studio">
                <div className="studio-container">
                    <p className="paragraph1">Our <b>Studio</b> Setup </p>
                    <p className="paragraph2">Technology Garage is not a typical classroom setup, we have created a learning Studio for the kids to come out of the typical <br></br> classroom experience and start having fun as they learn from the very first step into the Garage. See it to beleve it!</p>
                </div>
                <div className="studio-images">
                    <img src={SAT_1} alt="SAT 1" className="image1"/>
                    <img src={SAT_2} alt="SAT 1" className="image2"/>
                    <img src={SAT_3} alt="SAT 1" className="image3"/>
                </div>
            </div>
            <div className="studio-info">
               <p>We are here to <b>make things Better</b></p>
            </div>
        </div>
        
    )
}

export default Studio