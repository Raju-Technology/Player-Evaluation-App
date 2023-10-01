import React, { useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Technologygarage from "../Images/Technologygarage.png"
import Evaluation from "./Evaluation";
import Quizzing from "./Quizzing";
import Pathway from "./Pathway";

function Home() {
  const steps = [
    'Explore What is Technology Garage',
    'Evaluate What You Know',
    'Create Your Learning Pathway',
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [done,setDone] = useState(false)
  const [interestedTopics, setInterestedTopics] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  console.log(totalMarks)

  const handleNextClick = ()=>{
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[800],
    },
  }));


  return (
    <div className="stepper">
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {activeStep === 0 && (
        <div className="image-container">
          <img src={Technologygarage} alt="Technology Garage"/>
          <ColorButton onClick={handleNextClick}  style={{ marginTop: '20px', width:'150px' }}   size="large" variant="contained">Next</ColorButton>
        </div>
      )}
      {activeStep === 1 && !done && (
        <div style={{ marginLeft: '5%', marginTop: '5%' }}>
          <Evaluation setDone={setDone} interestedTopics={interestedTopics} setInterestedTopics={setInterestedTopics} setActiveStep={setActiveStep} />
        </div>
      )}
      {activeStep === 1 && done && (
        <div style={{marginLeft:'5%', marginTop:'5%'}}>
          <Quizzing interestedTopics={interestedTopics}  setActiveStep={setActiveStep} setTotalMarks={setTotalMarks} setDone={setDone}/>
        </div>
      )}
      {activeStep === 2 && (
        <div>
           <Pathway totalMarks={totalMarks}/>
        </div>
      )}
    </div>
  );
}

export default Home;
