import React from 'react';
import { Card as CardType } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';

// Add global JSX type declaration
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'motion.div': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLDivElement> & {
                    variants?: any;
                    initial?: string;
                    animate?: string;
                    transition?: { duration: number };
                    role?: string;
                    'aria-label'?: string;
                },
                HTMLDivElement
            >;
        }
    }
}


interface CardProps {
    card: CardType;
    isHidden?: boolean;
}

const cardVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export function Card({ card, isHidden = false }: CardProps) {
    const { suit, rank } = card;
    const isRed = suit === '♥' || suit === '♦';

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3 }}
            className={`w-24 h-36 bg-white rounded-xl shadow-lg flex flex-col justify-between p-3 ${isRed ? 'text-red-500' : 'text-gray-800'
                } transform hover:scale-105 transition-transform duration-200`}
            role="img"
            aria-label={isHidden ? "Hidden Card" : `${rank} of ${suit}`}
        >
            {isHidden ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-4xl text-white">?</span>
                </div>
            ) : (
                <>
                    <div className="text-left text-2xl font-bold">{rank}</div>
                    <div className="text-center text-4xl">{suit}</div>
                    <div className="text-right text-2xl font-bold">{rank}</div>
                </>
            )}
        </motion.div>
    );
}
