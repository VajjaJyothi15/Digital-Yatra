import React from 'react';

const categories = [
  { id: 'All', label: 'All Nearby', icon: '📍' },
  { id: 'Restroom', label: 'Restrooms', icon: '🚻' },
  { id: 'Water', label: 'Drinking Water', icon: '💧' },
  { id: 'Food', label: 'Food & Dining', icon: '🍴' },
  { id: 'Hospital', label: 'Hospitals', icon: '🏥' },
  { id: 'Police', label: 'Police Stations', icon: '👮' },
  { id: 'ATM', label: 'ATMs & Cash', icon: '🏧' },
  { id: 'Transport', label: 'Transport', icon: '🚕' },
  { id: 'Attraction', label: 'Attractions', icon: '🏛️' },
  { id: 'Stay', label: 'Hotels / Stay', icon: '🏨' },
];

const GuideMe = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-bar">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            className={`cat-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default GuideMe;
