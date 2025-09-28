import React from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import CardContent from "@/Components/ui/card-content";
import { ArrowLeft, ClipboardCheck, ClipboardList } from "lucide-react";
import Button from "@/Components/ui/button";

const assessmentTypes = [
    {
        value: "asts",
        label: "ASTS",
        description: "Asesmen Sumatif Tengah Semester",
        IconComponent: ClipboardList,
    },
    {
        value: "asas",
        label: "ASAS",
        description: "Asesmen Sumatif Akhir Semester",
        IconComponent: ClipboardList,
    },
];

const SelectAssessment = () => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const kelas_id = params.get("kelas_id");
    const tahun_ajaran = params.get("tahun_ajaran");
    const semester = params.get("semester");

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
            label: fullClassName ? `${fullClassName} ` : "Memuat...",
            href: route("manajemen-ruangan.class.index", { role }),
        },
        {
            label: `Semester ${semester}`,
            href: route("manajemen-ruangan.semester.index", {
                role,
                kelas_id,
                tahun_ajaran,
                semester,
            }),
        },
        {
            label: "Pilih Asesmen",
            href: null,
        },
    ];

    return (
        <PageContent
            pageTitle="Pilih Jenis Asesmen"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={ClipboardCheck}
                title="Pilih Jenis Asesmen"
                description={`Pilih jenis asesmen untuk semester ${semester} tahun ajaran ${tahun_ajaran}.`}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {assessmentTypes.map((assessment) => (
                    <CardContent
                        key={assessment.value}
                        // href={route("manajemen-ruangan.rooms.index", {
                        //     role,
                        //     kelas_id,
                        //     tahun_ajaran,
                        //     semester,
                        //     type: assessment.value,
                        // })}
                        icon={
                            <assessment.IconComponent className="h-14 w-14" />
                        }
                        title={assessment.label}
                        description={assessment.description}
                    />
                ))}
            </div>

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("manajemen-ruangan.semester.index", {
                        role,
                        kelas_id,
                        tahun_ajaran,
                        semester,
                    })}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
        </PageContent>
    );
};

export default SelectAssessment;
