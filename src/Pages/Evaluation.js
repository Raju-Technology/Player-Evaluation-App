import React, { useState, useEffect } from "react";
import { db, collection, getDocs, where, query } from "../config";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'; 
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Evaluation({setDone,interestedTopics,setInterestedTopics,setActiveStep}) {
  const [interestAreas, setInterestAreas] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [topicsBackgroundColor, setTopicsBackgroundColor] = useState('white');

  useEffect(() => {
    const areasRef = collection(db, "Interested Areas");
    const areasQuery = query(areasRef);

    getDocs(areasQuery)
      .then((snapshot) => {
        const areasData = [];
        snapshot.forEach((doc) => {
          const area = doc.data();
          area.id = doc.id;
          areasData.push(area);
        });
        setInterestAreas(areasData);
      })
      .catch((error) => {
        console.error("Error fetching Interested Areas: ", error);
      });

    if (selectedArea) {
      const topicsRef = collection(db, "Topics");
      const topicsQuery = query(topicsRef, where("InterestedAreaId", "==", selectedArea));

      getDocs(topicsQuery)
        .then((snapshot) => {
          const topicsData = [];
          snapshot.forEach((doc) => {
            const topic = doc.data();
            topic.id = doc.id;
            topicsData.push(topic);
          });
          setTopics(topicsData);
        })
        .catch((error) => {
          console.error("Error fetching Topics: ", error);
        });
    }
  }, [selectedArea]);

  const handleAreaClick = (areaId) => {
    setSelectedArea(areaId);
    setTopicsBackgroundColor('#EDF4FB');
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === "TopicsList" && result.destination.droppableId === "InterestedTopicsList") {
      const movedTopic = topics[result.source.index];
      const newInterestedTopics = [...interestedTopics, movedTopic];
      setInterestedTopics(newInterestedTopics);

      const reorderedTopics = [...topics];
      reorderedTopics.splice(result.source.index, 1);
      setTopics(reorderedTopics);
    }
  };

  function handleDone(){
    setDone(true)
  }

  function handlePrev() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blue[600]),
    backgroundColor: blue[600],
    '&:hover': {
      backgroundColor: blue[800],
    },
  }));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <h2>Select Your Interested Areas</h2>
        <Box sx={{ display: 'flex' }}>
          {/* Sidebar for Interested Areas */}
          <Box sx={{ width: '30%', bgcolor: 'background.paper' }}>
            <List component="nav" aria-label="Interest Areas">
              {interestAreas.map((area) => (
                <ListItemButton
                  key={area.id}
                  selected={selectedArea === area.id}
                  onClick={() => handleAreaClick(area.id)}
                >
                  <ListItemText primary={area.name} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Topics Display */}
          <Box sx={{ width: '50%' }}>
            <Droppable droppableId="TopicsList">
              {(provided) => (
                <List
                  component="nav"
                  aria-label="Topics"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {topics.map((topic, index) => (
                    <Draggable key={topic.id} draggableId={topic.id} index={index}>
                      {(provided) => (
                        <ListItemButton
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ backgroundColor: topicsBackgroundColor }}
                        >
                          <ListItemText primary={topic.Title} />
                        </ListItemButton>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </Box>
        </Box>
        <div>
        <h2>Interested Topics</h2>
          <Droppable droppableId="InterestedTopicsList">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width: "90%",
                  minHeight: "100px",
                  padding: "0",
                  border: snapshot.isDraggingOver
                    ? "2px solid #00bcd4"
                    : "2px solid #ccc",
                  backgroundColor: snapshot.isDraggingOver ? "#f0f8ff" : "white"
                }}
              >
                
                {interestedTopics.map((topic, index) => (
                  <Draggable key={topic.id} draggableId={topic.id} index={index}>
                    {(provided) => (
                      <ListItemButton
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ backgroundColor: topicsBackgroundColor }}
                      >
                        <ListItemText primary={topic.Title} />
                      </ListItemButton>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="done">
            <ColorButton onClick={handlePrev} variant="contained">
              Previous
            </ColorButton>
            <ColorButton onClick={handleDone} variant="contained">
              Done
            </ColorButton>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Evaluation;
