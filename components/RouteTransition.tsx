"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Top progress bar + page content fade on route changes.
 * Wraps around `children` to animate page transitions.
 */
export default function RouteTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showBar, setShowBar] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const prevPath = useRef(pathname);

    const startTransition = useCallback(() => {
        setShowBar(true);
        setProgress(0);
        setIsTransitioning(true);

        // Animate progress bar in steps
        let p = 0;
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            p += Math.random() * 15 + 5;
            if (p >= 85) {
                p = 85;
                if (timerRef.current) clearInterval(timerRef.current);
            }
            setProgress(p);
        }, 120);
    }, []);

    const completeTransition = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setProgress(100);

        setTimeout(() => {
            setShowBar(false);
            setProgress(0);
            setIsTransitioning(false);
        }, 350);
    }, []);

    useEffect(() => {
        if (prevPath.current !== pathname) {
            prevPath.current = pathname;

            // Defer state updates to avoid synchronous setState in effect body
            const rafId = requestAnimationFrame(() => {
                startTransition();
            });

            // Small delay to let the new page render, then complete
            const id = setTimeout(() => completeTransition(), 300);

            return () => {
                cancelAnimationFrame(rafId);
                clearTimeout(id);
            };
        }
    }, [pathname, searchParams, startTransition, completeTransition]);

    return (
        <>
            {/* Progress bar */}
            {showBar && (
                <div
                    className="route-progress"
                    style={{
                        transform: `scaleX(${progress / 100})`,
                    }}
                />
            )}

            {/* Page content with fade */}
            <div
                className={`route-content ${isTransitioning ? "route-content--transitioning" : "route-content--visible"}`}
            >
                {children}
            </div>
        </>
    );
}
