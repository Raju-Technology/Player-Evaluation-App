import React, { useState, useRef, useEffect } from "react";
import TechnologyGarageImage1 from "../Images/TechnologyGarageImage1.JPG"
import TechnologyGarageTour from "../Videos/TechnologyGarageTour.mp4"
import contacthero from "../Images/contacthero.jpg"
import TGBanner from "../Images/TGBanner.png"
import { db, collection, getDocs, query, where } from '../config';
// import Level2 from "./Level2";

function Home() {
  const contactRef = useRef(null);
  
  const [stageNames, setStageNames] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedButtonId, setSelectedButtonId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const mailtoURL = `mailto:admin@technology-garage.com?subject=New Contact Form Submission&body=Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    window.location.href = mailtoURL;
  };

  const handleContactButtonClick = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' }); 
    }
  };

  async function fetchStageTopics(stageId) {
    try {
      const stageTopicsRef = collection(db, 'StageTopics');
      const stageQuery = query(stageTopicsRef, where('stageId', '==', stageId));
      const querySnapshot = await getDocs(stageQuery);

      const topics = [];

      querySnapshot.forEach((doc) => {
        topics.push(doc.data()); 
      });

      setSelectedTopics(topics);
    } catch (error) {
      console.error('Error fetching stage topics:', error);
    }
  }

  useEffect(() => {
    async function fetchStageNames() {
      try {
        const stagesRef = collection(db, 'Stages');
        const querySnapshot = await getDocs(query(stagesRef, where('levelId', '==', 'level1')));
  
        const stageNamesArray = [];
        querySnapshot.forEach((doc) => {
          const stageData = doc.data();
          stageNamesArray.push({
            id: doc.id,
            name: stageData.name,
          });
        });
  
        setStageNames(stageNamesArray);
      } catch (error) {
        console.error('Error fetching stage names:', error);
      }
    }
  
    fetchStageNames();
  }, []);
  

  useEffect(() => {
    if (stageNames.length > 0) {
      const initialStage = stageNames[0].id; 
      setSelectedButtonId(initialStage);
      fetchStageTopics(initialStage);
    }
  }, [stageNames]);


  return (
      <div className="stepper">
          <div className="image-container">
            <video src={TechnologyGarageTour} autoPlay loop muted playsInline style={{ width: '100%', height: 'auto' }}></video>
            <div className="summer-camp-container">
              <div>
                <p className="paragraph">Our <b>Summer Camp</b> enrollment is now open!</p>
                <p className="summerCamp-paragraph">Technology Garage has brought the world's top most gadgets, methodologies, and mechanisms together to make a fun learning <br></br>experience. Learning pathways are designed to introduce the technical concepts slowly in a play-way methodology.</p>
                <button onClick={handleContactButtonClick}>Contact us now!</button>
              </div>
            </div>
            <div className="image-with-paragraph">
              <img src={TechnologyGarageImage1} alt="Technology Garage 1" />
              <div className="image-paragraph-container">
                  <h2 className="slide-from-left">Learning Technology Gamified!</h2>
                  <p className="slide-from-left">Kids will like Technology Garage as much as parents do with our gamified approach to teaching technology!</p>
              </div>
            </div>
            <div className="levels" style={{backgroundImage: `url(${TGBanner})`, backgroundSize: '100% 100%'}}>
                  <h1>Our Learning Pathway</h1>
                  <div className="stage-topics">
                    {stageNames.map((stage, index) => (
                      <button key={index} 
                      onClick={() => {
                        fetchStageTopics(stage.id);
                        setSelectedButtonId(stage.id);
                      }}
                      style={{
                        backgroundColor: selectedButtonId === stage.id ? '#bfc5c9' : 'rgba(15, 31, 56, 0.7)',
                        color: selectedButtonId === stage.id ? 'black' : 'white'
                      }}
                      >
                        {stage.name}
                      </button>
                    ))}
                  </div>

                  <div className="selected-topics">
                    {selectedTopics.map((topic, index) => (
                      <div key={index} className="topic-card">
                        <h2>{topic.Topic}</h2>
                        <p>{topic.Content}</p>
                      </div>
                    ))}
                  </div>
            </div>
            {/* <div>
              <Level2 />
            </div> */}
            <div ref={contactRef} className="contact" style={{backgroundImage: `url(${contacthero})`}} >
               <p className="paragraph1">Let's <strong>Connect</strong></p>
               <p className="paragraph2">Our associates are available over Phone, WhatsApp, Email, in our physical location. Reach us out to elevate your learning experience!s</p>
               <div className="parent-info">
               <div className="info">
                  <h3>Our Office <strong>Info</strong></h3>
                  <div className="headquarters">
                    <h4>Headquarters:</h4>
                    <p>Aclare Lane, Frisco, Texas</p>
                    <p>United States Of America</p>
                    <p>+1 6507660726</p>
                  </div>

                  <div className="regional-office">
                    <h4>Regional Office:</h4>
                    <p>36/1 Old Agraharam St. Thennur, Trichy</p>
                    <p>India</p>
                    <p>+91 7448427243</p>
                  </div>

                  <div className="connect">
                     <h2>Connect with us</h2>
                     <p>admin@technology-garage.com</p>
                  </div>
               </div>
               <div className="user-info">
                    <h3>Enroll by giving us a <strong>Call/Message</strong></h3>
                    <div className="user-form">
                      <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="message">Message:</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                        />
                        <button id="send-button" type="submit">Send now</button>
                      </form>
                    </div>
                  </div>
               </div>
            </div>
            <div className="footer">
                <p>Copyright © 2022 - Technology Garage</p>
            </div>
          </div>
      </div>
  );
}

export default Home;
