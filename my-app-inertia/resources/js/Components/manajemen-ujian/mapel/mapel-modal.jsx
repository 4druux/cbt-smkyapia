import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import InputField from "@/Components/common/input-field";
import Button from "@/Components/ui/button";

const MapelModal = ({ isOpen, onClose, onSave, selectedMapel }) => {
    const [formData, setFormData] = useState({
        nama_mapel: "",
        kode_mapel: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const isEditing = !!selectedMapel;

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFormData({
                    nama_mapel: selectedMapel.nama_mapel || "",
                    kode_mapel: selectedMapel.kode_mapel || "",
                });
            } else {
                setFormData({
                    nama_mapel: "",
                    kode_mapel: "",
                });
            }
            setErrors({});
        }
    }, [selectedMapel, isOpen]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        const finalValue = name === "nama_mapel" ? value.toUpperCase() : value;

        setFormData((prev) => ({ ...prev, [name]: finalValue }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        let validationErrors = {};
        if (!formData.nama_mapel) {
            validationErrors.nama_mapel = [
                "Nama mata pelajaran tidak boleh kosong.",
            ];
        }
        if (!formData.kode_mapel) {
            validationErrors.kode_mapel = [
                "Kode mata pelajaran tidak boleh kosong.",
            ];
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await onSave(formData, selectedMapel?.id);
            onClose();
        } catch (err) {
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors) {
                setErrors(serverErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
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
                        className="fixed bottom-0 left-0 right-0 w-full max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white shadow-xl md:static md:max-w-2xl md:max-h-[100%] md:rounded-2xl"
                    >
                        <div className="sticky top-0 z-10 flex justify-center bg-white py-4 md:hidden">
                            <div className="h-1 w-16 rounded-full bg-gray-300" />
                        </div>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="border-b border-slate-300 px-4 pb-4 md:p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-700">
                                        {isEditing
                                            ? "Edit Mata Pelajaran"
                                            : "Tambah Mata Pelajaran"}
                                    </h3>
                                    <div
                                        onClick={onClose}
                                        className="group cursor-pointer rounded-full p-2 hover:bg-slate-50"
                                    >
                                        <X className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:rotate-120 group-hover:text-gray-800" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4 p-4 md:space-y-6 md:p-6">
                                <InputField
                                    id="kode_mapel"
                                    name="kode_mapel"
                                    label="Kode Mata Pelajaran"
                                    value={formData.kode_mapel}
                                    onChange={handleChange}
                                    error={errors?.kode_mapel?.[0]}
                                    disabled={isSubmitting}
                                    required
                                />

                                <InputField
                                    id="nama_mapel"
                                    name="nama_mapel"
                                    label="Nama Mata Pelajaran"
                                    value={formData.nama_mapel}
                                    onChange={handleChange}
                                    error={errors?.nama_mapel?.[0]}
                                    disabled={isSubmitting}
                                    required
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        iconLeft={<X className="h-4 w-4" />}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        iconLeft={
                                            isSubmitting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )
                                        }
                                    >
                                        {isSubmitting
                                            ? "Menyimpan..."
                                            : "Simpan"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MapelModal;
