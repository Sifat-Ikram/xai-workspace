'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 1800;

function buildRandomPositions() {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        const r = 4.2 * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
        arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
}

function buildGridPositions() {
    const arr = new Float32Array(COUNT * 3);
    const cols = 40;
    const rows = 45;
    const spacingX = 0.22;
    const spacingY = 0.16;
    for (let i = 0; i < COUNT; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols) % rows;
        const layer = Math.floor(i / (cols * rows));
        arr[i * 3] = (col - cols / 2) * spacingX;
        arr[i * 3 + 1] = (row - rows / 2) * spacingY;
        arr[i * 3 + 2] = -layer * 0.4;
    }
    return arr;
}

export default function DataField({ progressRef, pointerRef }) {
    const pointsRef = useRef(null);
    const groupRef = useRef(null);

    const randomPositions = useMemo(() => buildRandomPositions(), []);
    const gridPositions = useMemo(() => buildGridPositions(), []);
    const current = useMemo(() => randomPositions.slice(), [randomPositions]);

    const colorNear = useMemo(() => new THREE.Color('#22D3EE'), []);
    const colorFar = useMemo(() => new THREE.Color('#8B5CF6'), []);
    const colors = useMemo(() => {
        const arr = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const t = i / COUNT;
            const c = colorNear.clone().lerp(colorFar, t);
            arr[i * 3] = c.r;
            arr[i * 3 + 1] = c.g;
            arr[i * 3 + 2] = c.b;
        }
        return arr;
    }, [colorNear, colorFar]);

    useFrame((state, delta) => {
        const progress = progressRef?.current ?? 0;
        const geo = pointsRef.current?.geometry;
        if (!geo) return;
        const posAttr = geo.attributes.position;
        const ease = progress * progress * (3 - 2 * progress);

        for (let i = 0; i < COUNT; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;
            const targetX = THREE.MathUtils.lerp(randomPositions[ix], gridPositions[ix], ease);
            const targetY = THREE.MathUtils.lerp(randomPositions[iy], gridPositions[iy], ease);
            const targetZ = THREE.MathUtils.lerp(randomPositions[iz], gridPositions[iz], ease);
            current[ix] = THREE.MathUtils.lerp(current[ix], targetX, 1 - Math.pow(0.001, delta));
            current[iy] = THREE.MathUtils.lerp(current[iy], targetY, 1 - Math.pow(0.001, delta));
            current[iz] = THREE.MathUtils.lerp(current[iz], targetZ, 1 - Math.pow(0.001, delta));
        }
        posAttr.array.set(current);
        posAttr.needsUpdate = true;

        if (groupRef.current) {
            const px = pointerRef?.current?.x ?? 0;
            const py = pointerRef?.current?.y ?? 0;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, px * 0.4, 0.04);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -py * 0.25, 0.04);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, ease * 0.15, 0.04);
        }
    });

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" array={current} count={COUNT} itemSize={3} />
                    <bufferAttribute attach="attributes-color" array={colors} count={COUNT} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.045} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
            </points>
        </group>
    );
}