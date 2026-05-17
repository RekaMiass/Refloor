import * as THREE from "three";
import type { RoomParams, PlankParams } from "../types";
import Floor from "./Floor";

interface RoomProps {
  room: RoomParams;
  plank: PlankParams;
  layoutType: "herringbone" | "straight";
  wallColor: string;
}

function WallPanel({
  width,
  height,
  position,
  rotation,
  color,
}: {
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        color={color}
        side={THREE.FrontSide}
        roughness={0.9}
      />
    </mesh>
  );
}

function Skirting({
  roomLength,
  roomWidth,
  skirtH = 0.1,
  skirtD = 0.015,
}: {
  roomLength: number;
  roomWidth: number;
  skirtH?: number;
  skirtD?: number;
}) {
  const y = skirtH / 2;
  const color = 0xe8dcc8;
  const segments: Array<{
    args: [number, number, number];
    position: [number, number, number];
    rotation?: [number, number, number];
  }> = [
    // Front wall
    {
      args: [roomLength, skirtH, skirtD],
      position: [0, y, roomWidth / 2 - skirtD / 2],
    },
    // Back wall
    {
      args: [roomLength, skirtH, skirtD],
      position: [0, y, -roomWidth / 2 + skirtD / 2],
    },
    // Left wall
    {
      args: [roomWidth - skirtD * 2, skirtH, skirtD],
      position: [-roomLength / 2 + skirtD / 2, y, 0],
      rotation: [0, Math.PI / 2, 0],
    },
    // Right wall
    {
      args: [roomWidth - skirtD * 2, skirtH, skirtD],
      position: [roomLength / 2 - skirtD / 2, y, 0],
      rotation: [0, Math.PI / 2, 0],
    },
  ];

  return (
    <>
      {segments.map((s, i) => (
        <mesh
          key={i}
          position={s.position}
          rotation={s.rotation}
          castShadow
          receiveShadow
        >
          <boxGeometry args={s.args} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
    </>
  );
}

export default function Room({
  room,
  plank,
  layoutType,
  wallColor,
}: RoomProps) {
  const { length: L, width: W, height: H } = room;
  const colorStr = wallColor;

  return (
    <group>
      {/* Floor base (subtle plane under planks) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial color="#8b7355" roughness={1} />
      </mesh>

      {/* Floor planks */}
      <Floor
        roomLength={L}
        roomWidth={W}
        plank={plank}
        layoutType={layoutType}
      />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial
          color="#f5f5f0"
          roughness={1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Walls */}
      {/* Back wall */}
      <WallPanel
        width={L}
        height={H}
        position={[0, H / 2, -W / 2]}
        rotation={[0, 0, 0]}
        color={colorStr}
      />
      {/* Front wall */}
      <WallPanel
        width={L}
        height={H}
        position={[0, H / 2, W / 2]}
        rotation={[0, Math.PI, 0]}
        color={colorStr}
      />
      {/* Left wall */}
      <WallPanel
        width={W}
        height={H}
        position={[-L / 2, H / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        color={colorStr}
      />
      {/* Right wall */}
      <WallPanel
        width={W}
        height={H}
        position={[L / 2, H / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        color={colorStr}
      />

      {/* Skirting */}
      <Skirting roomLength={L} roomWidth={W} />
    </group>
  );
}
