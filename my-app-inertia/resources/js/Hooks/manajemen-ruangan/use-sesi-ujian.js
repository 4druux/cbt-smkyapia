import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import toast from "react-hot-toast";
import axios from "axios";

export const useSesiUjian = () => {
    const {
        data: sesiUjians,
        error,
        mutate,
    } = useSWR("/api/sesi-ujian", fetcher);

    const handleDelete = async (sesiId) => {
        if (!confirm("Yakin ingin menghapus sesi ujian ini?")) return;
        try {
            const response = await axios.delete(`/api/sesi-ujian/${sesiId}`);
            toast.success(response.data.message);
            mutate();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menghapus sesi."
            );
        }
    };

    return {
        sesiUjians,
        isLoading: !sesiUjians && !error,
        error,
        handleDelete,
    };
};
