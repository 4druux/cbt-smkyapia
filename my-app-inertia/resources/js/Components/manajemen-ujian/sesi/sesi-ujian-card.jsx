import React from "react";
import {
    BookCopy,
    CalendarDays,
    ClipboardCheck,
    GraduationCap,
    PenLine,
    Trash2,
    Users,
} from "lucide-react";
import Button from "@/Components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const SesiUjianCard = ({ sesiUjians, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "d MMM yyyy", { locale: localeId });
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            {sesiUjians.map((sesi, index) => (
                <div
                    key={sesi.id}
                    className="space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="p-4 flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-gray-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-800">
                                    {sesi.ruangan?.nama_ruangan || "-"} (
                                    {sesi.ruangan?.kode_ruangan || "-"})
                                </p>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <Users className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Peserta:{" "}
                                        </span>
                                        {sesi.pesertas.length || "-"} orang
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <ClipboardCheck className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Jenis Asesmen:{" "}
                                        </span>
                                        {sesi.jenis_asesmen.toUpperCase() ||
                                            "-"}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <CalendarDays className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Tanggal Pelaksanaan:{" "}
                                        </span>
                                        {formatDate(sesi.tanggal_mulai) || "-"}-{" "}
                                        {formatDate(sesi.tanggal_selesai) ||
                                            "-"}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <BookCopy className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Semester:{" "}
                                        </span>
                                        {sesi.semester.toUpperCase() || "-"}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <GraduationCap className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Tahun Ajaran:{" "}
                                        </span>
                                        {sesi.academic_year?.year || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 border-t rounded-b-xl border-slate-300 bg-gray-100">
                        <div className="flex justify-end gap-2">
                            <Button
                                as="link"
                                size="md"
                                variant="outline"
                                href={route("sesi-ujian.edit", sesi.id)}
                                iconLeft={<PenLine className="w-4 h-4" />}
                            />
                            <Button
                                size="md"
                                variant="danger"
                                onClick={() => onDelete(sesi.id)}
                                iconLeft={<Trash2 className="h-4 w-4" />}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SesiUjianCard;
