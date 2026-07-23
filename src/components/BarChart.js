'use client';

import { motion } from 'framer-motion';

export default function BarChart({ data }) {
    const max = Math.max(...data);
    return (
        <div className="flex items-end gap-1.5 h-32">
            {data.map((value, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(value / max) * 100}%` }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-t-sm"
                    style={{
                        background: `linear-gradient(180deg, ${i % 3 === 0 ? '#8B5CF6' : '#22D3EE'} 0%, rgba(34,211,238,0.15) 100%)`,
                    }}
                />
            ))}
        </div>
    );
}