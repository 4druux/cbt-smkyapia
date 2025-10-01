import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import { CalendarPlus, ArrowLeft, Loader2, Save } from "lucide-react";
import DotLoader from "@/Components/ui/dot-loader";
import { useSesiUjianForm } from "@/Hooks/manajemen-ruangan/use-sesi-ujian-form";
import InformasiSesi from "@/Components/manajemen-ujian/sesi/informasi-sesi";
import JadwalSesi from "@/Components/manajemen-ujian/sesi/jadwal-sesi";
import PesertaSesi from "@/Components/manajemen-ujian/sesi/peserta-sesi";

const CreatePage = () => {
    const {
        formData,
        setFormData,
        errors,
        isProcessing,
        masterData,
        isLoading,
        handleFormChange,
        handleSubmit,
    } = useSesiUjianForm();

    const breadcrumbItems = [
        { label: "Sesi Ujian", href: route("sesi-ujian.index") },
        { label: "Buat Sesi Ujian", href: null },
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
                title="Form Sesi Ujian Baru"
                description="Lengkapi semua data di bawah ini untuk membuat jadwal sesi ujian baru."
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                <InformasiSesi
                    formData={formData}
                    masterData={masterData}
                    handleFormChange={handleFormChange}
                    errors={errors}
                />

                <JadwalSesi
                    jadwalSlots={formData.jadwal_slots}
                    setFormData={setFormData}
                    masterMapels={masterData.mapels}
                    errors={errors}
                />

                <PesertaSesi
                    allUsers={masterData.allUsers}
                    selectedIds={formData.peserta_ids}
                    onFormChange={handleFormChange}
                    errors={errors}
                />

                <div className="flex justify-end items-center gap-4">
                    <Button
                        as="link"
                        size="lg"
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
                        {isProcessing ? "Menyimpan..." : "Simpan"}
                    </Button>
                </div>
            </form>
        </PageContent>
    );
};

export default CreatePage;
