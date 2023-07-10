import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const socket = new WebSocket('ws://localhost:3000');

const App = () => {
  const [hitpoints, setHitpoints] = useState();

  useEffect(() => {
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'PLAYER_INIT') {
        setHitpoints(data.payload.monster.hitpoints);
      }

      if (data.type === 'MONSTER_STATE') {
        setHitpoints(data.payload.monster.hitpoints);
      }
    });
  });

  return (
    <div>{hitpoints}/100</div>
  );
};

const root = createRoot(document.querySelector('main'));
root.render(<App />);
