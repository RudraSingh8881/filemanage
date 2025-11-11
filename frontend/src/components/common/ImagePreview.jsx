import React from 'react';
import '../../styles/ImagePreview.css';

const ImagePreview = ({ images, onRemove }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="image-preview-container">
      <h3>Selected Images ({images.length}) - Will be saved in uploads/ folder</h3>
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-preview-item">
            <img 
              src={URL.createObjectURL(image)} 
              alt={`Preview ${index + 1}`}
              className="preview-image"
            />
            <button 
              className="remove-btn"
              onClick={() => onRemove(index)}
              title="Remove image"
            >
              ×
            </button>
            <div className="image-info">
              <span className="image-name">{image.name}</span>
              <span className="image-size">
                {(image.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;