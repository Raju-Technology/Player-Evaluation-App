import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { db, collection, query, where, getDocs } from "../config";

function Quizzing({ interestedTopics, setActiveStep,setTotalMarks, setDone }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (interestedTopics.length > 0) {
      // Fetch questions for the selected topics
      const fetchQuestions = async () => {
        const topicIds = interestedTopics.map((topic) => topic.id);
        const questionsRef = collection(db, "Quizzing");
        const questionsQuery = query(questionsRef, where("TopicsId", "in", topicIds));

        const querySnapshot = await getDocs(questionsQuery);
        const fetchedQuestions = [];

        querySnapshot.forEach((doc) => {
          fetchedQuestions.push({ id: doc.id, ...doc.data() });
        });

        // Shuffle the questions array to get random questions
        const shuffledQuestions = shuffleArray(fetchedQuestions);

        // Select the first 10 questions
        const selectedQuestions = shuffledQuestions.slice(0, 10);
        setQuestions(selectedQuestions);

        // Initialize answers object
        const initialAnswers = {};
        selectedQuestions.forEach((question) => {
          initialAnswers[question.id] = null;
        });
        setAnswers(initialAnswers);
      };

      fetchQuestions();
    }
  }, [interestedTopics]);

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, selectedAnswer) => {
    const updatedAnswers = { ...answers };
    updatedAnswers[questionId] = selectedAnswer;
    setAnswers(updatedAnswers);
  };

  // Handle submission
  const handleSubmit = () => {
    // Calculate total marks when the user submits the quiz
    let total = 0;
    questions.forEach((question) => {
      const selectedAnswer = answers[question.id];
      if (selectedAnswer === question.CorrectAnswer) {
        total += 10;
      }
      console.log("question:", question.Question, "selected Ans: ",selectedAnswer, "correct Answer:", question.CorrectAnswer,"total: ",total)
    });
    setTotalMarks(total);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrev = ()=>{
    setDone(false)
  }

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blue[600]),
    backgroundColor: blue[600],
    '&:hover': {
      backgroundColor: blue[800],
    },
  }));

  return (
    <div>
      <h2>Quizzing</h2>
      <ul style={{ listStyleType: 'none' }}>
        {questions.map((question, index) => (
          <li key={question.id}>
            <h3>{`${index + 1}. ${question.Question}`}</h3>
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column' }}>
              <li>
                <button
                  onClick={() => handleAnswerSelect(question.id, 'A')}
                  style={{
                    backgroundColor: answers[question.id] === 'A' ? '#7596ba' : 'white',
                    padding: '10px',
                    margin: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                >
                  A. {question.Answer1}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAnswerSelect(question.id, 'B')}
                  style={{
                    backgroundColor: answers[question.id] === 'B' ? '#7596ba' : 'white',
                    padding: '10px',
                    margin: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                >
                  B. {question.Answer2}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAnswerSelect(question.id, 'C')}
                  style={{
                    backgroundColor: answers[question.id] === 'C' ? '#7596ba' : 'white',
                    padding: '10px',
                    margin: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                >
                  C. {question.Answer3}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAnswerSelect(question.id, 'D')}
                  style={{
                    backgroundColor: answers[question.id] === 'D' ? '#7596ba' : 'white',
                    padding: '10px',
                    margin: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                >
                  D. {question.Answer4}
                </button>
              </li>
            </ul>
          </li>
        ))}
      </ul>
        <div className="submit">
          <ColorButton onClick={handlePrev}>Previous</ColorButton>
          <ColorButton onClick={handleSubmit}>Submit</ColorButton>
        </div>
    </div>
  );
}

export default Quizzing;
