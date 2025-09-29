import React from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import CardContent from "@/Components/ui/card-content";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import DotLoader from "@/Components/ui/dot-loader";
import { ArrowLeft, CalendarDays } from "lucide-react";
import DataNotFound from "@/Components/ui/data-not-found";
import Button from "@/Components/ui/button";

const SelectYear = () => {
    const role = new URLSearchParams(window.location.search).get("role");

    const { data: academicYears, error } = useSWR(
        "/api/academic-years/with-classes",
        fetcher
    );

    const isLoading = !academicYears && !error;

    const breadcrumbItems = [
        {
            label: "Pilih Peran",
            href: route("kelola-pengawas.index"),
        },
        { label: `${role}`, href: route("kelola-pengawas.index") },

        {
            label: "Pilih Tahun Ajaran",
            href: null,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center font-medium text-red-600">
                Gagal memuat data tahun ajaran.
            </div>
        );
    }

    return (
        <PageContent
            pageTitle="Pilih Tahun Ajaran"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={CalendarDays}
                title="Pilih Tahun Ajaran"
                description={`Pilih tahun ajaran untuk mengelola ruangan bagi peran ${role}.`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {academicYears && academicYears.length > 0 ? (
                    academicYears.map((year) => (
                        <CardContent
                            key={year.id}
                            href={route("kelola-pengawas.semester.index", {
                                role: role,
                                tahun_ajaran: year.year,
                            })}
                            icon={<CalendarDays className="h-12 w-12" />}
                            title={`Tahun Ajaran ${year.year}`}
                            description="Kelola ruangan ujian untuk tahun ajaran ini."
                        />
                    ))
                ) : (
                    <DataNotFound message="Tidak ditemukan tahun ajaran yang memiliki data kelas." />
                )}
            </div>

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("kelola-pengawas.index")}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
        </PageContent>
    );
};

export default SelectYear;
