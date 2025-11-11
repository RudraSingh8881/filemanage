// src/components/MasonryGrid.jsx - ✅ PERFECT AS IS
import React from 'react';
import PinCard from './PinCard';

const MasonryGrid = ({ pins, onEdit, onDelete }) => {
  return (
    <div className="masonry">
      {pins.map((pin, index) => (
        <div
          key={pin._id}
          className="masonry-item"
          ref={pin.ref || null}
        >
          <PinCard pin={pin} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;