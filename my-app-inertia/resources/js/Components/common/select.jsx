import { forwardRef, useImperativeHandle, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, PlusCircle, Trash2, X } from "lucide-react";
import DotLoader from "@/Components/ui/dot-loader";
import { dropdownAnimation, useDropdown } from "@/Hooks/use-dropdown";

const Select = forwardRef(
    (
        {
            id,
            label,
            mandatory = false,
            options = [],
            isSearchable = true,
            value,
            onChange,
            error = "",
            disabled = false,
            isLoading = false,
            isProcessing = false,
            allowAdd = false,
            onAdd,
            allowDelete = false,
            onDelete,
            title,
            description,
        },
        ref
    ) => {
        const { isOpen, setIsOpen, dropdownRef } = useDropdown();
        const [searchTerm, setSearchTerm] = useState("");

        useImperativeHandle(ref, () => ({
            openDropdown: () => setIsOpen(true),
            focusInput: () => {
                const searchInput =
                    dropdownRef.current?.querySelector('input[type="text"]');
                if (searchInput) searchInput.focus();
            },
        }));

        const handleOptionClick = (selectedValue) => {
            onChange(selectedValue);
            setIsOpen(false);
            setSearchTerm("");
        };

        const handleReset = (e) => {
            e.stopPropagation();
            onChange("");
            setIsOpen(false);
            setSearchTerm("");
        };

        const handleClearSearch = (e) => {
            e.stopPropagation();
            setSearchTerm("");
        };

        const handleAddNewOption = async (e) => {
            e.stopPropagation();
            if (isProcessing) return;
            if (searchTerm.trim() && onAdd) {
                try {
                    await onAdd(searchTerm.trim().toUpperCase());
                    setIsOpen(false);
                    setSearchTerm("");
                } catch (err) {
                    console.error("Error during onAdd in Select:", err);
                }
            }
        };

        const handleDeleteItem = async (e, optionValue) => {
            e.stopPropagation();
            if (isProcessing) return;
            if (onDelete) {
                await onDelete(optionValue);
            }
        };

        const filteredOptions = searchTerm
            ? options.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : options;

        const showAddNewOption =
            allowAdd &&
            searchTerm.trim() &&
            !filteredOptions.some(
                (opt) =>
                    opt.label.toLowerCase() === searchTerm.trim().toLowerCase()
            );

        const selectedOptionLabel =
            options.find((opt) => opt.value === value)?.label || "";

        const selectClasses = [
            "flex items-center justify-between w-full rounded-lg border",
            "px-3 py-3 text-left text-sm",
            "focus:outline-none focus:ring-0",
            disabled || isLoading
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white cursor-pointer",
            error
                ? "border-red-500"
                : isOpen
                ? "border-indigo-500"
                : "border-gray-300",
        ].join(" ");

        const labelClasses = [
            "pointer-events-none absolute left-3 transform px-1 text-sm",
            "transition-all duration-200 ease-in-out",
            disabled || isLoading
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white cursor-pointer",
            value || isOpen
                ? "top-0 -translate-y-1/2"
                : "top-1/2 -translate-y-1/2",
            error
                ? "text-red-500"
                : isOpen
                ? "text-indigo-500"
                : "text-gray-500",
        ].join(" ");

        return (
            <div className="relative w-full" ref={dropdownRef}>
                <div className="relative">
                    <button
                        type="button"
                        id={id}
                        onClick={() =>
                            !disabled && !isLoading && setIsOpen(!isOpen)
                        }
                        disabled={disabled || isLoading}
                        className={selectClasses}
                    >
                        <span className="flex items-center gap-2 text-sm text-gray-900">
                            {isLoading ? (
                                <span className="text-gray-500">Memuat...</span>
                            ) : (
                                selectedOptionLabel || <>&nbsp;</>
                            )}
                        </span>
                        <div
                            className={`transform transition-transform ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        >
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                    </button>
                    <label htmlFor={id} className={labelClasses}>
                        {label}
                        {mandatory && (
                            <span className="ml-1 text-red-600">*</span>
                        )}
                    </label>
                </div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={dropdownAnimation.variants}
                            transition={dropdownAnimation.transition}
                            className="absolute p-3 z-20 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg"
                        >
                            {isLoading || isProcessing ? (
                                <div className="flex justify-center items-center py-10">
                                    <DotLoader />
                                </div>
                            ) : (
                                <>
                                    <div className="px-3 sticky top-0 z-10 bg-white pt-1">
                                        <div className="flex items-start justify-between gap-2">
                                            {title && (
                                                <span className="font-normal text-sm text-gray-700">
                                                    {title}
                                                </span>
                                            )}
                                            {value && (
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="text-red-600 hover:underline text-sm cursor-pointer font-medium"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                        {description && (
                                            <span className="block text-xs text-gray-500 my-2">
                                                {description}
                                            </span>
                                        )}
                                        {isSearchable && (
                                            <div className="relative my-2">
                                                <input
                                                    type="text"
                                                    placeholder={`Cari ${
                                                        label || "opsi"
                                                    }...`}
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value.toUpperCase()
                                                        )
                                                    }
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="w-full border border-slate-300 rounded-full px-3 py-1.5 text-sm placeholder:text-xs focus:outline-none focus:border-indigo-300"
                                                />
                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleClearSearch
                                                        }
                                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div className="border-b-2 border-slate-200 mb-1" />
                                    </div>
                                    <div className="overflow-y-auto max-h-52 mt-1 py-1">
                                        {showAddNewOption && (
                                            <div
                                                onClick={handleAddNewOption}
                                                className="flex items-center gap-2 p-3 hover:bg-green-50 text-green-600 cursor-pointer rounded-lg text-sm"
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                                Tambah &ldquo;
                                                {searchTerm.trim()}&rdquo;
                                            </div>
                                        )}
                                        {filteredOptions.length > 0 ? (
                                            filteredOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="flex items-center justify-between hover:bg-gray-100 rounded-lg group p-3 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOptionClick(
                                                            option.value
                                                        );
                                                    }}
                                                >
                                                    <label
                                                        className="flex-grow text-sm cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOptionClick(
                                                                option.value
                                                            );
                                                        }}
                                                    >
                                                        <span
                                                            className={
                                                                value ===
                                                                option.value
                                                                    ? "text-indigo-600 font-semibold"
                                                                    : "text-gray-800"
                                                            }
                                                        >
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={label}
                                                            value={option.value}
                                                            checked={
                                                                value ===
                                                                option.value
                                                            }
                                                            onChange={() =>
                                                                handleOptionClick(
                                                                    option.value
                                                                )
                                                            }
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            className="form-radio h-4 w-4 text-indigo-600 accent-indigo-600 cursor-pointer"
                                                        />
                                                        {allowDelete && (
                                                            <button
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                onClick={(e) =>
                                                                    handleDeleteItem(
                                                                        e,
                                                                        option.value
                                                                    )
                                                                }
                                                                className="p-1 ml-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20 cursor-pointer"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : !showAddNewOption ? (
                                            <div className="text-center text-sm text-gray-500 p-3">
                                                Tidak ada hasil ditemukan.
                                            </div>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
export default Select;
