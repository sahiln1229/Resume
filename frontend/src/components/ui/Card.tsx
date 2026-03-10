import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
    onMouseMove?: (e: React.MouseEvent) => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, animate = true, onMouseMove }, ref) => {
        return (
            <motion.div
                ref={ref}
                onMouseMove={onMouseMove}
                initial={animate ? { opacity: 0, y: 20 } : undefined}
                whileInView={animate ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className={cn('premium-card p-6 bg-card', className)}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";
