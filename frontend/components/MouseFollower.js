'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function MouseFollower() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <>
            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 bg-teal-400/30 rounded-full pointer-events-none z-50 backdrop-blur-sm mix-blend-screen"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                }}
            />
            {/* Trailing Glow */}
            <motion.div
                className="fixed top-0 left-0 w-32 h-32 bg-orange-400/10 rounded-full pointer-events-none z-40 blur-2xl"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    x: -48, // Offset to center the larger circle
                    y: -48
                }}
                transition={{ type: "spring", damping: 50, stiffness: 200 }}
            />
        </>
    );
}
