import React, { useState } from "react";
import Select from "@/Components/common/select";
import { PlusCircle, Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";
import { SelectTimePicker } from "@/Components/common/select-time-picker";

const days = ["senin", "selasa", "rabu", "kamis", "jumat"];

const JadwalSesi = ({
    jadwalSlots,
    setFormData,
    masterMapels,
    masterPengawas,
    errors,
}) => {
    const [activeDay, setActiveDay] = useState("senin");

    const handleSlotChange = (index, field, value) => {
        const updatedSlots = [...jadwalSlots];
        updatedSlots[index][field] = value;

        if (field === "mata_pelajaran_id" && value === "istirahat") {
            updatedSlots[index].pengawas_id = null;
        }

        setFormData((prev) => ({ ...prev, jadwal_slots: updatedSlots }));
    };

    const addSlot = () => {
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
            <h3 className="text-md font-medium text-gray-700">
                Susun Jadwal Mata Pelajaran
            </h3>
            <div className="border-b border-gray-200">
                <nav
                    className="-mb-px flex space-x-2 md:space-x-6"
                    aria-label="Tabs"
                >
                    {days.map((day) => (
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
                                    description="Pilih mata pelajaran yang akan diujikan pada sesi ini"
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
                                        description="Pilih pengawas untuk jadwal ini"
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
