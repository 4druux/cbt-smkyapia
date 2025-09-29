import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const useRuangan = () => {
    const { data: ruangans, error, mutate } = useSWR("/api/ruangan", fetcher);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedRuangan, setSelectedRuangan] = useState(null);

    const handleOpenModal = (ruangan = null) => {
        setSelectedRuangan(ruangan);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRuangan(null);
    };

    const handleSaveRuangan = async (formData) => {
        setIsProcessing(true);
        setErrors({});

        const isEditing = !!selectedRuangan;
        const url = isEditing
            ? `/api/ruangan/${selectedRuangan.id}`
            : "/api/ruangan";
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

    const handleDeleteRuangan = async (ruanganId) => {
        if (!confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) return;

        try {
            const response = await axios.delete(`/api/ruangan/${ruanganId}`);
            toast.success(response.data.message);
            mutate();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menghapus ruangan."
            );
        }
    };

    return {
        ruangans,
        isLoading: !ruangans && !error,
        error,
        isModalOpen,
        isProcessing,
        errors,
        selectedRuangan,
        handleOpenModal,
        handleCloseModal,
        handleSaveRuangan,
        handleDeleteRuangan,
    };
};
