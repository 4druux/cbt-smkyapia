import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { eachDayOfInterval, format, differenceInDays } from "date-fns";
import { id as localeId } from "date-fns/locale";

export const useSesiUjianForm = (sesiUjian = null) => {
    const isEditing = !!sesiUjian;

    const { data: ruangans } = useSWR("/api/ruangan", fetcher);
    const { data: academicYears } = useSWR("/api/academic-years", fetcher);
    const { data: mapels } = useSWR("/api/mata-pelajaran", fetcher);
    const { data: allPengawas } = useSWR("/api/users?role=pengawas", fetcher);
    const { data: allSiswa } = useSWR("/api/siswa/all", fetcher);

    const [formData, setFormData] = useState({
        nama_sesi: "",
        ruangan_id: "",
        academic_year_id: "",
        semester: "",
        date_range: { from: undefined, to: undefined },
        jenis_asesmen: "",
        jadwal_slots: [],
        peserta_ids: [],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [availableRuangans, setAvailableRuangans] = useState(ruangans || []);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditing && sesiUjian) {
            const transformedSlots = (sesiUjian.jadwal_slots || []).map(
                (slot) => {
                    if (
                        slot.mata_pelajaran_id === null &&
                        slot.pengawas_id === null
                    ) {
                        return { ...slot, mata_pelajaran_id: "istirahat" };
                    }
                    return slot;
                }
            );

            setFormData({
                nama_sesi: sesiUjian.nama_sesi || "",
                ruangan_id: sesiUjian.ruangan_id || "",
                academic_year_id: sesiUjian.academic_year_id || "",
                semester: sesiUjian.semester || "",
                jenis_asesmen: sesiUjian.jenis_asesmen || "",
                peserta_ids: sesiUjian.selected_siswa_ids || [],
                jadwal_slots: transformedSlots,
                date_range: {
                    from: sesiUjian.tanggal_mulai
                        ? new Date(sesiUjian.tanggal_mulai)
                        : undefined,
                    to: sesiUjian.tanggal_selesai
                        ? new Date(sesiUjian.tanggal_selesai)
                        : undefined,
                },
            });
        }
    }, [sesiUjian, isEditing]);

    const handleFormChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "date_range") {
            const { from, to } = value;
            if (from && to) {
                if (differenceInDays(to, from) + 1 > 7) {
                    toast.error(
                        "Rentang tanggal tidak boleh lebih dari 7 hari."
                    );
                    setFormData((prev) => ({
                        ...prev,
                        date_range: { from, to: undefined },
                        jadwal_slots: [],
                    }));
                    return;
                }

                const daysInRange = eachDayOfInterval({ start: from, end: to });

                const newSlots = daysInRange.map((day) => ({
                    hari: format(day, "eeee, d MMM", { locale: localeId }),
                    waktu_mulai: "",
                    waktu_selesai: "",
                    mata_pelajaran_id: null,
                    pengawas_id: null,
                }));

                setFormData((prev) => ({
                    ...prev,
                    jadwal_slots: newSlots,
                }));
            } else if (!from || !to) {
                setFormData((prev) => ({ ...prev, jadwal_slots: [] }));
            }
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    useEffect(() => {
        if (ruangans) {
            setAvailableRuangans(ruangans);
        }
    }, [ruangans]);

    useEffect(() => {
        const { from, to } = formData.date_range;

        if (from && to) {
            const startDate = format(from, "yyyy-MM-dd");
            const endDate = format(to, "yyyy-MM-dd");

            let apiUrl = `/api/ruangan/available?start_date=${startDate}&end_date=${endDate}`;

            if (isEditing && sesiUjian?.id) {
                apiUrl += `&exclude_session_id=${sesiUjian.id}`;
            }

            axios
                .get(apiUrl)
                .then((response) => {
                    setAvailableRuangans(response.data);

                    const isCurrentRoomAvailable = response.data.some(
                        (room) => room.id === formData.ruangan_id
                    );

                    if (formData.ruangan_id && !isCurrentRoomAvailable) {
                        setFormData((prev) => ({ ...prev, ruangan_id: "" }));
                        toast.error(
                            "Ruangan yang dipilih sebelumnya tidak tersedia pada tanggal ini."
                        );
                    }
                })
                .catch((error) => {
                    console.error("Gagal memuat ruangan tersedia:", error);
                    toast.error("Gagal memuat daftar ruangan yang tersedia.");
                });
        } else {
            setAvailableRuangans(ruangans || []);
        }
    }, [
        formData.date_range,
        formData.ruangan_id,
        ruangans,
        isEditing,
        sesiUjian,
    ]);
    
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
            tanggal_mulai: formData.date_range.from
                ? format(formData.date_range.from, "yyyy-MM-dd")
                : null,
            tanggal_selesai: formData.date_range.to
                ? format(formData.date_range.to, "yyyy-MM-dd")
                : null,
            jadwal_slots: finalSlots,
        };

        const url = isEditing
            ? `/api/sesi-ujian/${sesiUjian.id}`
            : "/api/sesi-ujian";
        const method = isEditing ? "put" : "post";

        try {
            const response = await axios[method](url, dataToSend);
            toast.success(response.data.message);
            router.visit(route("sesi-ujian.index"), {
                replace: true,
                preserveState: false,
            });
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
            ruangans: availableRuangans,
            academicYears: academicYears || [],
            mapels: mapels || [],
            pengawas: allPengawas || [],
            allSiswa: allSiswa || [],
        },
        isLoading:
            !ruangans || !academicYears || !mapels || !allSiswa || !allPengawas,
        handleFormChange,
        handleSubmit,
    };
};
