import { PenLine, Trash2 } from "lucide-react";
import React from "react";
import Button from "@/Components/ui/button";

const SesiUjianTable = ({ sesiUjians, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Ruangan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Waktu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Tipe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Peserta
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {sesiUjians.map((sesi, index) => (
                        <tr
                            key={sesi.id}
                            className="even:bg-slate-50 hover:bg-slate-100"
                        >
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                                {index + 1}.
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-700">
                                {sesi.ruangan?.kode_ruangan || "-"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                {sesi.tanggal_ujian || "-"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {`${sesi.waktu_mulai?.slice(0, 5) || "??"}:${
                                    sesi.waktu_selesai?.slice(0, 5) || "??"
                                }`}
                            </td>{" "}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{`${sesi.semester.toUpperCase()} / ${sesi.jenis_asesmen.toUpperCase()}`}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
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
