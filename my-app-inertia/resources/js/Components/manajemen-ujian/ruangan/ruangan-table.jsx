import React from "react";
import { PenLine, Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";

const RuanganTable = ({ ruangans, onEdit, onDelete, isProcessing }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Kode
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Nama Ruangan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Kapasitas
                        </th>
                        <th className="w-32 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {ruangans.map((ruangan) => (
                        <tr
                            key={ruangan.id}
                            className="even:bg-slate-50 hover:bg-slate-100"
                        >
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-800">
                                {ruangan.kode_ruangan}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                {ruangan.nama_ruangan}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                {ruangan.kapasitas}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(ruangan)}
                                        disabled={isProcessing}
                                        iconLeft={
                                            <PenLine className="w-4 h-4" />
                                        }
                                    />
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onDelete(ruangan.id)}
                                        disabled={isProcessing}
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

export default RuanganTable;
