"use client";
import { motion } from "framer-motion";
import React from "react";

export const TimelineContent = ({
    as: Component = "div",
    customVariants,
    animationNum = 0,
    timelineRef, // unused in basic implementation but passed in example
    className,
    children,
    ...props
}) => {
    const MotionComponent = motion(Component);

    return (
        <MotionComponent
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            custom={animationNum}
            variants={customVariants}
            className={className}
            {...props}
        >
            {children}
        </MotionComponent>
    );
};
