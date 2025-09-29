import CardContent from "@/Components/ui/card-content";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import { UserCog, Eye, UserLock } from "lucide-react";

const accountTypes = [
    {
        role: "admin",
        title: "Akun Admin",
        IconComponent: UserCog,
        description: "Kelola ruangan ujian untuk akun admin.",
        href: route("kelola-pengawas.year.index", { role: "admin" }),
    },
    {
        role: "pengawas",
        title: "Akun Pengawas",
        IconComponent: Eye,
        description: "Kelola ruangan ujian untuk akun pengawas.",
        href: route("kelola-pengawas.year.index", { role: "pengawas" }),
    },
    {
        role: "siswa",
        title: "Akun Siswa",
        IconComponent: UserLock,
        description: "Kelola ruangan ujian untuk akun siswa.",
        href: route("kelola-pengawas.class.index", { role: "siswa" }),
    },
];

const SelectRole = () => {
    const breadcrumbItems = [
        {
            label: "Pilih Peran",
            href: route("kelola-pengawas.index"),
        },
    ];

    return (
        <PageContent
            pageTitle="Kelola Ruangan Ujian"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={UserLock}
                title="Pilih Peran Pengguna"
                description="Pilih peran yang ingin anda kelola di ruangan ujian."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {accountTypes.map((account) => (
                    <CardContent
                        key={account.role}
                        href={account.href}
                        icon={<account.IconComponent className="h-12 w-12" />}
                        title={account.title}
                        description={account.description}
                    />
                ))}
            </div>
        </PageContent>
    );
};

export default SelectRole;
