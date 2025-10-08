import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import { CalendarPlus, ArrowLeft, Loader2, Save } from "lucide-react";
import DotLoader from "@/Components/ui/dot-loader";
import { useSesiUjianForm } from "@/Hooks/manajemen-ujian/use-sesi-ujian-form";
import InformasiSesi from "@/Components/manajemen-ujian/sesi/informasi-sesi";
import JadwalSesi from "@/Components/manajemen-ujian/sesi/jadwal-sesi";
import PesertaSesi from "@/Components/manajemen-ujian/sesi/peserta-sesi";

const EditPage = ({ sesiUjian: sesiUjianId }) => {
    const [initialData, setInitialData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        axios
            .get(`/api/sesi-ujian/${sesiUjianId}`)
            .then((response) => {
                setInitialData(response.data);
            })
            .catch((error) => {
                console.error("Gagal mengambil data sesi ujian!", error);
            })
            .finally(() => {
                setIsLoadingData(false);
            });
    }, [sesiUjianId]);

    const {
        formData,
        setFormData,
        errors,
        isProcessing,
        masterData,
        isLoading: isLoadingMasterData,
        handleFormChange,
        handleSubmit,
    } = useSesiUjianForm(initialData);

    const selectedRuangan = masterData.ruangans.find(
        (r) => r.id === formData.ruangan_id
    );
    const kapasitasRuangan = selectedRuangan ? selectedRuangan.kapasitas : 0;

    const uniqueClasses = useMemo(() => {
        if (!formData.peserta_ids || !masterData.allSiswa) {
            return [];
        }

        const selectedSiswa = masterData.allSiswa.filter((siswa) =>
            formData.peserta_ids.includes(siswa.id)
        );

        const kelasMap = new Map();
        selectedSiswa.forEach((siswa) => {
            if (siswa.kelas && !kelasMap.has(siswa.kelas.id)) {
                kelasMap.set(siswa.kelas.id, {
                    kelas: siswa.kelas,
                    academic_year: siswa.academic_year,
                });
            }
        });

        return Array.from(kelasMap.values());
    }, [formData.peserta_ids, masterData.allSiswa]);

    const isPageLoading = isLoadingData || isLoadingMasterData;

    const breadcrumbItems = [
        { label: "Sesi Ujian", href: route("sesi-ujian.index") },
        { label: "Edit Sesi Ujian", href: null },
    ];

    if (isPageLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <DotLoader />
            </div>
        );
    }

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
                <InformasiSesi
                    formData={formData}
                    masterData={masterData}
                    handleFormChange={handleFormChange}
                    errors={errors}
                />

                <PesertaSesi
                    allSiswa={masterData.allSiswa}
                    selectedIds={formData.peserta_ids}
                    onFormChange={handleFormChange}
                    kapasitas={kapasitasRuangan}
                    errors={errors}
                />

                <JadwalSesi
                    jadwalSlots={formData.jadwal_slots}
                    setFormData={setFormData}
                    masterMapels={masterData.mapels}
                    masterPengawas={masterData.pengawas}
                    uniqueClasses={uniqueClasses}
                    errors={errors}
                />

                <div className="flex items-center justify-end gap-4">
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
