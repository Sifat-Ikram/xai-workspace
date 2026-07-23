'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 1200;
const CLUSTERS = 4;
const CLUSTER_COLORS = ['#22D3EE', '#6FB8E8', '#A78BFA', '#8B5CF6'];

function buildScattered() {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 9;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
}

function buildClustered() {
    const arr = new Float32Array(COUNT * 3);
    const centers = [];
    for (let c = 0; c < CLUSTERS; c++) {
        const angle = (c / CLUSTERS) * Math.PI * 2;
        centers.push([Math.cos(angle) * 2.6, Math.sin(angle) * 1.6, (c - CLUSTERS / 2) * 0.6]);
    }
    for (let i = 0; i < COUNT; i++) {
        const c = i % CLUSTERS;
        const [cx, cy, cz] = centers[c];
        const r = 0.75 * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        arr[i * 3] = cx + r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = cy + r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = cz + r * Math.cos(phi);
    }
    return arr;
}

export default function ClusterField({ clusteredRef, dragRef }) {
    const pointsRef = useRef(null);
    const groupRef = useRef(null);

    const scattered = useMemo(() => buildScattered(), []);
    const clustered = useMemo(() => buildClustered(), []);
    const current = useMemo(() => scattered.slice(), [scattered]);

    const colors = useMemo(() => {
        const arr = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const hex = CLUSTER_COLORS[i % CLUSTERS];
            const c = new THREE.Color(hex);
            arr[i * 3] = c.r;
            arr[i * 3 + 1] = c.g;
            arr[i * 3 + 2] = c.b;
        }
        return arr;
    }, []);

    useFrame((state, delta) => {
        const geo = pointsRef.current?.geometry;
        if (!geo) return;
        const posAttr = geo.attributes.position;
        const target = clusteredRef.current ? clustered : scattered;

        for (let i = 0; i < COUNT * 3; i++) {
            current[i] = THREE.MathUtils.lerp(current[i], target[i], 1 - Math.pow(0.0015, delta));
        }
        posAttr.array.set(current);
        posAttr.needsUpdate = true;

        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.08 + dragRef.current.vx * 0.02;
            groupRef.current.rotation.x += dragRef.current.vy * 0.02;
            dragRef.current.vx *= 0.9;
            dragRef.current.vy *= 0.9;
        }
    });

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" array={current} count={COUNT} itemSize={3} />
                    <bufferAttribute attach="attributes-color" array={colors} count={COUNT} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
            </points>
        </group>
    );
}