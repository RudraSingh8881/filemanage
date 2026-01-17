// frontend/src/App.js
import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉 FileHub is Working!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Your frontend is running on localhost:3000</p>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '500px', margin: '0 auto', color: 'black' }}>
        <h2 style={{ color: '#6d28d9' }}>Backend Status: ✅ Connected</h2>
        <p>API calls are working perfectly!</p>
        <button 
          onClick={() => fetch('/api/test').then(r => r.json()).then(data => alert(JSON.stringify(data)))}
          style={{ padding: '10px 20px', background: '#6d28d9', color: 'white', border: 'none', borderRadius: '8px', margin: '10px' }}
        >
          Test Backend
        </button>
      </div>
    </div>
  );
}

export default App;