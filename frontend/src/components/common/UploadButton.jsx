import React, { useRef, useState } from 'react';
import '../../styles/UploadButton.css';

const UploadButton = ({ onFilesSelect, multiple = true }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onFilesSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelect(files);
    }
  };

  return (
    <div className="upload-button-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
      />
      
      <button
        className={`upload-btn ${isDragging ? 'dragging' : ''}`}
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title="Upload images to uploads folder"
      >
        <span className="plus-icon">+</span>
      </button>
    </div>
  );
};

export default UploadButton;