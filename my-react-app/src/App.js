import React, { useState } from 'react';

function App() {
  const [nama, setNama] = useState('');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Hello, {nama || 'Pengguna'}!</h1>
      <input
        type="text"
        placeholder="Rani"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        style={{ padding: '8px', fontSize: '16px' }}
      />
    </div>
  );
}

export default App;