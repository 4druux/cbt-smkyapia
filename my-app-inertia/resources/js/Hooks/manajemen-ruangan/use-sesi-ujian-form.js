import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";

export const useSesiUjianForm = (sesiId = null) => {
    const isEditing = !!sesiId;

    const { data: ruangans } = useSWR("/api/ruangan", fetcher);
    const { data: academicYears } = useSWR("/api/academic-years", fetcher);
    const { data: mapels } = useSWR("/api/mata-pelajaran", fetcher);
    const { data: allUsers } = useSWR("/api/users?role=siswa", fetcher);
    const { data: allPengawas } = useSWR("/api/users?role=pengawas", fetcher);

    const { data: initialData } = useSWR(
        isEditing ? `/api/sesi-ujian/${sesiId}` : null,
        fetcher
    );

    const [formData, setFormData] = useState({
        ruangan_id: "",
        academic_year_id: "",
        semester: "ganjil",
        jenis_asesmen: "asts",
        peserta_ids: [],
        jadwal_slots: [],
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                nama_sesi: initialData.nama_sesi || "",
                ruangan_id: initialData.ruangan_id || "",
                academic_year_id: initialData.academic_year_id || "",
                semester: initialData.semester || "ganjil",
                jenis_asesmen: initialData.jenis_asesmen || "asts",
                peserta_ids: initialData.pesertas?.map((p) => p.id) || [],
                jadwal_slots: initialData.jadwal_slots || [],
            });
        }
    }, [initialData, isEditing]);

    const handleFormChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrors({});

        const url = isEditing ? `/api/sesi-ujian/${sesiId}` : "/api/sesi-ujian";
        const method = isEditing ? "put" : "post";

        try {
            const response = await axios[method](url, formData);
            toast.success(response.data.message);
            router.visit(route("sesi-ujian.index"));
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                toast.error(
                    "Data yang diberikan tidak valid. Periksa kembali form."
                );
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

    return {
        formData,
        setFormData,
        errors,
        isProcessing,
        isEditing,
        masterData: {
            ruangans: ruangans || [],
            academicYears: academicYears || [],
            mapels: mapels || [],
            allUsers: (allUsers || []).concat(allPengawas || []),
        },
        isLoading:
            (isEditing && !initialData) ||
            !ruangans ||
            !academicYears ||
            !mapels ||
            !allUsers ||
            !allPengawas,
        handleFormChange,
        handleSubmit,
    };
};
