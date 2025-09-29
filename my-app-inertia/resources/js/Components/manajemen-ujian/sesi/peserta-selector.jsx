import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import Select from "@/Components/common/select";

const PesertaSelector = ({ allUsers, selectedIds, onFormChange }) => {
    const { data: allKelas } = useSWR("/api/kelas", fetcher);
    const [filterKelas, setFilterKelas] = useState("");

    const filteredUsers = useMemo(() => {
        if (!filterKelas) return allUsers;

        return allUsers.filter((user) => user.siswa?.kelas_id == filterKelas);
    }, [allUsers, filterKelas]);

    const handleToggle = (userId) => {
        const newIds = selectedIds.includes(userId)
            ? selectedIds.filter((id) => id !== userId)
            : [...selectedIds, userId];
        onFormChange("peserta_ids", newIds);
    };

    const kelasOptions =
        allKelas?.map((k) => ({
            value: k.kelas_id,
            label: `${k.nama_kelas} ${k.kelompok} (${k.tahun_ajaran})`,
        })) || [];

    return (
        <div className="space-y-4">
            <Select
                label="Filter Siswa Berdasarkan Kelas"
                options={kelasOptions}
                value={filterKelas}
                onChange={(val) => setFilterKelas(val)}
                placeholder="Tampilkan Semua Siswa"
            />
            <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-300 p-2">
                {filteredUsers.map((user) => (
                    <label
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(user.id)}
                            onChange={() => handleToggle(user.id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                            <p className="font-medium text-neutral-800">
                                {user.name}
                            </p>
                            <p className="text-sm text-neutral-500">
                                {user.role === "siswa" ? user.nis : user.email}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
            <p className="text-sm text-neutral-600">
                {selectedIds.length} peserta dipilih.
            </p>
        </div>
    );
};

export default PesertaSelector;
