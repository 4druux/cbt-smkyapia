import React from "react";
import { clsx } from "clsx";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    iconLeft,
    iconRight,
    className,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2";

    const variantStyles = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-700",
        outline:
            "border border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50",
    };

    return (
        <button
            type={type}
            className={clsx(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {iconLeft}
            {children}
            {iconRight}
        </button>
    );
};

export default Button;
