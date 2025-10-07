import React from "react";
import { PlusCircle, UserCheck } from "lucide-react";
import { usePengawas } from "@/Hooks/manajemen-ujian/use-pengawas";
import DotLoader from "@/Components/ui/dot-loader";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import PengawasTable from "@/Components/manajemen-ujian/pengawas/pengawas-table";
import PengawasCard from "@/Components/manajemen-ujian/pengawas/pengawas-card";
import DataNotFound from "@/Components/ui/data-not-found";
import PengawasModal from "@/Components/manajemen-ujian/pengawas/modal-pengawas";

const PengawasPage = () => {
    const {
        pengawas,
        isLoading,
        error,
        isModalOpen,
        isProcessing,
        errors,
        selectedPengawas,
        handleOpenModal,
        handleCloseModal,
        handleSavePengawas,
        handleDeletePengawas,
    } = usePengawas();

    const breadcrumbItems = [{ label: "Pengawas", href: "#" }];

    if (isLoading)
        return (
            <div className="flex h-screen items-center justify-center">
                <DotLoader />
            </div>
        );
    if (error)
        return (
            <div className="flex h-screen items-center justify-center">
                Error memuat data. Silakan coba lagi nanti.
            </div>
        );

    return (
        <PageContent
            pageTitle="Manajemen Pengawas"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                <HeaderContent
                    Icon={UserCheck}
                    title="Manajemen Pengawas"
                    description="Kelola semua data pengawas yang tersedia untuk ujian."
                />
                <div className="flex justify-end flex-shrink-0">
                    <Button
                        onClick={() => handleOpenModal()}
                        variant="outline"
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<PlusCircle className="h-5 w-5" />}
                    >
                        Tambah Pengawas
                    </Button>
                </div>
            </div>

            {pengawas && pengawas.length > 0 ? (
                <>
                    <div className="hidden xl:block">
                        <PengawasTable
                            pengawas={pengawas}
                            onEdit={handleOpenModal}
                            onDelete={handleDeletePengawas}
                            isProcessing={isProcessing}
                        />
                    </div>
                    <div className="xl:hidden">
                        <PengawasCard
                            pengawas={pengawas}
                            onEdit={handleOpenModal}
                            onDelete={handleDeletePengawas}
                            isProcessing={isProcessing}
                        />
                    </div>
                </>
            ) : (
                <DataNotFound message="Belum ada data pengawas. Silakan tambahkan data baru." />
            )}

            <PengawasModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePengawas}
                isProcessing={isProcessing}
                errors={errors}
                selectedPengawas={selectedPengawas}
            />
        </PageContent>
    );
};

export default PengawasPage;
