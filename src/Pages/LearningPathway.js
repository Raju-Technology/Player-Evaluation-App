import React from "react"
import DNA1 from "../Images/DNA1.jpg"
import DNA2 from "../Images/DNA2.jpg"
import DNA3 from "../Images/DNA3.jpg"

function LearningPathway() {
    return(
        <div className="learning-pathway">
            <div className="dna-1">
               <p className="paragraph1">Let <strong>Our Skills</strong> speak for Us </p>
               <p className="paragraph2">A unique blend of concepts from the industry is hand picked and created as learning pathways in Technology Garage. Below are the various levels our students can achieve and get certified as they pass through every level.</p>
               <img src={DNA1} alt="DNA 1"/>
            </div>
            <div className="dna-2">
               <p className="paragraph1">Becoming a Technology Evalgelist 
                  <b> in Level 2 </b> </p>
               <p className="paragraph2">Given the foundation is well built in Level 1, Level 2 focuses on taking a deep dive into Cloud Computing, Web and Mobile <br></br> Technologies</p>
               <img src={DNA2} alt="DNA 2"/>
            </div>
            <div className="dna-3">
               <p className="paragraph1">Becoming a Technical Architect was tough,<br></br> <b>not anymore!</b> </p>
               <p className="paragraph2">Get introduced to Crypto-currency, Internet of Things, building solutions in Virtual Reality, deep dive into Google Analytics and <br></br>more!</p>
               <img src={DNA3} alt="DNA 2"/>
            </div>
        </div>
    )
}

export default LearningPathway;
