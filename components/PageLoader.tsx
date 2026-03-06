"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Full-screen branded loader shown on initial page load.
 * Fades out smoothly once the page is ready.
 */
export default function PageLoader() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Wait for the page to be fully interactive, then fade out
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setVisible(false), 600); // matches CSS transition
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`page-loader ${fadeOut ? "page-loader--hidden" : ""}`}
            aria-hidden="true"
        >
            {/* Animated background shapes */}
            <div className="page-loader__bg">
                <div className="page-loader__blob page-loader__blob--1" />
                <div className="page-loader__blob page-loader__blob--2" />
            </div>

            {/* Center brand mark */}
            <div className="page-loader__content">
                <div className="page-loader__icon" style={{ background: "transparent", borderRadius: "50%", overflow: "hidden" }}>
                    <Image
                        src="/gom.jpeg"
                        alt="GangOfMusafirs Logo"
                        width={56}
                        height={56}
                        priority
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                </div>
                <h1 className="page-loader__title">GangOfMusafirs</h1>
                <p className="page-loader__subtitle">Travel Experiences</p>

                {/* Dot loader */}
                <div className="page-loader__dots">
                    <span className="page-loader__dot" />
                    <span className="page-loader__dot" />
                    <span className="page-loader__dot" />
                </div>
            </div>
        </div>
    );
}
