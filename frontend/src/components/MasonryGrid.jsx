// src/components/MasonryGrid.jsx - ✅ PERFECT AS IS
import React from 'react';
import FileCard from './FileCard';

const MasonryGrid = ({ pins, onEdit, onDelete }) => {
  return (
    <div className="masonry">
      {pins.map((pin, index) => (
        <div
          key={pin._id}
          className="masonry-item"
          ref={pin.ref || null}
        >
          <FileCard pin={pin} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;