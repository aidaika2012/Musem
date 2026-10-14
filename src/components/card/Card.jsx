import React from 'react';
import './Card.css';
import { Link } from 'react-router-dom';

export default function Card({data}) {
    
  return (
    <Link to={`/food/${data.idMeal}`}> 
    <div className="meal-card">
      <div className="meal-card-image-container">
        <img src={data.strMealThumb} alt={data.strMeal} className="meal-card-image" />
        
      </div>
      <div className="meal-card-content">
        <h3 className="meal-card-title">{data.strMeal}</h3>
      </div>
    </div>
    </Link>
  );
}