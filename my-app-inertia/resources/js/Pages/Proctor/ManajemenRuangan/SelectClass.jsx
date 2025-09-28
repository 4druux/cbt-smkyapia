import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import DotLoader from "@/Components/ui/dot-loader";
import DataNotFound from "@/Components/ui/data-not-found";
import CardContent from "@/Components/ui/card-content";
import useAllClass from "@/Hooks/data-siswa/use-all-class";
import { School, ClipboardList, ArrowLeft } from "lucide-react";
import Button from "@/Components/ui/button";

const SelectClass = () => {
    const role = new URLSearchParams(window.location.search).get("role");
    const { allKelas, isLoading, error } = useAllClass();

    const breadcrumbItems = [
        { label: "Pilih Peran", href: route("manajemen-ruangan.role.index") },
        { label: `${role}`, href: route("manajemen-ruangan.role.index") },
        {
            label: "Pilih Kelas",
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
                Gagal memuat data kelas.
            </div>
        );
    }

    const groupedByYear = allKelas?.reduce((acc, kelas) => {
        const year = kelas.tahun_ajaran;
        if (!acc[year]) acc[year] = [];
        acc[year].push(kelas);
        return acc;
    }, {});

    const sortedYears = Object.keys(groupedByYear || {})
        .sort()
        .reverse();

    return (
        <PageContent
            pageTitle="Kelola Ruangan Ujian"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={ClipboardList}
                title="Pilih Kelas & Tahun Ajaran"
                description={`Pilih kelas untuk melanjutkan pengelolaan ruangan untuk peran ${role}.`}
            />

            {sortedYears.length > 0 ? (
                <div className="space-y-8">
                    {sortedYears.map((year) => (
                        <section key={year}>
                            <h4 className="mb-4 text-md font-medium text-neutral-600">{`Tahun Ajaran ${year}`}</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {groupedByYear[year].map((kelas) => (
                                    <CardContent
                                        key={kelas.kelas_id}
                                        href={route(
                                            "manajemen-ruangan.semester.index",
                                            {
                                                role: role,
                                                kelas_id: kelas.kelas_id,
                                                tahun_ajaran:
                                                    kelas.tahun_ajaran,
                                            }
                                        )}
                                        icon={<School className="h-14 w-14" />}
                                        title={`${kelas.nama_kelas} ${kelas.kelompok}`}
                                        subtitle={kelas.nama_jurusan}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <DataNotFound
                    title="Data Kelas Kosong"
                    message="Belum ada data kelas di sistem. Silakan tambahkan data siswa terlebih dahulu."
                />
            )}

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("manajemen-ruangan.role.index")}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
        </PageContent>
    );
};

export default SelectClass;
