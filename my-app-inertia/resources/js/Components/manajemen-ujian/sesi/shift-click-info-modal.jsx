import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Info, CheckCircle } from "lucide-react";

const ShiftClickInfoModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const instructionSteps = [
        {
            title: "Klik Awal:",
            description: "Klik checkbox pertama sebagai titik awal.",
        },
        {
            title: "Tahan Tombol Shift:",
            description:
                "Sekarang, tekan dan tahan tombol Shift di keyboard Anda.",
        },
        {
            title: "Klik Akhir:",
            description:
                "Sambil tetap menahan Shift, klik checkbox peserta lain yang ingin Anda jadikan titik akhir.",
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 250,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bottom-0 left-0 right-0 bg-white shadow-xl max-w-lg static rounded-2xl"
                    >
                        <div className="border-b border-slate-300 p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-700">
                                    Tips Memilih Cepat
                                </h3>
                                <div
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-50 rounded-full group cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-gray-500 group-hover:text-gray-800 group-hover:rotate-120 transition-all duration-300" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col items-start gap-4">
                                <div className="text-gray-700 flex items-center gap-2">
                                    <div className="p-1 flex items-center justify-center bg-indigo-100 rounded-full">
                                        <Info className="w-6 h-6 text-indigo-600" />
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="text-md">
                                            Gunakan Shift + Klik
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Pilih semua peserta dalam satu
                                            rentang dengan mudah.
                                        </p>
                                    </div>
                                </div>

                                {instructionSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-700 flex items-center gap-2"
                                    >
                                        <div className="p-1 flex items-center justify-center bg-green-100 rounded-full">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        </div>
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                {step.title}
                                            </span>{" "}
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShiftClickInfoModal;
