import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import DotLoader from "@/Components/ui/dot-loader";
import DataNotFound from "@/Components/ui/data-not-found";
import { PlusCircle, CalendarDays } from "lucide-react";
import { useSesiUjian } from "@/Hooks/manajemen-ujian/use-sesi-ujian";
import SesiUjianTable from "@/Components/manajemen-ujian/sesi/sesi-ujian-table";
import SesiUjianCard from "@/Components/manajemen-ujian/sesi/sesi-ujian-card";

const SesiPage = () => {
    const { sesiUjians, isLoading, error, handleDelete } = useSesiUjian();

    const breadcrumbItems = [{ label: "Sesi Ujian", href: "#" }];

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
            pageTitle="Manajemen Sesi Ujian"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                <HeaderContent
                    Icon={CalendarDays}
                    title="Daftar Sesi Ujian"
                    description="Kelola semua sesi ujian yang telah dijadwalkan."
                />
                <div className="flex justify-end flex-shrink-0">
                    <Button
                        as="link"
                        href={route("sesi-ujian.create")}
                        variant="outline"
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<PlusCircle className="h-5 w-5" />}
                    >
                        Input Data Baru
                    </Button>
                </div>
            </div>

            {sesiUjians && sesiUjians.length > 0 ? (
                <>
                    <div className="hidden xl:block">
                        <SesiUjianTable
                            sesiUjians={sesiUjians}
                            onDelete={handleDelete}
                        />
                    </div>

                    <div className="xl:hidden">
                        <SesiUjianCard
                            sesiUjians={sesiUjians}
                            onDelete={handleDelete}
                        />
                    </div>
                </>
            ) : (
                <DataNotFound message="Belum ada sesi ujian yang dibuat. Silakan buat sesi baru." />
            )}
        </PageContent>
    );
};

export default SesiPage;
