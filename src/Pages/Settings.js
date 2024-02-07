import React, { useEffect, useState, useMemo } from "react";
import {
    db,
    collection,
    query,
    where,
    getDocs,
} from "../config";

function Settings() {
    const [usernames, setUsernames] = useState([]);
    const [userCounts, setUserCounts] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch usernames from TgAiUsers collection
                const usersQuerySnapshot = await getDocs(collection(db, "TgAiUsers"));
                const usernamesArray = usersQuerySnapshot.docs.map(doc => doc.data().name);
                setUsernames(usernamesArray);

                // Fetch data from TgAiFormData and calculate counts for each user
                const counts = {};
                for (const username of usernamesArray) {
                    const formDataQuery = query(
                        collection(db, "TgAiFormData"),
                        where("selectedCreatedBy", "==", username)
                    );
                    const formDataQuerySnapshot = await getDocs(formDataQuery);

                    let totalCount = formDataQuerySnapshot.size;
                    let approvedCount = 0;
                    let rejectedCount = 0;

                    formDataQuerySnapshot.forEach((doc) => {
                        const status = doc.data().status;
                        if (status === "Approved") {
                            approvedCount++;
                        } else if (status === "Rejected") {
                            rejectedCount++;
                        }
                    });

                    counts[username] = { totalCount, approvedCount, rejectedCount };
                }
                setUserCounts(counts);
            } catch (error) {
                console.error("Error fetching documents: ", error);
            }
        };

        fetchData();

        // Cleanup function if needed
        return () => {
            // Perform cleanup here if needed
        };
    }, []); // Empty dependency array to run the effect only once

    // Memoize the sortedUsernames array
    const sortedUsernames = useMemo(() => {
        return [...usernames].sort((a, b) => {
            return userCounts[b]?.totalCount - userCounts[a]?.totalCount;
        });
    }, [usernames, userCounts]);

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ marginBottom: "20px" }}>Leader Board</h2>
            <div style={{ display: "flex", }}>
                <div style={{ width: "200px" }}>
                    <h3>Name</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {sortedUsernames.map((username, index) => (
                            <li key={index} style={{  marginBottom: "15px" }}>{username}</li>
                        ))}
                    </ul>
                </div>
                <div style={{ width: "150px", marginLeft: "20px" }}>
                    <h3 style={{ textAlign: "center" }}>TotalCount</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {sortedUsernames.map((username, index) => (
                            <li key={index} style={{ textAlign: "center", marginBottom: "15px" }}>{userCounts[username]?.totalCount}</li>
                        ))}
                    </ul>
                </div>
                <div style={{ width: "150px", marginLeft: "20px" }}>
                    <h3 style={{ textAlign: "center" }}>Approved</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {sortedUsernames.map((username, index) => (
                            <li key={index} style={{ textAlign: "center", marginBottom: "15px" }}>{userCounts[username]?.approvedCount}</li>
                        ))}
                    </ul>
                </div>
                <div style={{ width: "150px", marginLeft: "20px" }}>
                    <h3 style={{ textAlign: "center" }}>Rejected</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {sortedUsernames.map((username, index) => (
                            <li key={index} style={{ textAlign: "center", marginBottom: "15px" }}>{userCounts[username]?.rejectedCount}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Settings;
