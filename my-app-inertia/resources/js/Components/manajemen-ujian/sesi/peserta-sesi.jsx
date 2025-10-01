import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import Select from "@/Components/common/select";

const PesertaSesi = ({ allUsers, selectedIds, onFormChange, errors }) => {
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
        <div className="rounded-lg border p-3 md:p-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">
                Pilih Peserta Ujian
            </h3>
            <Select
                label="Filter Siswa Berdasarkan Kelas"
                options={kelasOptions}
                title="Pilih Kelas"
                description="Filter siswa berdasarkan kelas. Jika tidak dipilih, semua siswa akan ditampilkan."
                value={filterKelas}
                onChange={(val) => setFilterKelas(val)}
                placeholder="Tampilkan Semua Siswa"
            />

            <h3 className="mt-4 mb-2 text-sm text-gray-500">
                Semua Daftar Peserta
            </h3>
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
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
                        />
                        <div>
                            <p className="text-sm text-gray-700">
                                {user.name} - {user.nis}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user.siswa?.kelas?.nama_kelas}{" "}
                                {user.siswa?.kelas?.kelompok} |
                                {user.siswa?.academic_year &&
                                    ` ${user.siswa.academic_year.year}`}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
                {selectedIds.length} peserta dipilih.
            </p>

            {errors?.peserta_ids && (
                <p className="text-xs text-red-500 mt-1">
                    {errors.peserta_ids[0]}
                </p>
            )}
        </div>
    );
};

export default PesertaSesi;
