import React from "react";
import { Hash, PenLine, SquareUserRound, Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";

const RuanganCard = ({ ruangans, onEdit, onDelete, isProcessing }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {ruangans.map((ruangan, index) => (
                <div
                    key={ruangan.id}
                    className="space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="p-4 flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-gray-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-800">
                                    {ruangan.nama_ruangan}
                                </p>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <Hash className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Kode:{" "}
                                        </span>
                                        {ruangan.kode_ruangan}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <SquareUserRound className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Kapasistas:{" "}
                                        </span>
                                        {ruangan.kapasitas} orang
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 border-t rounded-b-xl border-slate-300 bg-gray-100">
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
