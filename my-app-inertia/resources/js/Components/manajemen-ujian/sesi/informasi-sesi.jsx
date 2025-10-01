import React from "react";
import Select from "@/Components/common/select";

const InformasiSesi = ({ formData, masterData, handleFormChange, errors }) => {
    return (
        <div className="rounded-lg border p-3 md:p-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">
                Informasi Sesi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                    label="Ruangan"
                    options={masterData.ruangans.map((r) => ({
                        value: r.id,
                        label: `(${r.kode_ruangan}) - ${r.nama_ruangan}`,
                    }))}
                    value={formData.ruangan_id}
                    onChange={(v) => handleFormChange("ruangan_id", v)}
                    error={errors.ruangan_id?.[0]}
                />
                <Select
                    label="Tahun Ajaran"
                    options={masterData.academicYears.map((ay) => ({
                        value: ay.id,
                        label: ay.year,
                    }))}
                    value={formData.academic_year_id}
                    onChange={(v) =>
                        handleFormChange("academic_year_id", v)
                    }
                    error={errors.academic_year_id?.[0]}
                />
                <Select
                    label="Semester"
                    options={[
                        { value: "ganjil", label: "Ganjil" },
                        { value: "genap", label: "Genap" },
                    ]}
                    value={formData.semester}
                    onChange={(v) => handleFormChange("semester", v)}
                    error={errors.semester?.[0]}
                />
                <Select
                    label="Jenis Asesmen"
                    options={[
                        { value: "asts", label: "ASTS" },
                        { value: "asas", label: "ASAS" },
                    ]}
                    value={formData.jenis_asesmen}
                    onChange={(v) =>
                        handleFormChange("jenis_asesmen", v)
                    }
                    error={errors.jenis_asesmen?.[0]}
                />
            </div>
        </div>
    );
};

export default InformasiSesi;