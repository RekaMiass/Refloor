import { useMemo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PlankParams } from "../types";

interface FloorProps {
  roomLength: number;
  roomWidth: number;
  plank: PlankParams;
  layoutType: "herringbone" | "straight";
}

const WOOD_COLORS = [
  0xc8a070, 0xc09a65, 0xd4a878, 0xb8905e, 0xcc9e6a, 0xba8c5a,
];
function woodColor(idx: number): THREE.Color {
  return new THREE.Color(WOOD_COLORS[idx % WOOD_COLORS.length]);
}

function makeClippingPlanes(roomL: number, roomW: number): THREE.Plane[] {
  return [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), roomL / 2),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), roomL / 2),
    new THREE.Plane(new THREE.Vector3(0, 0, 1), roomW / 2),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), roomW / 2),
  ];
}

function makeMaterial(
  clippingPlanes: THREE.Plane[],
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    roughness: 0.65,
    metalness: 0,
    clippingPlanes,
    clipShadows: true,
  });
}

function buildHerringboneGeometry(
  roomL: number,
  roomW: number,
  plankL: number,
  plankW: number,
  gap: number,
  clippingPlanes: THREE.Plane[],
): THREE.InstancedMesh {
  const gapM = gap / 1000;
  const planksPerBlock = Math.max(
    1,
    Math.floor((plankL + gapM) / (plankW + gapM)),
  );
  const blockSize = planksPerBlock * (plankW + gapM) - gapM;

  const numBlocksX = Math.ceil(roomL / blockSize) + 2;
  const numBlocksZ = Math.ceil(roomW / blockSize) + 2;
  const maxInstances = numBlocksX * numBlocksZ * planksPerBlock;

  const geometry = new THREE.BoxGeometry(plankL, 0.018, plankW);
  const mesh = new THREE.InstancedMesh(
    geometry,
    makeMaterial(clippingPlanes),
    maxInstances,
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const dummy = new THREE.Object3D();
  let idx = 0;

  for (let bz = -1; bz < numBlocksZ; bz++) {
    for (let bx = -1; bx < numBlocksX; bx++) {
      const isHorizontal = (bx + bz) % 2 === 0;
      const originX = -roomL / 2 + bx * blockSize;
      const originZ = -roomW / 2 + bz * blockSize;

      for (let p = 0; p < planksPerBlock; p++) {
        const offset = p * (plankW + gapM);

        if (isHorizontal) {
          dummy.position.set(
            originX + plankL / 2,
            0.009,
            originZ + offset + plankW / 2,
          );
          dummy.rotation.set(0, 0, 0);
        } else {
          dummy.position.set(
            originX + offset + plankW / 2,
            0.009,
            originZ + plankL / 2,
          );
          dummy.rotation.set(0, Math.PI / 2, 0);
        }

        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
        mesh.setColorAt(idx, woodColor(idx));
        idx++;
      }
    }
  }

  mesh.count = idx;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}

function buildStraightGeometry(
  roomL: number,
  roomW: number,
  plankL: number,
  plankW: number,
  gap: number,
  clippingPlanes: THREE.Plane[],
): THREE.InstancedMesh {
  const gapM = gap / 1000;
  const stepX = plankW + gapM;
  const stepZ = plankL + gapM;

  const cols = Math.ceil(roomL / stepX) + 2;
  const rows = Math.ceil(roomW / stepZ) + 2;
  const maxInstances = cols * rows;

  const geometry = new THREE.BoxGeometry(plankW, 0.018, plankL);
  const mesh = new THREE.InstancedMesh(
    geometry,
    makeMaterial(clippingPlanes),
    maxInstances,
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const dummy = new THREE.Object3D();
  let idx = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = -roomL / 2 + col * stepX + plankW / 2;
      const z = -roomW / 2 + row * stepZ + plankL / 2;
      dummy.position.set(x, 0.009, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      mesh.setColorAt(idx, woodColor(idx));
      idx++;
    }
  }

  mesh.count = idx;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}

export default function Floor({
  roomLength,
  roomWidth,
  plank,
  layoutType,
}: FloorProps) {
  const { gl } = useThree();
  const plankLm = plank.length / 1000;
  const plankWm = plank.width / 1000;

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const clippingPlanes = useMemo(
    () => makeClippingPlanes(roomLength, roomWidth),
    [roomLength, roomWidth],
  );

  const instancedMesh = useMemo(() => {
    if (layoutType === "herringbone") {
      return buildHerringboneGeometry(
        roomLength,
        roomWidth,
        plankLm,
        plankWm,
        plank.gap,
        clippingPlanes,
      );
    }
    return buildStraightGeometry(
      roomLength,
      roomWidth,
      plankLm,
      plankWm,
      plank.gap,
      clippingPlanes,
    );
  }, [
    roomLength,
    roomWidth,
    plankLm,
    plankWm,
    plank.gap,
    layoutType,
    clippingPlanes,
  ]);

  return <primitive object={instancedMesh} />;
}
