import React, { useEffect, useState } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { db, collection, getDocs } from "../config"; 

function Pathway({ totalMarks }) {
  const [timelineItems, setTimelineItems] = useState([]);

  const fetchTimelineItems = async () => {
    const pathwayCollection = collection(db, "Pathway");
    const snapshot = await getDocs(pathwayCollection);
    const items = [];
    
    snapshot.forEach((doc) => {
      const item = doc.data();
      items.push(item);
    });

    setTimelineItems(items);
  };

  useEffect(() => {
    fetchTimelineItems();
  }, []);

  return (
    <div className="pathway-container">
      <VerticalTimeline>
        {timelineItems.map((item, index) => (
          <VerticalTimelineElement
            contentStyle={{
              background: totalMarks > 40 && item.no <= 2 ? 'grey' : 'rgb(33, 150, 243)',
              color: '#fff'
            }}
            contentArrowStyle={{
              borderRight: (totalMarks > 40 && item.no <= 2) ? '7px solid grey' : '7px solid rgb(33, 150, 243)'
            }}
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            key={index}
          >
            <h3>{item.Title}</h3>
            <p>{item.Content}</p>
          </VerticalTimelineElement>
        ))}
        <div className="single-vertical-connector"></div>
      </VerticalTimeline>
    </div>
  );
}

export default Pathway;
