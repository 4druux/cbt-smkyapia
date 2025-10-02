import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";

// const days = ["senin", "selasa", "rabu", "kamis", "jumat"];

export const useSesiUjianForm = (sesiId = null) => {
    const isEditing = !!sesiId;

    const { data: ruangans } = useSWR("/api/ruangan", fetcher);
    const { data: academicYears } = useSWR("/api/academic-years", fetcher);
    const { data: mapels } = useSWR("/api/mata-pelajaran", fetcher);
    const { data: allPengawas } = useSWR("/api/users?role=pengawas", fetcher);
    const { data: allSiswa } = useSWR("/api/siswa/all", fetcher);

    const { data: initialData } = useSWR(
        isEditing ? `/api/sesi-ujian/${sesiId}` : null,
        fetcher
    );

    const [formData, setFormData] = useState({
        ruangan_id: "",
        academic_year_id: "",
        semester: "",
        jenis_asesmen: "",
        jadwal_slots: [],
        pengawas_id: "",
        peserta_ids: [],
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                nama_sesi: initialData.nama_sesi || "",
                ruangan_id: initialData.ruangan_id || "",
                academic_year_id: initialData.academic_year_id || "",
                semester: initialData.semester || "",
                jenis_asesmen: initialData.jenis_asesmen || "",
                peserta_ids: initialData.pesertas?.map((p) => p.id) || [],
                jadwal_slots: initialData.jadwal_slots || [],
            });
        }
    }, [initialData, isEditing]);

    // useEffect(() => {
    //     if (!isEditing && formData.jadwal_slots.length === 0) {
    //         const initialSlots = days.map((day) => ({
    //             hari: day,
    //             waktu_mulai: "",
    //             waktu_selesai: "",
    //             mata_pelajaran_id: null,
    //         }));
    //         setFormData((prev) => ({
    //             ...prev,
    //             jadwal_slots: initialSlots,
    //         }));
    //     }
    // }, [isEditing]);

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                nama_sesi: initialData.nama_sesi || "",
                ruangan_id: initialData.ruangan_id || "",
                academic_year_id: initialData.academic_year_id || "",
                semester: initialData.semester || "",
                jenis_asesmen: initialData.jenis_asesmen || "",
                peserta_ids: initialData.pesertas?.map((p) => p.id) || [],
                jadwal_slots: initialData.jadwal_slots || [],

                date_range: initialData.date_range || {
                    from: undefined,
                    to: undefined,
                },
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

        const cleanedSlots = formData.jadwal_slots.filter((slot) => {
            const hasTime = slot.waktu_mulai && slot.waktu_selesai;
            const isIstirahat = slot.mata_pelajaran_id === "istirahat";
            const hasMapelAndPengawas =
                slot.mata_pelajaran_id && slot.pengawas_id;

            return hasTime && (isIstirahat || hasMapelAndPengawas);
        });

        const finalSlots = cleanedSlots.map((slot) => {
            if (slot.mata_pelajaran_id === "istirahat") {
                return {
                    ...slot,
                    mata_pelajaran_id: null,
                };
            }
            return slot;
        });

        if (
            finalSlots.length === 0 &&
            formData.jadwal_slots.some((s) => s.mata_pelajaran_id)
        ) {
            toast.error(
                "Harap lengkapi semua jadwal yang telah diisi (termasuk pengawas)."
            );
            setIsProcessing(false);
            return;
        }

        const dataToSend = {
            ...formData,
            jadwal_slots: finalSlots,
        };

        const url = isEditing ? `/api/sesi-ujian/${sesiId}` : "/api/sesi-ujian";
        const method = isEditing ? "put" : "post";

        try {
            const response = await axios[method](url, dataToSend);
            toast.success(response.data.message);
            router.visit(route("sesi-ujian.index"));
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);

                const firstErrorKey = Object.keys(validationErrors)[0];
                const firstErrorMessage = validationErrors[firstErrorKey][0];

                toast.error(`Kesalahan: ${firstErrorMessage}`);
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
            pengawas: allPengawas || [],
            allSiswa: allSiswa || [],
        },
        isLoading:
            (isEditing && !initialData) ||
            !ruangans ||
            !academicYears ||
            !mapels ||
            !allSiswa ||
            !allPengawas,
        handleFormChange,
        handleSubmit,
    };
};
