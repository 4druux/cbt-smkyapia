import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import DotLoader from "@/Components/ui/dot-loader";
import DataNotFound from "@/Components/ui/data-not-found";
import { PlusCircle, BookCopy } from "lucide-react";
import { useMapel } from "@/Hooks/manajemen-ujian/use-mapel";
import MapelModal from "@/Components/manajemen-ujian/mapel/mapel-modal";
import MapelTable from "@/Components/manajemen-ujian/mapel/mapel-table";
import MapelCard from "@/Components/manajemen-ujian/mapel/mapel-card";

const SoalPage = () => {
    const {
        mapels,
        isLoading,
        error,
        isModalOpen,
        isProcessing,
        errors,
        selectedMapel,
        handleOpenModal,
        handleCloseModal,
        handleSaveMapel,
        handleDeleteMapel,
    } = useMapel();

    const breadcrumbItems = [{ label: "Mata Pelajaran", href: "#" }];

    if (isLoading)
        return (
            <div className="flex h-screen items-center justify-center">
                <DotLoader />
            </div>
        );
    if (error)
        return (
            <div className="flex h-screen items-center justify-center">
                Error memuat data.
            </div>
        );

    return (
        <PageContent
            pageTitle="Manajemen Soal Ujian"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                <HeaderContent
                    Icon={BookCopy}
                    title="Manajemen Soal Ujian"
                    description="Kelola semua soal ujian untuk mata pelajaran yang tersedia."
                />

                <div className="flex justify-end flex-shrink-0">
                    <Button
                        onClick={() => handleOpenModal()}
                        variant="outline"
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<PlusCircle className="h-5 w-5" />}
                    >
                        Input Data Baru
                    </Button>
                </div>
            </div>

            {mapels && mapels.length > 0 ? (
                <>
                    <div className="hidden xl:block">
                        <MapelTable
                            mapels={mapels}
                            onEdit={handleOpenModal}
                            onDelete={handleDeleteMapel}
                        />
                    </div>

                    <div className="xl:hidden">
                        <MapelCard
                            mapels={mapels}
                            onEdit={handleOpenModal}
                            onDelete={handleDeleteMapel}
                        />
                    </div>
                </>
            ) : (
                <DataNotFound message="Belum ada data mata pelajaran. Silakan tambahkan data baru." />
            )}

            <MapelModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveMapel}
                isProcessing={isProcessing}
                errors={errors}
                selectedMapel={selectedMapel}
            />
        </PageContent>
    );
};

export default SoalPage;
