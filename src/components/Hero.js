'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import DataField from './DataField';

export default function Hero() {
    const sectionRef = useRef(null);
    const progressRef = useRef(0);
    const pointerRef = useRef({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        progressRef.current = v;
    });

    const labelOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80]);

    useEffect(() => {
        const handleMove = (e) => {
            pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', handleMove);
        return () => window.removeEventListener('pointermove', handleMove);
    }, []);

    return (
        <section ref={sectionRef} id="product" className="relative h-[220vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
                <div className="absolute inset-0">
                    <Canvas camera={{ position: [0, 0, 9], fov: 42 }} dpr={[1, 1.6]}>
                        <ambientLight intensity={0.6} />
                        <DataField progressRef={progressRef} pointerRef={pointerRef} />
                    </Canvas>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-transparent to-bg pointer-events-none" />

                <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-center">
                    <motion.span
                        style={{ opacity: labelOpacity }}
                        className="font-mono text-xs tracking-[0.25em] text-cyan uppercase mb-6"
                    >
                        Xai — Intelligence Workspace
                    </motion.span>

                    <motion.h1
                        style={{ y: headlineY }}
                        className="font-display text-5xl md:text-7xl leading-[1.02] max-w-3xl"
                    >
                        Raw data,{' '}
                        <span className="text-gradient">structured into intelligence.</span>
                    </motion.h1>

                    <motion.p
                        style={{ opacity: labelOpacity }}
                        className="mt-6 max-w-xl text-muted text-base md:text-lg"
                    >
                        Xai ingests scattered signals and organizes them into decision-ready
                        structure — quietly, precisely, without the noise. Scroll to watch
                        the shift from chaos to order.
                    </motion.p>

                    <motion.div style={{ opacity: labelOpacity }} className="mt-10 flex items-center gap-3 text-xs text-muted font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                        scroll to structure the field
                    </motion.div>
                </div>
            </div>
        </section>
    );
}