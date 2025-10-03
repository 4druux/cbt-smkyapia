import React, { useState, useMemo, useEffect } from "react";
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
    errors,
}) => {
    const dynamicDays = useMemo(() => {
        if (!jadwalSlots || jadwalSlots.length === 0) return [];
        return [...new Set(jadwalSlots.map((slot) => slot.hari))];
    }, [jadwalSlots]);

    const [activeDay, setActiveDay] = useState("");

    useEffect(() => {
        if (dynamicDays.length > 0 && !dynamicDays.includes(activeDay)) {
            setActiveDay(dynamicDays[0]);
        }
    }, [dynamicDays, activeDay]);

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
            toast.error("Pilih rentang tanggal terlebih dahulu.");
            return;
        }
        const newSlot = {
            hari: activeDay,
            waktu_mulai: "",
            waktu_selesai: "",
            mata_pelajaran_id: null,
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
        if (jadwalSlots.length === 0) {
            toast.error("Pilih rentang tanggal terlebih dahulu.");
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

        const newSlots = [];
        const uniqueDays = [...new Set(jadwalSlots.map((slot) => slot.hari))];

        uniqueDays.forEach((day) => {
            const daySchedule = dailyScheduleTemplate.map((template) => {
                const mapel =
                    shuffledMapels[mapelIndex % shuffledMapels.length];
                const pengawas =
                    shuffledPengawas[pengawasIndex % shuffledPengawas.length];
                mapelIndex++;
                pengawasIndex++;

                if (template.type === "istirahat") {
                    return {
                        hari: day,
                        waktu_mulai: template.start,
                        waktu_selesai: template.end,
                        mata_pelajaran_id: "istirahat",
                        pengawas_id: null,
                    };
                }
                return {
                    hari: day,
                    waktu_mulai: template.start,
                    waktu_selesai: template.end,
                    mata_pelajaran_id: mapel.id,
                    pengawas_id: pengawas.id,
                };
            });
            newSlots.push(...daySchedule);
        });

        setFormData((prev) => ({ ...prev, jadwal_slots: newSlots }));
        toast.success("Jadwal berhasil diisi secara otomatis!");
    };

    const slotsForActiveDay = jadwalSlots.filter(
        (slot) => slot.hari === activeDay
    );
    const canDelete = slotsForActiveDay.length > 1;

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
            <div className="border-b border-gray-200">
                <nav
                    className="-mb-px flex space-x-2 md:space-x-6 overflow-x-auto"
                    aria-label="Tabs"
                >
                    {dynamicDays.map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
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
                {slotsForActiveDay.map((slot) => {
                    const originalIndex = jadwalSlots.findIndex(
                        (s) => s === slot
                    );
                    return (
                        <div
                            key={originalIndex}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
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
