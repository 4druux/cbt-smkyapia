import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const useMapel = () => {
    const {
        data: mapels,
        error,
        mutate,
    } = useSWR("/api/mata-pelajaran", fetcher);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedMapel, setSelectedMapel] = useState(null);

    const handleOpenModal = (mapel = null) => {
        setSelectedMapel(mapel);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMapel(null);
    };

    const handleSaveMapel = async (formData) => {
        setIsProcessing(true);
        setErrors({});

        const isEditing = !!selectedMapel;
        const url = isEditing
            ? `/api/mata-pelajaran/${selectedMapel.id}`
            : "/api/mata-pelajaran";
        const method = isEditing ? "put" : "post";

        try {
            const response = await axios[method](url, formData);
            toast.success(response.data.message);
            mutate();
            handleCloseModal();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                toast.error("Data yang diberikan tidak valid.");
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Terjadi kesalahan pada server."
                );
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteMapel = async (mapelId) => {
        if (!confirm("Apakah Anda yakin ingin menghapus mata pelajaran ini?"))
            return;

        try {
            const response = await axios.delete(
                `/api/mata-pelajaran/${mapelId}`
            );
            toast.success(response.data.message);
            mutate();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Gagal menghapus mata pelajaran."
            );
        }
    };

    return {
        mapels,
        isLoading: !mapels && !error,
        error,
        isModalOpen,
        isProcessing,
        errors,
        selectedMapel,
        handleOpenModal,
        handleCloseModal,
        handleSaveMapel,
        handleDeleteMapel,
    };
};
