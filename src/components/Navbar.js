'use client';

import { motion } from 'framer-motion';

const links = ['Product', 'Workflow', 'Dashboard', 'Automations'];

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan" />
                    <span className="font-display text-lg tracking-tight">Xai</span>
                    <span className="hidden sm:inline text-muted text-sm font-mono">/ intelligence-workspace</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm text-muted font-body">
                    {links.map((link) => (
                        <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-ink transition-colors duration-300">
                            {link}
                        </a>
                    ))}
                </div>
                <button className="text-sm font-medium px-4 py-2 rounded-full border border-border hover:border-cyan hover:text-cyan transition-colors duration-300">
                    Request Access
                </button>
            </div>
        </motion.nav>
    );
}