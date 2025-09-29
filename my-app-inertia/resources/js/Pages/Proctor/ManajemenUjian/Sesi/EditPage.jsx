import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import { CalendarPlus, ArrowLeft, Loader2, Save } from "lucide-react";
import DotLoader from "@/Components/ui/dot-loader";
import Select from "@/Components/common/select";
import JadwalBuilder from "@/Components/manajemen-ujian/sesi/jadwal-builder";
import PesertaSelector from "@/Components/manajemen-ujian/sesi/peserta-selector";
import { useSesiUjianForm } from "@/Hooks/manajemen-ruangan/use-sesi-ujian-form";

const EditPage = ({ sesiUjian }) => {
    const sesiId = sesiUjian?.id;
    const {
        formData,
        setFormData,
        errors,
        isProcessing,
        masterData,
        isLoading,
        handleFormChange,
        handleSubmit,
    } = useSesiUjianForm(sesiId);

    const breadcrumbItems = [
        { label: "Sesi Ujian", href: route("sesi-ujian.index") },
        { label: "Edit Sesi Ujian", href: null },
    ];

    if (isLoading)
        return (
            <div className="flex h-screen items-center justify-center">
                <DotLoader />
            </div>
        );

    return (
        <PageContent
            pageTitle="Manajemen Sesi Ujian"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={CalendarPlus}
                title="Form Edit Sesi Ujian"
                description="Ubah data di bawah ini untuk memperbarui jadwal sesi ujian."
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                <div className="rounded-lg border p-6">
                    <h3 className="text-lg font-medium mb-4">
                        Informasi Umum Sesi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Ruangan"
                            options={masterData.ruangans.map((r) => ({
                                value: r.id,
                                label: `${r.kode_ruangan} - ${r.nama_ruangan}`,
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
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Semester"
                                options={[
                                    { value: "ganjil", label: "Ganjil" },
                                    { value: "genap", label: "Genap" },
                                ]}
                                value={formData.semester}
                                onChange={(v) =>
                                    handleFormChange("semester", v)
                                }
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
                </div>

                <JadwalBuilder
                    jadwalSlots={formData.jadwal_slots}
                    setFormData={setFormData}
                    masterMapels={masterData.mapels}
                    errors={errors}
                />

                <div className="rounded-lg border p-6">
                    <h3 className="text-lg font-medium mb-4">
                        Pilih Peserta Ujian
                    </h3>
                    <PesertaSelector
                        allUsers={masterData.allUsers}
                        selectedIds={formData.peserta_ids}
                        onFormChange={handleFormChange}
                    />
                    {errors.peserta_ids && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.peserta_ids[0]}
                        </p>
                    )}
                </div>

                <div className="flex justify-end items-center gap-4">
                    <Button
                        as="link"
                        href={route("sesi-ujian.index")}
                        variant="outline"
                        iconLeft={<ArrowLeft className="h-4 w-4" />}
                    >
                        Kembali
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isProcessing}
                        iconLeft={
                            isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )
                        }
                    >
                        {isProcessing ? "Memperbarui..." : "Perbarui"}
                    </Button>
                </div>
            </form>
        </PageContent>
    );
};

export default EditPage;
