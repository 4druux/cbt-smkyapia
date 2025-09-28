import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import {
    fetcher,
    createJurusan,
    deleteJurusan,
    createKelas,
    deleteKelas,
    createAcademicYear,
    deleteAcademicYear,
    createSiswa,
} from "@/Utils/api/index";
import useSWR from "swr";

const useInputSiswaForm = () => {
    const [formData, setFormData] = useState({
        tahun_ajaran: "",
        jurusan_id: "",
        kelas_id: "",
        new_kelas: null,
        students: [{ id: Date.now(), nis: "", nama: "", jenis_kelamin: "" }],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);
    const fileInputRef = useRef(null);
    const [importError, setImportError] = useState("");

    const jurusanSwrKey = "/api/jurusan";
    const {
        data: allJurusans,
        isLoading: isLoadingJurusans,
        mutate: mutateJurusans,
    } = useSWR(jurusanSwrKey, fetcher);

    const kelasSwrKey = formData.jurusan_id
        ? `/api/jurusan/${formData.jurusan_id}/kelas`
        : null;
    const {
        data: kelasOptions,
        isLoading: isLoadingKelas,
        mutate: mutateKelas,
    } = useSWR(kelasSwrKey, fetcher);

    const academicYearSwrKey = "/api/academic-years";
    const {
        data: academicYears,
        isLoading: isLoadingAcademicYears,
        mutate: mutateAcademicYears,
    } = useSWR(academicYearSwrKey, fetcher);

    const handleFormChange = (name, value) => {
        setFormData((prev) => {
            const newState = { ...prev, [name]: value };
            if (name === "jurusan_id") {
                newState.kelas_id = "";
                newState.new_kelas = null;
            }
            return newState;
        });

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleStudentChange = (index, field, value) => {
        const updatedStudents = [...formData.students];
        updatedStudents[index][field] = value;
        setFormData((prev) => ({ ...prev, students: updatedStudents }));

        if (errors.students) {
            setErrors((prev) => ({ ...prev, students: null }));
        }
    };

    const addStudentRow = () => {
        setFormData((prev) => ({
            ...prev,
            students: [
                ...prev.students,
                { id: Date.now(), nis: "", nama: "", jenis_kelamin: "" },
            ],
        }));
    };

    const removeStudentRow = (id) => {
        if (formData.students.length <= 1) {
            toast.error("Minimal harus ada satu baris siswa.");
            return;
        }
        const updatedStudents = formData.students.filter(
            (student) => student.id !== id
        );
        setFormData((prev) => ({ ...prev, students: updatedStudents }));
    };

    const handleCreateJurusan = async (namaJurusan) => {
        setIsProcessing(true);
        try {
            const result = await createJurusan({ nama_jurusan: namaJurusan });
            toast.success(result.message);
            const newJurusan = result.jurusan;
            await mutateJurusans();
            handleFormChange("jurusan_id", newJurusan.id);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menambahkan jurusan."
            );
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteJurusan = async (jurusanId) => {
        if (confirm("Yakin ingin menghapus jurusan ini?")) {
            setIsProcessing(true);
            try {
                const result = await deleteJurusan(jurusanId);
                toast.success(result.message);
                if (formData.jurusan_id === jurusanId) {
                    handleFormChange("jurusan_id", "");
                }
                mutateJurusans();
            } catch (error) {
                toast.error("Gagal menghapus jurusan."), error;
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleCreateKelas = async (namaLengkapKelas) => {
        const parts = namaLengkapKelas.split(" ");
        const nama_kelas = parts[0];
        const kelompok = parts.slice(1).join(" ");

        if (!nama_kelas || !kelompok || !formData.jurusan_id) {
            toast.error(
                "Pilih jurusan terlebih dahulu dan gunakan format seperti 'X A' atau 'XII RPL 1'."
            );
            throw new Error("Invalid format or missing jurusan_id");
        }

        setIsProcessing(true);
        try {
            const result = await createKelas({
                nama_kelas,
                kelompok,
                jurusan_id: formData.jurusan_id,
            });
            toast.success(result.message);
            const newKelas = result.kelas;
            await mutateKelas();
            handleFormChange("kelas_id", newKelas.id);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menambahkan kelas."
            );
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteKelas = async (kelasId) => {
        if (confirm("Yakin ingin menghapus kelas ini?")) {
            setIsProcessing(true);
            try {
                const result = await deleteKelas(kelasId);
                toast.success(result.message);
                if (formData.kelas_id === kelasId) {
                    handleFormChange("kelas_id", "");
                }
                mutateKelas();
            } catch (error) {
                toast.error("Gagal menghapus kelas."), error;
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleCreateAcademicYear = async (newYear) => {
        setIsProcessing(true);
        try {
            const result = await createAcademicYear({ year: newYear });
            toast.success(result.message);
            const newAcademicYear = result.academic_year;
            await mutateAcademicYears();
            handleFormChange("tahun_ajaran", newAcademicYear.year);
        } catch (error) {
            toast.error(error.message || "Gagal menambahkan tahun ajaran.");
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteAcademicYear = async (year) => {
        if (
            confirm(
                "Yakin ingin menghapus tahun ajaran ini? Tindakan ini tidak dapat diurungkan."
            )
        ) {
            setIsProcessing(true);
            try {
                const result = await deleteAcademicYear(year);
                toast.success(result.message);
                if (formData.tahun_ajaran === year) {
                    handleFormChange("tahun_ajaran", "");
                }
                mutateAcademicYears();
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Gagal menghapus tahun ajaran."
                );
                throw error;
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleImportClick = () => {
        setImportError("");
        fileInputRef.current.click();
    };

    const processImportedData = (importedData) => {
        const newStudents = importedData
            .map((row, index) => {
                const jkValue = (
                    row["JENIS KELAMIN"] ||
                    row["Jenis Kelamin"] ||
                    row["jenis kelamin"] ||
                    row["JK"] ||
                    row["jk"] ||
                    ""
                )
                    .toString()
                    .trim()
                    .toUpperCase();

                let jenis_kelamin = "";
                if (jkValue === "L" || jkValue === "LAKI-LAKI") {
                    jenis_kelamin = "L";
                } else if (jkValue === "P" || jkValue === "PEREMPUAN") {
                    jenis_kelamin = "P";
                }

                return {
                    id: Date.now() + index,
                    nama: (
                        row["NAMA SISWA"] ||
                        row["Nama Siswa"] ||
                        row["nama"] ||
                        ""
                    )
                        .toString()
                        .trim()
                        .toUpperCase(),
                    nis: (
                        row["NOMOR INDUK"] ||
                        row["Nomor Induk"] ||
                        row["nis"] ||
                        ""
                    )
                        .toString()
                        .trim(),
                    jenis_kelamin: jenis_kelamin,
                };
            })
            .filter((s) => s.nis && s.nama)
            .sort((a, b) => a.nama.localeCompare(b.nama));

        if (newStudents.length > 0) {
            toast.success(`${newStudents.length} data siswa berhasil diimpor.`);
            setFormData((prev) => ({ ...prev, students: newStudents }));
        } else {
            setImportError(
                "Gagal memuat data. Pastikan file memiliki kolom 'NAMA SISWA', 'NOMOR INDUK', dan 'JENIS KELAMIN'."
            );
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (fileExtension === "csv") {
            reader.onload = (e) => {
                if (window.Papa) {
                    const { data: jsonData } = window.Papa.parse(
                        e.target.result,
                        { header: true, skipEmptyLines: true }
                    );
                    processImportedData(jsonData);
                } else {
                    setImportError(
                        "Library PapaParse untuk CSV tidak ditemukan."
                    );
                }
            };
            reader.readAsText(file);
        } else if (fileExtension === "xlsx" || fileExtension === "xls") {
            if (typeof window.XLSX === "undefined") {
                setImportError(
                    "Library untuk membaca file Excel (SheetJS) tidak termuat."
                );
                return;
            }
            reader.onload = (e) => {
                try {
                    const workbook = window.XLSX.read(e.target.result, {
                        type: "binary",
                    });
                    const sheetName = workbook.SheetNames[0];
                    const jsonData = window.XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheetName]
                    );
                    processImportedData(jsonData);
                } catch (err) {
                    setImportError(
                        "Gagal memproses file Excel. Pastikan formatnya benar."
                    ),
                        err;
                }
            };
            reader.readAsBinaryString(file);
        } else {
            setImportError(
                "Format file tidak didukung. Gunakan .csv, .xlsx, atau .xls."
            );
        }
        event.target.value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrors({});

        if (!formData.jurusan_id) {
            setErrors({ jurusan_id: ["Jurusan wajib diisi."] });
            toast.error("Jurusan wajib diisi.");
            setIsProcessing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.kelas_id) {
            setErrors({ kelas_id: ["Kelas wajib diisi."] });
            toast.error("Kelas wajib diisi.");
            setIsProcessing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.tahun_ajaran) {
            setErrors({ tahun_ajaran: ["Tahun ajaran wajib diisi."] });
            toast.error("Tahun ajaran wajib diisi.");
            setIsProcessing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const validStudents = formData.students.filter(
            (s) => s.nama && s.nis && s.jenis_kelamin
        );

        if (validStudents.length === 0) {
            setErrors({ students: ["Daftar siswa tidak boleh kosong."] });
            toast.error("Daftar siswa tidak boleh kosong.");
            setIsProcessing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const payload = {
            kelas_id: formData.kelas_id,
            students: validStudents,
            tahun_ajaran: formData.tahun_ajaran,
        };

        try {
            const response = await createSiswa(payload);
            toast.success(response.message);
            setFormData({
                tahun_ajaran: "",
                jurusan_id: "",
                kelas_id: "",
                students: [
                    { id: Date.now(), nis: "", nama: "", jenis_kelamin: "" },
                ],
            });
            router.visit(route("data-siswa.index"));
        } catch (error) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (
                error.response &&
                (error.response.status === 422 || error.response.status === 409)
            ) {
                toast.error(
                    error.response.data.message ||
                        "Harap periksa kembali data Anda."
                );
                setErrors(error.response.data.errors || {});
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Terjadi kesalahan saat menyimpan data."
                );
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const academicYearOptions =
        academicYears?.map((ay) => ({ value: ay.year, label: ay.year })) || [];

    return {
        data: formData,
        isSubmitting: isProcessing,
        errors,
        formRef,
        fileInputRef,
        importError,
        allJurusans,
        isLoadingJurusans,
        kelasOptions,
        isLoadingKelas,
        academicYearOptions,
        isLoadingAcademicYears,
        handleFormChange,
        handleStudentChange,
        addStudentRow,
        removeStudentRow,
        handleSubmit,
        handleCreateJurusan,
        handleDeleteJurusan,
        handleCreateKelas,
        handleDeleteKelas,
        handleCreateAcademicYear,
        handleDeleteAcademicYear,
        handleImportClick,
        handleFileChange,
    };
};

export default useInputSiswaForm;
