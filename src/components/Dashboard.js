'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BarChart from './BarChart';
import { navItems, metrics, barData, tableRows } from '../lib/mockData';

export default function Dashboard() {
    const [active, setActive] = useState('overview');

    return (
        <section id="dashboard" className="py-28 md:py-36 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-xl mb-14">
                    <span className="font-mono text-xs tracking-[0.25em] text-violet uppercase">Dashboard preview</span>
                    <h2 className="font-display text-3xl md:text-5xl mt-4">A calm surface for a busy signal.</h2>
                    <p className="text-muted mt-4 text-lg">Every insight resolves into one workspace, built for a decision-maker who skims first and drills down second.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl border border-border bg-surface overflow-hidden grid grid-cols-1 md:grid-cols-[220px_1fr]"
                >
                    <aside className="border-b md:border-b-0 md:border-r border-border p-5 flex md:flex-col gap-1 overflow-x-auto">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActive(item.id)}
                                className={`relative text-left px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors duration-300 ${active === item.id ? 'text-ink' : 'text-muted hover:text-ink'
                                    }`}
                            >
                                {active === item.id && (
                                    <motion.span
                                        layoutId="sidebarActive"
                                        className="absolute inset-0 bg-surface2 rounded-lg"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{item.label}</span>
                            </button>
                        ))}
                    </aside>

                    <div className="p-6 md:p-8 min-h-[420px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    {metrics.map((m) => (
                                        <div key={m.label} className="rounded-xl border border-border p-4 hover:border-cyan/50 transition-colors duration-300">
                                            <span className="text-muted text-xs font-mono">{m.label}</span>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <span className="font-display text-2xl">{m.value}</span>
                                                <span className="text-cyan text-xs font-mono">{m.delta}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
                                    <div className="rounded-xl border border-border p-5">
                                        <span className="text-sm text-muted font-mono">Signal volume — 12 weeks</span>
                                        <div className="mt-6">
                                            <BarChart data={barData} />
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border p-5">
                                        <span className="text-sm text-muted font-mono">Ranked insights</span>
                                        <div className="mt-4 flex flex-col gap-3">
                                            {tableRows.map((row) => (
                                                <div key={row.name} className="flex items-center justify-between text-sm border-b border-border last:border-0 pb-3 last:pb-0">
                                                    <div className="flex flex-col">
                                                        <span className="text-ink">{row.name}</span>
                                                        <span className="text-muted text-xs font-mono">confidence {Math.round(row.confidence * 100)}%</span>
                                                    </div>
                                                    <span
                                                        className={`text-xs font-mono px-2 py-1 rounded-full ${row.status === 'Reviewed' ? 'text-cyan bg-cyan/10' : 'text-violet bg-violet/10'
                                                            }`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}