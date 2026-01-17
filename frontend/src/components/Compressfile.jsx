// src/components/CompressPin.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

const CompressPin = ({ imageFile, onCompressed }) => {
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [estimatedSize, setEstimatedSize] = useState(null);

  // Format bytes to KB/MB
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Estimate compressed size based on quality (empirical formula)
  const estimateCompressedSize = (originalBytes, quality) => {
    if (!originalBytes) return null;
    // JPEG compression approximation: size ≈ original * (quality^2)
    // Adjusted with real-world factor (~1.1–1.3x variance)
    const factor = quality < 0.7 ? 1.4 : quality < 0.9 ? 1.2 : 1.0;
    return Math.round(originalBytes * Math.pow(quality, 2) * factor);
  };

  // Update estimate when quality or file changes
  useEffect(() => {
    if (imageFile) {
      setOriginalSize(imageFile.size);
      const estimated = estimateCompressedSize(imageFile.size, quality);
      setEstimatedSize(estimated);
      // Generate preview URL once
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    }
  }, [imageFile, quality]);

  const compress = () => {
    if (!imageFile) return;

    setCompressing(true);
    setShowResult(false);

    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const MAX_WIDTH = 1200;
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = (MAX_WIDTH / width) * height;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        setCompressedSize(blob.size);
        setShowResult(true);
        onCompressed(blob);
        setCompressing(false);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', quality);
    };

    img.onerror = () => {
      console.error('Failed to load image');
      setCompressing(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div style={{
      marginTop: '24px',
      padding: '20px',
      background: 'linear-gradient(to right, #dbeafe, #e9d5ff)',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b21a8', marginBottom: '16px' }}>
        Compress Image
      </h4>

      {/* Image Preview + Pinned Size */}
      {previewUrl && (
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '300px',
              borderRadius: '12px',
              border: '2px solid #c4b5fd'
            }}
          />
          <div style={{
            marginTop: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#16a34a'
          }}>
            {showResult ? (
              <>
                Size: {formatSize(compressedSize)}
                <span style={{ color: '#22c55e', marginLeft: '8px' }}>
                  ↓ {(100 - (compressedSize / originalSize) * 100).toFixed(1)}%
                </span>
              </>
            ) : estimatedSize ? (
              <span style={{ color: '#7c3aed' }}>
                Est. size: ~{formatSize(estimatedSize)}
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Quality Slider */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
          <span>Quality</span>
          <span style={{ color: '#9333ea' }}>{Math.round(quality * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '8px',
            background: '#e5e7eb',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer'
          }}
          onInput={(e) => {
            const value = ((quality - 0.3) / 0.7) * 100;
            e.target.style.background = `linear-gradient(to right, #c084fc ${value}%, #fecdd3 ${value}%)`;
          }}
          disabled={compressing}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      {/* Compress Button */}
      <button
        onClick={compress}
        disabled={compressing || !imageFile}
        style={{
          width: '100%',
          padding: '12px',
          background: compressing ? '#9ca3af' : 'linear-gradient(to right, #7c3aed, #ec4899)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
          border: 'none',
          cursor: compressing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '16px'
        }}
        onMouseEnter={(e) => !compressing && (e.target.style.background = 'linear-gradient(to right, #6d28d9, #db2777)')}
        onMouseLeave={(e) => !compressing && (e.target.style.background = 'linear-gradient(to right, #7c3aed, #ec4899)')}
      >
        {compressing ? (
          <>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Compressing...
          </>
        ) : (
          'Compress & Apply'
        )}
      </button>

      {/* Final Result (Optional) */}
      {showResult && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '12px',
          border: '2px solid #bbf7d0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <div>
              <p style={{ color: '#4b5563' }}>
                Original: <strong>{formatSize(originalSize)}</strong>
              </p>
              <p style={{ color: '#4b5563' }}>
                Final: <strong style={{ color: '#16a34a' }}>{formatSize(compressedSize)}</strong>
              </p>
            </div>
            <CheckCircle size={28} style={{ color: '#16a34a' }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Add spin animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default CompressPin;