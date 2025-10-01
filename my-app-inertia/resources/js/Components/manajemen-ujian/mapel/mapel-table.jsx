import React from "react";
import { PenLine, Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";

const MapelTable = ({ mapels, onEdit, onDelete, isProcessing }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Kode Mapel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Nama Mata Pelajaran
                        </th>
                        <th className="w-32 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {mapels.map((mapel, index) => (
                        <tr
                            key={mapel.id}
                            className="even:bg-slate-50 hover:bg-slate-100"
                        >
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                                {index + 1}.
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-700">
                                {mapel.kode_mapel}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {mapel.nama_mapel}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(mapel)}
                                        disabled={isProcessing}
                                        iconLeft={
                                            <PenLine className="w-4 h-4" />
                                        }
                                    />
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onDelete(mapel.id)}
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

export default MapelTable;
