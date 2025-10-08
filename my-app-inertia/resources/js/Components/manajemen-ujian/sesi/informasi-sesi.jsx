import React from "react";
import Select from "@/Components/common/select";
import SelectDateRange from "@/Components/common/select-date-range";

const InformasiSesi = ({ formData, masterData, handleFormChange, errors }) => {
    return (
        <div className="rounded-lg border p-3 md:p-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">
                Informasi Sesi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Ruangan Ujian"
                    title="Pilih Ruangan Ujian"
                    description="Pilih satu ruangan yang akan digunakan untuk sesi ujian ini."
                    options={masterData.ruangans.map((r) => ({
                        value: r.id,
                        label: `${r.nama_ruangan} (${r.kode_ruangan} || Kapasitas ${r.kapasitas})`,
                    }))}
                    value={formData.ruangan_id}
                    onChange={(v) => handleFormChange("ruangan_id", v)}
                    error={errors.ruangan_id?.[0]}
                />

                <Select
                    label="Jenis Asesmen"
                    title="Pilih Jenis Asesmen"
                    description="Pilih jenis asesmen yang akan digunakan untuk sesi ujian ini."
                    options={[
                        { value: "asts", label: "ASTS" },
                        { value: "asas", label: "ASAS" },
                    ]}
                    value={formData.jenis_asesmen}
                    onChange={(v) => handleFormChange("jenis_asesmen", v)}
                    error={errors.jenis_asesmen?.[0]}
                />

                <SelectDateRange
                    label="Rentang Tanggal Ujian"
                    description="Pilih tanggal mulai dan selesai ujian."
                    value={formData.date_range}
                    onChange={(v) =>
                        handleFormChange(
                            "date_range",
                            v || { from: undefined, to: undefined }
                        )
                    }
                    error={errors.date_range?.[0]}
                />

                <Select
                    label="Semester"
                    title="Pilih Semester"
                    description="Pilih semester yang akan digunakan untuk sesi ujian ini."
                    options={[
                        { value: "ganjil", label: "Ganjil" },
                        { value: "genap", label: "Genap" },
                    ]}
                    value={formData.semester}
                    onChange={(v) => handleFormChange("semester", v)}
                    error={errors.semester?.[0]}
                />

                <Select
                    label="Tahun Ajaran"
                    title="Pilih Tahun Ajaran"
                    description="Pilih tahun ajaran yang akan digunakan untuk sesi ujian ini."
                    options={masterData.academicYears.map((ay) => ({
                        value: ay.id,
                        label: ay.year,
                    }))}
                    value={formData.academic_year_id}
                    onChange={(v) => handleFormChange("academic_year_id", v)}
                    error={errors.academic_year_id?.[0]}
                />
            </div>
        </div>
    );
};

export default InformasiSesi;
