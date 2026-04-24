"use client";
import React, { useState, useEffect, useRef } from "react";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const DEFAULT_RADIUS = 280;
const MOBILE_RADIUS = 130;

export default function RadialOrbitalTimeline({
    timelineData,
}) {
    const [expandedItems, setExpandedItems] = useState({});
    const [radius, setRadius] = useState(DEFAULT_RADIUS);
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [isAutoRotating, setIsAutoRotating] = useState(true);

    // Update radius on resize
    useEffect(() => {
        const updateRadius = () => {
            if (window.innerWidth < 768) {
                setRadius(MOBILE_RADIUS);
            } else {
                setRadius(DEFAULT_RADIUS);
            }
        };
        updateRadius();
        window.addEventListener('resize', updateRadius);
        return () => window.removeEventListener('resize', updateRadius);
    }, []);

    // Motion value for the rotation angle (0 to 360)
    const rotation = useMotionValue(0);
    const animationRef = useRef(null);

    // Setup the continuous rotation
    useEffect(() => {
        if (isAutoRotating) {
            // Animate from current value to current + 360 to ensure smooth continuation
            // Actually, we can just animate linearly essentially forever
            // But to keep values manageable, we might loop. 
            // However, useTransform handles modulo math easily.
            // Let's just animate a large number or loop 0-360.

            // Best approach for seamless loop with framer motion 'animate':
            // We want to control speed.

            const controls = animate(rotation, rotation.get() + 360, {
                ease: "linear",
                duration: 60, // 60 seconds for full rotation
                repeat: Infinity,
                onUpdate: (latest) => {
                    // Optional: modulo to keep value small if needed, but linear is smoother
                    if (latest > 36000) rotation.set(latest % 360);
                }
            });

            animationRef.current = controls;
        } else {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        }

        return () => {
            if (animationRef.current) animationRef.current.stop();
        };
    }, [isAutoRotating, rotation]);

    const handleContainerClick = (e) => {
        // Only reset if clicking background
        setExpandedItems({});
        setActiveNodeId(null);
        setIsAutoRotating(true);
    };

    const toggleItem = (id) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) {
                    newState[parseInt(key)] = false;
                }
            });

            newState[id] = !prev[id];

            if (!prev[id]) {
                setActiveNodeId(id);
                setIsAutoRotating(false);

                // Calculate target rotation to bring this item to -90 degrees (top)
                const index = timelineData.findIndex(item => item.id === id);
                const total = timelineData.length;
                const itemAngle = (index / total) * 360; // The item's intrinsic angle

                // We want: currentRotation + itemAngle = -90 (or 270)
                // So: currentRotation should be -90 - itemAngle

                let currentRot = rotation.get();
                // Normalize current rotation to handle large values from infinite spin
                // currentRot = currentRot % 360; 

                // We want to find the CLOSEST target rotation to avoid wild spins.
                // Target is R such that (R + itemAngle) % 360 === 270 (-90)

                const targetAngle = -90 - itemAngle;

                // Adjust targetAngle to be close to currentRot
                // We want targetAngle + N*360 approx currentRot
                const diff = targetAngle - currentRot;
                const turns = Math.round(diff / 360);
                const finalTarget = targetAngle - (turns * 360);

                // Actually simpler:
                // We want the final visual angle to be -90. 
                // Currently it is (currentRot + itemAngle)
                // Difference needed = -90 - (currentRot + itemAngle)

                const currentVisualAngle = currentRot + itemAngle;
                // We want to go to -90.
                // Shortest path logic:
                let delta = -90 - currentVisualAngle;

                // Unwarp delta to be between -180 and 180 for shortest path
                while (delta <= -180) delta += 360;
                while (delta > 180) delta -= 360;

                const targetRotation = currentRot + delta;

                if (animationRef.current) animationRef.current.stop();

                animate(rotation, targetRotation, {
                    duration: 0.8,
                    ease: "circOut"
                });

            } else {
                setActiveNodeId(null);
                setIsAutoRotating(true);
            }

            return newState;
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "completed":
                return "text-white bg-green-500/80 border-green-500";
            case "in-progress":
                return "text-white bg-blue-500/80 border-blue-500";
            case "pending":
                return "text-white bg-gray-500/80 border-gray-500";
            default:
                return "text-white bg-gray-500/80 border-gray-500";
        }
    };

    return (
        <div
            className="w-full h-[350px] md:h-[600px] flex flex-col items-center justify-center bg-transparent relative overflow-visible"
            onClick={handleContainerClick}
        >
            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">

                {/* Central Hub */}
                <div className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 animate-pulse flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <div className="absolute w-20 h-20 rounded-full border border-deep-navy/20 animate-ping opacity-70"></div>
                    <div className="w-8 h-8 rounded-full bg-white backdrop-blur-md shadow-inner"></div>
                </div>

                {/* Orbit Path */}
                <div
                    className="absolute rounded-full border border-white/20 transition-all duration-500"
                    style={{
                        width: radius * 2,
                        height: radius * 2
                    }}
                ></div>

                {/* Nodes */}
                {timelineData.map((item, index) => (
                    <TimelineNode
                        key={item.id}
                        item={item}
                        index={index}
                        total={timelineData.length}
                        rotation={rotation}
                        radius={radius}
                        expandedItems={expandedItems}
                        toggleItem={toggleItem}
                        getStatusStyles={getStatusStyles}
                        activeNodeId={activeNodeId}
                    />
                ))}
            </div>
        </div>
    );
}

