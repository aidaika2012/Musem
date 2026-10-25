import React, { useEffect, useState } from "react";
import { fetchExhibitions } from "../services/apiService";

const ExhibitionManager = () => {
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        const data = await fetchExhibitions();
        setExhibitions(data);
      } catch (error) {
        console.error("Failed to load exhibitions:", error);
      }
    };

    loadExhibitions();
  }, []);

  return (
    <div>
      <h1>Exhibition Manager</h1>
      <ul>
        {exhibitions.map((exhibition) => (
          <li key={exhibition.id}>{exhibition.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExhibitionManager;
