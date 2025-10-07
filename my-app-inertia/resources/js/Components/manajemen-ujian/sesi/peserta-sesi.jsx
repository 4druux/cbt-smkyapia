import React, { useState, useMemo, useEffect } from "react";
import Select from "@/Components/common/select";
import { Info } from "lucide-react";
import ShiftClickInfoModal from "./shift-click-info-modal";

const PesertaSesi = ({
    allSiswa,
    selectedIds,
    onFormChange,
    errors,
    kapasitas,
}) => {
    const [filterKelas, setFilterKelas] = useState("");
    const [lastCheckedId, setLastCheckedId] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    useEffect(() => {
        setLastCheckedId(null);
    }, [filterKelas]);

    const kelasOptions = useMemo(() => {
        const optionsMap = new Map();
        allSiswa.forEach((siswa) => {
            if (siswa.kelas && siswa.academic_year) {
                optionsMap.set(siswa.kelas.id, {
                    value: siswa.kelas.id,
                    label: `${siswa.kelas.nama_kelas} ${siswa.kelas.kelompok} || ${siswa.academic_year.year}`,
                });
            }
        });
        return Array.from(optionsMap.values());
    }, [allSiswa]);

    const filteredUsers = useMemo(() => {
        if (filterKelas) {
            return allSiswa.filter((siswa) => siswa.kelas_id == filterKelas);
        }

        const siswaMap = new Map();
        allSiswa.forEach((siswa) => {
            const existing = siswaMap.get(siswa.nis);
            if (!existing || siswa.id > existing.id) {
                siswaMap.set(siswa.nis, siswa);
            }
        });
        return Array.from(siswaMap.values());
    }, [allSiswa, filterKelas]);

    const handleToggle = (siswaId) => {
        const newIds = selectedIds.includes(siswaId)
            ? selectedIds.filter((id) => id !== siswaId)
            : [...selectedIds, siswaId];
        onFormChange("peserta_ids", newIds);
    };

    const handleCheckboxChange = (siswaId, isChecked) => {
        const isShiftPressed = window.event.shiftKey;

        if (isShiftPressed && lastCheckedId) {
            const userIds = filteredUsers.map((u) => u.id);
            const lastIndex = userIds.indexOf(lastCheckedId);
            const currentIndex = userIds.indexOf(siswaId);

            const start = Math.min(lastIndex, currentIndex);
            const end = Math.max(lastIndex, currentIndex);

            const idsToSelect = userIds.slice(start, end + 1);

            if (isChecked) {
                const newIds = [...new Set([...selectedIds, ...idsToSelect])];
                onFormChange("peserta_ids", newIds);
            } else {
                const newIds = selectedIds.filter(
                    (id) => !idsToSelect.includes(id)
                );
                onFormChange("peserta_ids", newIds);
            }
        } else {
            handleToggle(siswaId);
        }

        setLastCheckedId(siswaId);
    };

    const isAllSelected =
        filteredUsers.length > 0 &&
        filteredUsers.every((user) => selectedIds.includes(user.id));

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        const visibleSiswa = filteredUsers;
        const visibleIds = visibleSiswa.map((siswa) => siswa.id);

        if (isChecked) {
            const visibleNisSet = new Set(visibleSiswa.map((s) => s.nis));

            const otherSelectedIds = selectedIds.filter((id) => {
                const siswa = allSiswa.find((s) => s.id === id);
                return siswa && !visibleNisSet.has(siswa.nis);
            });

            const newIds = [...new Set([...otherSelectedIds, ...visibleIds])];
            onFormChange("peserta_ids", newIds);
        } else {
            const visibleIdsSet = new Set(visibleIds);
            const newIds = selectedIds.filter((id) => !visibleIdsSet.has(id));
            onFormChange("peserta_ids", newIds);
        }
    };

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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 mb-2">
                <h3 className="hidden md:flex text-sm text-gray-700">
                    Semua Daftar Peserta
                </h3>

                <div className="flex flex-row-reverse md:flex items-center gap-2 p-3 md:p-0 justify-between border rounded-lg md:border-none">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
                    />
                    <label className="text-sm text-gray-700">
                        Pilih Semua Peserta
                    </label>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-300 p-2">
                {filteredUsers.map((siswa) => (
                    <label
                        key={siswa.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(siswa.id)}
                            onChange={(e) =>
                                handleCheckboxChange(siswa.id, e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
                        />
                        <div>
                            <p className="text-sm text-gray-700">
                                {siswa.nama} - {siswa.nis}
                            </p>
                            <p className="text-xs text-gray-500">
                                {siswa.kelas?.nama_kelas}{" "}
                                {siswa.kelas?.kelompok} ||
                                {` ${siswa.academic_year?.year}`}
                            </p>
                        </div>
                    </label>
                ))}
            </div>

            <div className="flex items-start justify-between mt-2">
                <div>
                    <p
                        className={`text-sm ${
                            kapasitas > 0 && selectedIds.length > kapasitas
                                ? "text-red-600"
                                : "text-gray-500"
                        }`}
                    >
                        {selectedIds.length} peserta dipilih.
                    </p>

                    <p
                        className={`text-sm ${
                            kapasitas > 0 && selectedIds.length > kapasitas
                                ? "text-red-600"
                                : "text-gray-500"
                        }`}
                    >
                        Kapasitas Ruangan: {kapasitas > 0 ? kapasitas : "-"}
                    </p>

                    {kapasitas > 0 && selectedIds.length > kapasitas && (
                        <p className="text-xs text-red-600 mt-1">
                            *Jumlah peserta melebihi kapasitas yang ditentukan.
                        </p>
                    )}
                </div>

                <div className="hidden lg:block">
                    <p
                        className="text-sm text-indigo-500 hover:text-indigo-700 hover:underline cursor-pointer font-medium flex items-center gap-1"
                        onClick={() => setIsInfoModalOpen(true)}
                    >
                        <Info className="w-4 h-4" />
                        Tips Memilih Cepat
                    </p>
                </div>
            </div>

            {errors?.peserta_ids && (
                <p className="text-xs text-red-500 mt-1">
                    {errors.peserta_ids[0]}
                </p>
            )}

            <ShiftClickInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />
        </div>
    );
};

export default PesertaSesi;
