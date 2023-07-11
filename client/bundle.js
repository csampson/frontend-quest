import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Ink from 'react-ink'

import dragon from './images/dragon.png';
import sword from './images/sword.png';

const images = {
  dragon,
  sword,
};

const WEBSOCKET_HOST = process.env.NODE_ENV === 'development'
  ? '10.0.0.23:3000'
  : '';

const socket = new WebSocket(`ws://${WEBSOCKET_HOST}`);

const Player = ({ name , hitpoints}) => {
  return (
    <div className='player'>
      <img src='https://units.wesnoth.org/1.12/pics/core%24images%24units%24human-loyalists%24swordsman.png' />
      <div className='player-name'>{name}</div>
      <div className='hitpoints'>
        <span className='hitpoints-fill' style={{ width: `${10 * hitpoints}%` }}></span>
      </div>
    </div>
  );
};

const App = () => {
  const [monster, setMonster] = useState({});
  const players = [
    { name: 'Cam', hitpoints: 5 },
    { name: 'Adrian', hitpoints: 2 },
    { name: 'Adrian', hitpoints: 2 },
    { name: 'Adrian', hitpoints: 2 },
    { name: 'Adrian', hitpoints: 2 },
    { name: 'Adrian', hitpoints: 2 }
  ];

  const attack = () => {
    socket.send(JSON.stringify({
      type: 'PLAYER_ATTACK',
      data: {
        damage: 10
      }
    }));
  };

  useEffect(() => {
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'PLAYER_INIT') {
        setMonster(data.payload.monster);
      }

      if (data.type === 'MONSTER_STATE' || data.type === 'MONSTER_RESPAWN') {
        setMonster(data.payload.monster);
      }
    });
  });

  return (
    <React.Fragment>
      <div className='scene'>
        <div className='monster-container'>
          <figure className='monster'>
            <img src={images[monster.name]} alt='' />
            <div className='hitpoints'>
            <span className='hitpoints-fill' style={{ width: `${monster.hitpoints}%` }}></span>
          </div>
          </figure>
        </div>
        
        <div className='player-container'>
          {players.map(player => (
            <Player key={player.id} {...player} />
          ))}
        </div>
      </div>

      <div className='status'>
        <menu className='menu'>
          <ul>
            <li>
              <button className='menu-action' type='button' onClick={attack}>
                <img src={images.sword} alt='Attack' />
                <Ink />
              </button>
            </li>
          </ul>
        </menu>
      </div>
    </React.Fragment>
  );
};

const root = createRoot(document.querySelector('main'));
root.render(<App />);
