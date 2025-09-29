import { PenLine, Trash2 } from "lucide-react";
import React from "react";
import Button from "@/Components/ui/button";

const SesiUjianTable = ({ sesiUjians, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Ruangan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Waktu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Tipe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Peserta
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {sesiUjians.map((sesi) => (
                        <tr key={sesi.id} className="hover:bg-slate-50">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-neutral-800">
                                {sesi.ruangan?.kode_ruangan || "-"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-800">
                                {sesi.tanggal_ujian || "-"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                {`${sesi.waktu_mulai?.slice(0, 5) || "??"}:${
                                    sesi.waktu_selesai?.slice(0, 5) || "??"
                                }`}
                            </td>{" "}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{`${sesi.semester.toUpperCase()} / ${sesi.jenis_asesmen.toUpperCase()}`}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                {sesi.pesertas.length} orang
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        as="link"
                                        size="sm"
                                        variant="outline"
                                        href={route("sesi-ujian.edit", sesi.id)}
                                        iconLeft={
                                            <PenLine className="w-4 h-4" />
                                        }
                                    />

                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onDelete(sesi.id)}
                                        iconLeft={
                                            <Trash2 className="h-4 w-4" />
                                        }
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SesiUjianTable;
