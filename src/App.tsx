import { useState, useMemo, Suspense } from 'react';
import type { RoomParams, PlankParams } from './types';
import { calculateRoom } from './utils/calculations';
import Controls from './components/Controls';
import Scene from './components/Scene';
import './App.css';

const DEFAULT_ROOM: RoomParams = { length: 5, width: 4, height: 2.7 };
const DEFAULT_PLANK: PlankParams = { length: 600, width: 100, gap: 2 };

export default function App() {
  const [room, setRoom] = useState<RoomParams>(DEFAULT_ROOM);
  const [plank, setPlank] = useState<PlankParams>(DEFAULT_PLANK);
  const [layoutType, setLayoutType] = useState<'herringbone' | 'straight'>('herringbone');
  const [wallColor, setWallColor] = useState('#d4c5a9');

  const calc = useMemo(
    () => calculateRoom(room, plank, layoutType),
    [room, plank, layoutType]
  );

  return (
    <div className="app">
      <Controls
        room={room}
        setRoom={setRoom}
        plank={plank}
        setPlank={setPlank}
        layoutType={layoutType}
        setLayoutType={setLayoutType}
        wallColor={wallColor}
        setWallColor={setWallColor}
        calc={calc}
      />
      <div className="canvas-wrap">
        <Suspense fallback={<div className="loading">Loading 3D scene…</div>}>
          <Scene
            room={room}
            plank={plank}
            layoutType={layoutType}
            wallColor={wallColor}
          />
        </Suspense>
      </div>
    </div>
  );
}
