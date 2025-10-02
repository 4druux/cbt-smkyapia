import React from "react";
import { PenLine, Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";

const RuanganCard = ({ ruangans, onEdit, onDelete, isProcessing }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {ruangans.map((ruangan, index) => (
                <div
                    key={ruangan.id}
                    className="p-4 space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-gray-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-800">
                                    {ruangan.nama_ruangan}
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                    <span className="font-normal">Kode: </span>
                                    {ruangan.kode_ruangan}
                                </p>
                                <p className="text-sm font-medium text-gray-800">
                                    <span className="font-normal">
                                        Kapasitas:{" "}
                                    </span>
                                    {ruangan.kapasitas} orang
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                        <div className="flex justify-end gap-2">
                            <Button
                               size="md"
                                variant="outline"
                                onClick={() => onEdit(ruangan)}
                                disabled={isProcessing}
                                iconLeft={<PenLine className="w-4 h-4" />}
                            />
                            <Button
                               size="md"
                                variant="danger"
                                onClick={() => onDelete(ruangan.id)}
                                disabled={isProcessing}
                                iconLeft={<Trash2 className="h-4 w-4" />}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RuanganCard;
