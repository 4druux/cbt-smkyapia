import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import DotLoader from "@/Components/ui/dot-loader";
import DataNotFound from "@/Components/ui/data-not-found";
import { PlusCircle, Warehouse } from "lucide-react";
import { useRuangan } from "@/Hooks/manajemen-ujian/use-ruangan";
import RuanganTable from "@/Components/manajemen-ujian/ruangan/ruangan-table";
import RuanganModal from "@/Components/manajemen-ujian/ruangan/ruangan-modal";
import RuanganCard from "@/Components/manajemen-ujian/ruangan/ruangan-card";

const RuanganPage = () => {
    const {
        ruangans,
        isLoading,
        error,
        isModalOpen,
        isProcessing,
        errors,
        selectedRuangan,
        handleOpenModal,
        handleCloseModal,
        handleSaveRuangan,
        handleDeleteRuangan,
    } = useRuangan();

    const breadcrumbItems = [{ label: "Ruangan Ujian", href: "#" }];

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
            pageTitle="Manajemen Ruangan Ujian"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                <HeaderContent
                    Icon={Warehouse}
                    title="Manajemen Ruangan Ujian"
                    description="Kelola semua ruangan yang tersedia untuk ujian."
                />

                <div className="flex justify-end flex-shrink-0">
                    <Button
                        onClick={() => handleOpenModal()}
                        variant="outline"
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<PlusCircle className="h-5 w-5" />}
                    >
                        Tambah Ruangan
                    </Button>
                </div>
            </div>

            {ruangans && ruangans.length > 0 ? (
                <>
                    <div className="hidden xl:block">
                        <RuanganTable
                            ruangans={ruangans}
                            onEdit={handleOpenModal}
                            onDelete={handleDeleteRuangan}
                        />
                    </div>
                    <div className="xl:hidden">
                        <RuanganCard
                            ruangans={ruangans}
                            onEdit={handleOpenModal}
                            onDelete={handleDeleteRuangan}
                        />
                    </div>
                </>
            ) : (
                <DataNotFound message="Belum ada data ruangan. Silakan tambahkan data baru." />
            )}

            <RuanganModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRuangan}
                isProcessing={isProcessing}
                errors={errors}
                selectedRuangan={selectedRuangan}
            />
        </PageContent>
    );
};

export default RuanganPage;
