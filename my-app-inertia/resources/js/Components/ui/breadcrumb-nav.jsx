import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

const BreadcrumbNav = ({ items }) => {
    return (
        <div className="p-3 md:p-4 flex flex-col bg-indigo-100 rounded-xl shadow-sm gap-1 text-gray-700">
            <h1>Dashboard</h1>
            <nav className="flex flex-wrap items-center gap-1 md:gap-2 text-sm">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="capitalize opacity-50 hover:opacity-100 transition-opacity font-light hover:text-indigo-600 hover:underline"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="capitalize">{item.label}</span>
                        )}

                        {index < items.length - 1 && (
                            <ChevronRight size={20} className="opacity-75" />
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
};

export default BreadcrumbNav;
