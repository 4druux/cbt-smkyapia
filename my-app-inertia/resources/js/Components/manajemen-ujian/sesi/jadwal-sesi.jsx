import React, { useState, useMemo, useEffect, useRef } from "react";
import Select from "@/Components/common/select";
import { PlusCircle, Sparkles, Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";
import { SelectTimePicker } from "@/Components/common/select-time-picker";
import toast from "react-hot-toast";

const JadwalSesi = ({
    jadwalSlots,
    setFormData,
    masterMapels,
    masterPengawas,
    uniqueClasses,
    errors,
}) => {
    const [activeDay, setActiveDay] = useState("");
    const [activeKelasId, setActiveKelasId] = useState(null);

    const navRef = useRef(null);
    const dynamicDays = useMemo(() => {
        if (!jadwalSlots || jadwalSlots.length === 0) return [];
        return [...new Set(jadwalSlots.map((slot) => slot.hari))];
    }, [jadwalSlots]);

    useEffect(() => {
        if (dynamicDays.length > 0 && !dynamicDays.includes(activeDay)) {
            setActiveDay(dynamicDays[0]);
        }
    }, [dynamicDays, activeDay]);

    useEffect(() => {
        const isCurrentActiveInList = uniqueClasses.some(
            ({ kelas }) => kelas.id === activeKelasId
        );

        if (!isCurrentActiveInList && uniqueClasses.length > 0) {
            setActiveKelasId(uniqueClasses[0].kelas.id);
        } else if (uniqueClasses.length === 0) {
            setActiveKelasId(null);
        }
    }, [uniqueClasses]);

    const handleSlotChange = (index, field, value) => {
        const updatedSlots = [...jadwalSlots];
        updatedSlots[index][field] = value;
        if (field === "mata_pelajaran_id" && value === "istirahat") {
            updatedSlots[index].pengawas_id = null;
        }
        setFormData((prev) => ({ ...prev, jadwal_slots: updatedSlots }));
    };

    const addSlot = () => {
        if (!activeDay) {
            toast.error("Pilih rentang tanggal dan peserta ujian terlebih dahulu.");
            return;
        }
        const newSlot = {
            hari: activeDay,
            waktu_mulai: "",
            waktu_selesai: "",
            mata_pelajaran_id: null,
            kelas_id: activeKelasId,
            pengawas_id: null,
        };
        setFormData((prev) => ({
            ...prev,
            jadwal_slots: [...prev.jadwal_slots, newSlot],
        }));
    };

    const removeSlot = (index) => {
        const updatedSlots = [...jadwalSlots];
        updatedSlots.splice(index, 1);
        setFormData((prev) => ({ ...prev, jadwal_slots: updatedSlots }));
    };

    const handleAutoFill = () => {
        if (dynamicDays.length === 0 || uniqueClasses.length === 0) {
            toast.error(
                "Pilih rentang tanggal dan peserta ujian terlebih dahulu."
            );
            return;
        }
        if (masterMapels.length === 0 || masterPengawas.length === 0) {
            toast.error(
                "Data master mata pelajaran atau pengawas tidak ditemukan."
            );
            return;
        }

        const dailyScheduleTemplate = [
            { start: "07:30", end: "09:00", type: "mapel" },
            { start: "09:00", end: "10:30", type: "mapel" },
            { start: "10:30", end: "11:00", type: "istirahat" },
            { start: "11:00", end: "12:30", type: "mapel" },
        ];

        const shuffledMapels = [...masterMapels].sort(
            () => 0.5 - Math.random()
        );
        const shuffledPengawas = [...masterPengawas].sort(
            () => 0.5 - Math.random()
        );
        let mapelIndex = 0;
        let pengawasIndex = 0;

        const allNewSlots = [];

        dynamicDays.forEach((day) => {
            uniqueClasses.forEach(({ kelas }) => {
                const dayAndClassSchedule = dailyScheduleTemplate.map(
                    (template) => {
                        const mapel =
                            shuffledMapels[mapelIndex % shuffledMapels.length];
                        const pengawas =
                            shuffledPengawas[
                                pengawasIndex % shuffledPengawas.length
                            ];
                        mapelIndex++;
                        pengawasIndex++;

                        if (template.type === "istirahat") {
                            return {
                                hari: day,
                                kelas_id: kelas.id,
                                waktu_mulai: template.start,
                                waktu_selesai: template.end,
                                mata_pelajaran_id: "istirahat",
                                pengawas_id: null,
                            };
                        }
                        return {
                            hari: day,
                            kelas_id: kelas.id,
                            waktu_mulai: template.start,
                            waktu_selesai: template.end,
                            mata_pelajaran_id: mapel.id,
                            pengawas_id: pengawas.id,
                        };
                    }
                );
                allNewSlots.push(...dayAndClassSchedule);
            });
        });

        setFormData((prev) => ({ ...prev, jadwal_slots: allNewSlots }));
        toast.success(
            "Jadwal berhasil diisi otomatis untuk semua hari dan kelas!"
        );
    };

    const slotsForActiveDayAndKelas = jadwalSlots.filter(
        (slot) => slot.hari === activeDay && slot.kelas_id === activeKelasId
    );

    const canDelete = slotsForActiveDayAndKelas.length > 1;

    const mapelOptions = [
        { value: "istirahat", label: "-- Istirahat --" },
        ...masterMapels.map((m) => ({
            value: m.id,
            label: `(${m.kode_mapel}) - ${m.nama_mapel}`,
        })),
    ];

    const pengawasOptions = (masterPengawas || []).map((p) => ({
        value: p.id,
        label: p.name,
    }));

    const handleDayClick = (day, event) => {
        setActiveDay(day);

        event.currentTarget.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    };

    return (
        <div className="rounded-lg border p-3 md:p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-700">
                    Susun Jadwal Mata Pelajaran
                </h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoFill}
                >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Isi Otomatis
                </Button>
            </div>

            {uniqueClasses.length > 0 && (
                <div className="border-b border-gray-200 mb-4">
                    <nav
                        className="-mb-px flex space-x-2 md:space-x-3 overflow-x-auto"
                        aria-label="Kelas"
                    >
                        {uniqueClasses.map(({ kelas, academic_year }) => (
                            <button
                                key={kelas.id}
                                type="button"
                                onClick={() => setActiveKelasId(kelas.id)}
                                className={`relative whitespace-nowrap py-3 px-2 text-center font-medium text-sm ${
                                    activeKelasId === kelas.id
                                        ? "text-indigo-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <span>
                                    {`${kelas.nama_kelas} ${kelas.kelompok}`}{" "}
                                    {academic_year.year}
                                </span>

                                {activeKelasId === kelas.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-indigo-500 rounded-t-3xl" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            <div ref={navRef} className="border-b border-gray-200">
                <nav
                    className="-mb-px flex space-x-2 md:space-x-3 overflow-x-auto"
                    aria-label="Tabs"
                >
                    {dynamicDays.map((day) => (
                        <button
                            key={day}
                            onClick={(e) => handleDayClick(day, e)}
                            type="button"
                            className={`relative whitespace-nowrap py-3 px-1 font-medium text-sm capitalize ${
                                activeDay === day
                                    ? "text-indigo-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {day}
                            {activeDay === day && (
                                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-indigo-500 rounded-t-3xl" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6 space-y-4">
                {slotsForActiveDayAndKelas.map((slot) => {
                    const originalIndex = jadwalSlots.findIndex(
                        (s) => s === slot
                    );
                    return (
                        <div
                            key={originalIndex}
                            className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4"
                        >
                            <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 w-full">
                                <SelectTimePicker
                                    label="Waktu Mulai"
                                    value={slot.waktu_mulai}
                                    onChange={(newValue) =>
                                        handleSlotChange(
                                            originalIndex,
                                            "waktu_mulai",
                                            newValue
                                        )
                                    }
                                />

                                <SelectTimePicker
                                    label="Waktu Selesai"
                                    value={slot.waktu_selesai}
                                    onChange={(newValue) =>
                                        handleSlotChange(
                                            originalIndex,
                                            "waktu_selesai",
                                            newValue
                                        )
                                    }
                                />

                                <Select
                                    label="Mata Pelajaran"
                                    title="Pilih Mata Pelajaran"
                                    options={mapelOptions}
                                    value={slot.mata_pelajaran_id}
                                    onChange={(v) =>
                                        handleSlotChange(
                                            originalIndex,
                                            "mata_pelajaran_id",
                                            v
                                        )
                                    }
                                />

                                {slot.mata_pelajaran_id !== "istirahat" && (
                                    <Select
                                        label="Pengawas"
                                        title="Pilih Pengawas"
                                        options={pengawasOptions}
                                        value={slot.pengawas_id}
                                        onChange={(v) =>
                                            handleSlotChange(
                                                originalIndex,
                                                "pengawas_id",
                                                v
                                            )
                                        }
                                    />
                                )}
                            </div>

                            <div className="flex justify-end flex-shrink-0">
                                {canDelete && (
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="md"
                                        onClick={() =>
                                            removeSlot(originalIndex)
                                        }
                                        iconLeft={
                                            <Trash2 className="h-4 w-4" />
                                        }
                                    >
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
                <Button
                    type="button"
                    variant="outline"
                    size={{ base: "md", md: "lg" }}
                    onClick={addSlot}
                    iconLeft={<PlusCircle className="h-4 w-4" />}
                >
                    Tambah Slot hari {activeDay}
                </Button>
            </div>
            {errors?.jadwal_slots && (
                <p className="text-xs text-red-500 mt-2">
                    {errors.jadwal_slots[0]}
                </p>
            )}
        </div>
    );
};

export default JadwalSesi;
