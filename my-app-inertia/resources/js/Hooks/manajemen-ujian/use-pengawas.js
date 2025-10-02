import useSWR from "swr";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { fetcher } from "@/Utils/api";

export const usePengawas = () => {
    const {
        data: pengawas,
        error,
        mutate,
    } = useSWR("/api/users?role=pengawas", fetcher);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedPengawas, setSelectedPengawas] = useState(null);

    const handleOpenModal = (p = null) => {
        setSelectedPengawas(p);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPengawas(null);
    };

    const handleSavePengawas = async (formData) => {
        setIsProcessing(true);
        setErrors({});

        const isEditing = !!selectedPengawas;
        const url = isEditing
            ? `/api/users/${selectedPengawas.id}`
            : "/api/users";
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

    const handleDeletePengawas = async (pengawasId) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pengawas ini?")) return;

        try {
            const response = await axios.delete(`/api/users/${pengawasId}`);
            toast.success(response.data.message);
            mutate();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menghapus pengawas."
            );
        }
    };

    return {
        pengawas,
        isLoading: !pengawas && !error,
        error,
        isModalOpen,
        isProcessing,
        errors,
        selectedPengawas,
        handleOpenModal,
        handleCloseModal,
        handleSavePengawas,
        handleDeletePengawas,
    };
};
