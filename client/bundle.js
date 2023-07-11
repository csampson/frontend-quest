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

const Monster = ({attributes , isAttacking }) => {
  const { name, hitpoints } = attributes;
  let state = null;

  if (isAttacking) {
    state = 'attacking';
  }

  return (
    <div className='monster-container'>
      <figure className='monster' data-hitpoints={hitpoints} data-state={state}>
        <img src={images[name]} alt='' />
        <span className='monster-name'>{name}</span>
        <div className='hitpoints'>
          <span className='hitpoints-fill' style={{ width: `${hitpoints || 0}%` }}></span>
        </div>
      </figure>
    </div>
  );
}

const App = () => {
  const [monster, setMonster] = useState({});
  const [monsterAttacking, setMonsterAttacking] = useState(false);
  const [hitpoints, setHitpoints] = useState(100);

  const attack = () => {
    socket.send(JSON.stringify({
      type: 'PLAYER_ATTACK',
      data: {
        damage: 10
      }
    }));
  };

  const restartGame = () => {
    setHitpoints(100);
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

      if (data.type === 'MONSTER_ATTACK') {
        setHitpoints(hitpoints - data.payload.damage);
        setMonsterAttacking(true);

        setTimeout(() => {
          setMonsterAttacking(false);
        }, 1500);
      }
    });
  });

  if (hitpoints <= 0) {
    return (
      <div className='game-over'>
        <div>
          <h1>You Died</h1>

          <button className='game-over-restart' type='button' onClick={restartGame}>
            Rise from your Grave!
          </button>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className='scene'>
        <Monster attributes={monster} isAttacking={monsterAttacking} />
      </div>

      <div className='menu-container'>
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

        <footer className='status'>
          Hitpoints: {hitpoints}/100
        </footer>
      </div>
    </React.Fragment>
  );
};

const root = createRoot(document.querySelector('main'));
root.render(<App />);
