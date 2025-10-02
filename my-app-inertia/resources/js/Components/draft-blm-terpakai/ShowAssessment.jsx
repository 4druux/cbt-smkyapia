// import React from "react";
// import useSWR from "swr";
// import { fetcher } from "@/Utils/api";
// import PageContent from "@/Components/ui/page-content";
// import HeaderContent from "@/Components/ui/header-content";
// import { ArrowLeft, BookOpen, School, Users } from "lucide-react";
// import DotLoader from "@/Components/ui/dot-loader";
// import DataNotFound from "@/Components/ui/data-not-found";
// import ShowAssesmentTable from "@/Components/manajemen-ujian/pengawas/show-assesment-table";
// import ShowAssesmentCard from "@/Components/manajemen-ujian/pengawas/show-assesment-card";
// import Button from "@/Components/ui/button";

// const ShowAssessment = () => {
//     const params = new URLSearchParams(window.location.search);
//     const role = params.get("role");
//     const kelas_id = params.get("kelas_id");
//     const tahun_ajaran = params.get("tahun_ajaran");
//     const semester = params.get("semester");
//     const type = params.get("type");

//     const isSiswaRole = role === "siswa";

//     const swrKey = isSiswaRole
//         ? `/api/kelas/${kelas_id}?tahun_ajaran=${tahun_ajaran}`
//         : `/api/users?role=${role}`;

//     const { data, error } = useSWR(swrKey, fetcher);

//     const users = isSiswaRole ? data?.siswas : data;
//     const isLoading = !data && !error;

//     const fullClassName =
//         isSiswaRole && data
//             ? `${data.nama_kelas} ${data.kelompok} - ${data.jurusan.nama_jurusan}`
//             : "";

//     const breadcrumbItems = [
//         { label: "Pilih Peran", href: route("kelola-pengawas.index") },
//         { label: `${role}`, href: route("kelola-pengawas.index") },
//         ...(isSiswaRole
//             ? [
//                   {
//                       label: fullClassName || "Memuat...",
//                       href: route("kelola-pengawas.class.index", {
//                           role,
//                           kelas_id,
//                           tahun_ajaran,
//                       }),
//                   },
//               ]
//             : [
//                   {
//                       label: `Tahun Ajaran ${tahun_ajaran}`,
//                       href: route("kelola-pengawas.year.index", {
//                           role,
//                           tahun_ajaran,
//                       }),
//                   },
//               ]),
//         {
//             label: `Semester ${semester}`,
//             href: route("kelola-pengawas.semester.index", {
//                 role,
//                 kelas_id,
//                 tahun_ajaran,
//                 semester,
//             }),
//         },
//         {
//             label: type?.toUpperCase(),
//             href: route("kelola-pengawas.assessment.index", {
//                 role,
//                 kelas_id,
//                 tahun_ajaran,
//                 semester,
//             }),
//         },
//         {
//             label: `Daftar ${role}`,
//             href: null,
//         },
//     ];

//     if (isLoading)
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 <DotLoader />
//             </div>
//         );
//     if (error)
//         return (
//             <div className="flex min-h-screen items-center justify-center font-medium text-red-600">
//                 Gagal memuat data.
//             </div>
//         );

//     const studentDetails = [
//         { icon: School, label: fullClassName },
//         { icon: BookOpen, label: tahun_ajaran },
//     ];

//     return (
//         <PageContent
//             pageTitle={`Kelola Ruangan ${role}`}
//             breadcrumbItems={breadcrumbItems}
//             pageClassName="mt-4"
//         >
//             <HeaderContent
//                 Icon={Users}
//                 title={`Kelola Ruangan ${role}`}
//                 details={isSiswaRole ? studentDetails : undefined}
//                 description={
//                     !isSiswaRole
//                         ? `Daftar semua pengguna dengan peran ${role}.`
//                         : undefined
//                 }
//             />

//             {users && users.length > 0 ? (
//                 <>
//                     <div className="hidden lg:block">
//                         <ShowAssesmentTable users={users} role={role} />
//                     </div>
//                     <div className="lg:hidden">
//                         <ShowAssesmentCard users={users} role={role} />
//                     </div>
//                 </>
//             ) : (
//                 <DataNotFound
//                     message={
//                         isSiswaRole
//                             ? "Tidak ada siswa di kelas ini."
//                             : `Tidak ada daftar pengguna dengan peran ${role}.`
//                     }
//                 />
//             )}

//             <div className="mt-6 flex justify-start">
//                 <Button
//                     as="link"
//                     size="lg"
//                     variant="outline"
//                     href={route("kelola-pengawas.assessment.index", {
//                         role,
//                         kelas_id,
//                         tahun_ajaran,
//                         semester,
//                     })}
//                     iconLeft={<ArrowLeft className="h-5 w-5" />}
//                 >
//                     Kembali
//                 </Button>
//             </div>
//         </PageContent>
//     );
// };

// export default ShowAssessment;
