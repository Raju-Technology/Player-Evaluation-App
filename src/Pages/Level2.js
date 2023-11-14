import React, { useState, useEffect } from "react";
import { db, collection, getDocs, query, where } from '../config';

function Level2(){

    const [stageNames, setStageNames] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedButtonId, setSelectedButtonId] = useState(null);

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
            const querySnapshot = await getDocs(query(stagesRef, where('levelId', '==', 'level2')));
      
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

    return(
        <div className="levels" style={{backgroundColor:"#bfc5c9"}}>
        <h1>Level 2</h1>
        <div className="stage-topics">
          {stageNames.map((stage, index) => (
            <button key={index} 
            onClick={() => {
              fetchStageTopics(stage.id);
              setSelectedButtonId(stage.id);
            }}
            style={{
              backgroundColor: selectedButtonId === stage.id ? '#bfc5c9' : '#F0F0F0',
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
    )
}

export default Level2;