function TimelineNode({ item, index, total, rotation, radius, expandedItems, toggleItem, getStatusStyles, activeNodeId }) {
    const isExpanded = expandedItems[item.id];

    // Calculate initial angle offset for this node
    const offset = (index / total) * 360;

    // Transform rotation value to x/y coordinates
    // We add the offset to the global rotation value
    const currentAngle = useTransform(rotation, (r) => {
        const theta = (r + offset) * (Math.PI / 180); // Convert to radians
        return theta;
    });

    const x = useTransform(currentAngle, (theta) => radius * Math.cos(theta));
    const y = useTransform(currentAngle, (theta) => radius * Math.sin(theta));

    // Optional: Z-index and opacity based on "3D" position (y-axis or cos)
    // Using simple logic: things "lower" (positive y) or "front" can have higher z-index?
    // Originally: zIndex = 100 + 50 * cos(theta). cos(theta) relates to x? No, depends on perspective.
    // Original: x = radius * cos, y = radius * sin. 
    // zIndex = 100 + 50 * cos(theta).
    // Let's replicate this.

    const zIndex = useTransform(currentAngle, (theta) => Math.round(100 + 50 * Math.cos(theta)));

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 -ml-5 -mt-5 w-10 h-10 flex items-center justify-center cursor-pointer will-change-transform"
            style={{
                x,
                y,
                zIndex: isExpanded ? 200 : zIndex,
            }}
            whileHover={{ scale: 1.15 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
            }}
            onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
            }}
        >
            {/* Icon Bubble */}
            <div
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md relative bg-white",
                    isExpanded
                        ? "border-coral-prime scale-150 shadow-xl z-20"
                        : "border-coral-prime/20"
                )}
            >
                <item.icon size={16} className="text-coral-prime" />
            </div>

            {/* Title */}
            <div
                className={cn(
                    "absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold tracking-wider transition-all duration-300 pointer-events-none",
                    isExpanded ? "text-white scale-110" : "text-white/80"
                )}
            >
                {item.title}
            </div>

            {/* Expanded Card */}
            {isExpanded && (
                <Card
                    className="absolute top-20 left-1/2 -translate-x-1/2 w-80 bg-[#0179FE] text-white border-white/10 shadow-xl overflow-visible z-50 cursor-auto hover:bg-[#0179FE] text-left"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#0179FE]"></div>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">

                            <span className="text-xs font-mono text-[#012D5A] font-bold">
                                {item.date}
                            </span>
                        </div>
                        <CardTitle className="text-sm mt-2 text-white">
                            {item.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80">
                        <p>{item.content}</p>


                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
}
