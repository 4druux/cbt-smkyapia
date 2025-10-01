import PageContent from "@/Components/ui/page-content";

const HomePage = () => {
    const breadcrumbItems = [{ label: "Beranda", href: route("home") }];

    return (
        <>
            <PageContent
                pageTitle="Beranda"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <h1 className="text-md md:text-lg font-medium text-gray-700 mb-4 md:mb-6">
                    Selamat Datang
                </h1>
            </PageContent>
        </>
    );
};

export default HomePage;
