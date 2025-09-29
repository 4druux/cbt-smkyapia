import React, { useState } from "react";
import Select from "@/Components/common/select";
import InputField from "@/Components/common/input-field";
import { PlusCircle, Trash2 } from "lucide-react";
import Button from "../../ui/button";

const days = ["senin", "selasa", "rabu", "kamis", "jumat"];

const JadwalBuilder = ({ jadwalSlots, setFormData, masterMapels, errors }) => {
    const [activeDay, setActiveDay] = useState("senin");

    const mapelOptions = masterMapels.map((m) => ({
        value: m.id,
        label: m.nama_mapel,
    }));
    mapelOptions.unshift({ value: null, label: "-- Istirahat --" });

    const handleSlotChange = (index, field, value) => {
        const updatedSlots = [...jadwalSlots];
        updatedSlots[index][field] = value;
        setFormData((prev) => ({ ...prev, jadwal_slots: updatedSlots }));
    };

    const addSlot = () => {
        const newSlot = {
            hari: activeDay,
            waktu_mulai: "07:30",
            waktu_selesai: "08:30",
            mata_pelajaran_id: null,
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

    return (
        <div className="rounded-lg border p-3 md:p-6">
            <h3 className="text-md md:text-lg font-medium text-neutral-700 mb-2">
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
                            className={`relative whitespace-nowrap py-3 px-1 font-medium text-xs md:text-sm capitalize ${
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
                {jadwalSlots
                    .filter((slot) => slot.hari === activeDay)
                    .map((slot) => {
                        const originalIndex = jadwalSlots.findIndex(
                            (s) => s === slot
                        );
                        return (
                            <>
                                <div
                                    key={originalIndex}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
                                >
                                    <InputField
                                        label="Mulai"
                                        type="time"
                                        value={slot.waktu_mulai}
                                        onChange={(e) =>
                                            handleSlotChange(
                                                originalIndex,
                                                "waktu_mulai",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputField
                                        label="Selesai"
                                        type="time"
                                        value={slot.waktu_selesai}
                                        onChange={(e) =>
                                            handleSlotChange(
                                                originalIndex,
                                                "waktu_selesai",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Select
                                        label="Mapel / Kegiatan"
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
                                </div>
                                <div className="flex justify-end">
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
                                </div>
                            </>
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

export default JadwalBuilder;
