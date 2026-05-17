import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { RoomParams, PlankParams } from '../types';
import Room from './Room';

interface SceneProps {
  room: RoomParams;
  plank: PlankParams;
  layoutType: 'herringbone' | 'straight';
  wallColor: string;
}

export default function Scene({ room, plank, layoutType, wallColor }: SceneProps) {
  const camY = room.height * 1.4;
  const camZ = Math.max(room.length, room.width) * 1.2;

  return (
    <Canvas
      shadows
      camera={{ position: [camZ * 0.7, camY, camZ], fov: 50, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#1a1a2e']} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[room.length, room.height * 2, room.width]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, room.height * 0.85, 0]} intensity={0.6} />

      <Room room={room} plank={plank} layoutType={layoutType} wallColor={wallColor} />

      <OrbitControls
        target={[0, room.height / 2, 0]}
        minDistance={1}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 + 0.1}
      />
    </Canvas>
  );
}
