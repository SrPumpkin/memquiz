import { useEffect, useState } from "react";

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    decimals?: number;
    suffix?: string;
}

export default function AnimatedNumber({
    value,
    duration = 700,
    decimals = 0,
    suffix = "",
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const reduceMotion = typeof window.matchMedia === "function"
            && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            setDisplayValue(value);
            return;
        }

        const startTime = performance.now();
        let frame = 0;

        const animate = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(value * eased);

            if (progress < 1) {
                frame = window.requestAnimationFrame(animate);
            }
        };

        frame = window.requestAnimationFrame(animate);

        return () => window.cancelAnimationFrame(frame);
    }, [duration, value]);

    return (
        <span>
            {displayValue.toFixed(decimals)}
            {suffix}
        </span>
    );
}
