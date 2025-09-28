import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import CardContent from "@/Components/ui/card-content";
import { BookCopy, BookCheck, BookOpen, School, ArrowLeft } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import Button from "@/Components/ui/button";

const semesters = [
    { value: "ganjil", label: "Semester Ganjil", IconComponent: BookCopy },
    { value: "genap", label: "Semester Genap", IconComponent: BookCheck },
];

const SelectSemester = () => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const kelas_id = params.get("kelas_id");
    const tahun_ajaran = params.get("tahun_ajaran");

    const { data: kelasData } = useSWR(
        kelas_id ? `/api/kelas/${kelas_id}?tahun_ajaran=${tahun_ajaran}` : null,
        fetcher
    );

    const fullClassName = kelasData
        ? `${kelasData.nama_kelas} ${kelasData.kelompok} - ${kelasData.jurusan.nama_jurusan}`
        : "";

    const breadcrumbItems = [
        { label: "Pilih Peran", href: route("manajemen-ruangan.role.index") },
        { label: `${role}`, href: route("manajemen-ruangan.role.index") },
        {
            label: fullClassName || "Memuat...",
            href: route("manajemen-ruangan.class.index", { role }),
        },
        {
            label: "Pilih Semester",
            href: null,
        },
    ];

    const studentDetails = [
        { icon: School, label: fullClassName },
        { icon: BookOpen, label: tahun_ajaran },
    ];

    return (
        <PageContent
            pageTitle="Pilih Semester"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={BookCopy}
                title="Pilih Semester"
                details={studentDetails}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {semesters.map((semester) => (
                    <CardContent
                        key={semester.value}
                        href={route("manajemen-ruangan.assessment.index", {
                            role,
                            kelas_id,
                            tahun_ajaran,
                            semester: semester.value,
                        })}
                        icon={<semester.IconComponent className="h-14 w-14" />}
                        title={semester.label}
                        description={`Kelola ruangan ujian untuk semester ${semester.value}.`}
                    />
                ))}
            </div>

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("manajemen-ruangan.class.index", {
                        role,
                        kelas_id,
                        tahun_ajaran,
                    })}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
        </PageContent>
    );
};

export default SelectSemester;
