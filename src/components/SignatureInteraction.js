'use client';

import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import ClusterField from './ClusterField';

export default function SignatureInteraction() {
    const [isClustered, setIsClustered] = useState(false);
    const clusteredRef = useRef(false);
    const dragRef = useRef({ vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0 });

    const toggle = () => {
        clusteredRef.current = !clusteredRef.current;
        setIsClustered(clusteredRef.current);
    };

    const handlePointerDown = (e) => {
        dragRef.current.dragging = true;
        dragRef.current.lastX = e.clientX;
        dragRef.current.lastY = e.clientY;
    };

    const handlePointerMove = (e) => {
        if (!dragRef.current.dragging) return;
        const dx = e.clientX - dragRef.current.lastX;
        const dy = e.clientY - dragRef.current.lastY;
        dragRef.current.vx = dx * 0.05;
        dragRef.current.vy = dy * 0.05;
        dragRef.current.lastX = e.clientX;
        dragRef.current.lastY = e.clientY;
    };

    const handlePointerUp = () => {
        dragRef.current.dragging = false;
    };

    return (
        <section id="automations" className="relative py-28 md:py-36 px-6 md:px-10 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-xl mb-10">
                    <span className="font-mono text-xs tracking-[0.25em] text-cyan uppercase">Signature interaction</span>
                    <h2 className="font-display text-3xl md:text-5xl mt-4">Automations that organize themselves.</h2>
                    <p className="text-muted mt-4 text-lg">
                        Every scattered signal belongs to a cluster it hasn&apos;t found yet. Drag to look around,
                        then trigger the reorganization.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-2xl border border-border bg-surface h-120 md:h-140 cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.6]}>
                        <ambientLight intensity={0.7} />
                        <ClusterField clusteredRef={clusteredRef} dragRef={dragRef} />
                    </Canvas>

                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                        <span className="font-mono text-xs text-muted">
                            {isClustered ? 'state: organized' : 'state: scattered'}
                        </span>
                        <button
                            onClick={toggle}
                            className="text-sm font-medium px-5 py-2.5 rounded-full bg-ink text-bg hover:bg-cyan transition-colors duration-300"
                        >
                            {isClustered ? 'Scatter signals' : 'Reorganize signals'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}