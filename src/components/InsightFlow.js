'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

const stages = [
    {
        tag: '01',
        title: 'Ingest Data',
        copy: 'Streams from products, sensors, and systems land in one place, untouched and unfiltered.',
        stroke: '#22D3EE',
    },
    {
        tag: '02',
        title: 'Analyze with AI',
        copy: 'Models trace patterns across the noise, weighing signal against context in real time.',
        stroke: '#6FB8E8',
    },
    {
        tag: '03',
        title: 'Generate Insight',
        copy: 'Findings resolve into a single, actionable read your team can move on immediately.',
        stroke: '#8B5CF6',
    },
];

export default function InsightFlow() {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const lineRef = useRef(null);
    const pinRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray('.insight-panel');
            const track = trackRef.current;

            const scrollTween = gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: 'none',
                scrollTrigger: {
                    id: 'insightPin',
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${track.scrollWidth}`,
                },
            });

            pinRef.current = scrollTween.scrollTrigger;

            gsap.fromTo(
                lineRef.current,
                { strokeDashoffset: 1000 },
                {
                    strokeDashoffset: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        scrub: 1,
                        start: 'top top',
                        end: () => `+=${track.scrollWidth}`,
                    },
                }
            );

            panels.forEach((panel) => {
                gsap.fromTo(
                    panel.querySelectorAll('.reveal'),
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: panel,
                            containerAnimation: scrollTween,
                            start: 'left center',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );

                const spotlight = panel.querySelector('.spotlight');
                const handleMove = (e) => {
                    const rect = panel.getBoundingClientRect();
                    spotlight.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                    spotlight.style.setProperty('--my', `${e.clientY - rect.top}px`);
                };
                panel.addEventListener('pointermove', handleMove);
                panel.addEventListener('pointerenter', () => gsap.to(spotlight, { opacity: 1, duration: 0.4 }));
                panel.addEventListener('pointerleave', () => gsap.to(spotlight, { opacity: 0, duration: 0.4 }));
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const jumpToStage = (index) => {
        const st = pinRef.current;
        if (!st) return;
        const target = st.start + (st.end - st.start) * (index / (stages.length - 1));
        gsap.to(window, { duration: 1, scrollTo: { y: target }, ease: 'power2.inOut' });
    };

    return (
        <section id="workflow" ref={containerRef} className="relative h-screen overflow-hidden bg-surface border-y border-border">
            <svg
                ref={lineRef}
                viewBox="0 0 1000 4"
                preserveAspectRatio="none"
                className="absolute top-1/2 left-0 w-full h-px opacity-40"
                style={{ strokeDasharray: 1000 }}
            >
                <line x1="0" y1="2" x2="1000" y2="2" stroke="url(#flowGradient)" strokeWidth="2" />
                <defs>
                    <linearGradient id="flowGradient" x1="0" x2="1">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
            </svg>

            <div ref={trackRef} className="flex h-full w-[300%]">
                {stages.map((stage, i) => (
                    <div
                        key={stage.tag}
                        className="insight-panel group relative w-full h-full flex items-center justify-center px-6 md:px-24"
                    >
                        <div
                            className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity"
                            style={{
                                background: `radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), ${stage.stroke}14, transparent 70%)`,
                            }}
                        />

                        <div className="relative max-w-xl">
                            <span className="reveal inline-block font-mono text-sm text-muted transition-all duration-300 group-hover:tracking-[0.2em] group-hover:text-ink focus-visible:tracking-[0.2em]">
                                {stage.tag}
                            </span>

                            <h3
                                className="reveal font-display text-4xl md:text-6xl mt-3 mb-6 transition-transform duration-500 ease-out group-hover:translate-x-2"
                                style={{ color: stage.stroke }}
                            >
                                {stage.title}
                            </h3>

                            <p className="reveal text-muted text-lg leading-relaxed transition-colors duration-300 group-hover:text-ink/80">
                                {stage.copy}
                            </p>

                            <div className="reveal mt-8 flex gap-2">
                                {stages.map((_, dotIndex) => (
                                    <button
                                        key={dotIndex}
                                        type="button"
                                        aria-label={`Jump to stage ${dotIndex + 1}`}
                                        onClick={() => jumpToStage(dotIndex)}
                                        className="h-1.5 rounded-full transition-all duration-500 hover:h-2.5 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                                        style={{
                                            width: dotIndex === i ? '32px' : '8px',
                                            backgroundColor: dotIndex === i ? stage.stroke : '#1E2530',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}