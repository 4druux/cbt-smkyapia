import React from "react";
import { LockKeyholeOpen, PenLine, Trash2, User } from "lucide-react";
import Button from "@/Components/ui/button";

const PengawasCard = ({ pengawas, onEdit, onDelete, isProcessing }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {pengawas.map((p, index) => (
                <div
                    key={p.id}
                    className="p-4 space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="flex-shrink-0 text-sm font-medium text-gray-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <p className="text-sm font-medium text-gray-800">
                                        {p.name}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <LockKeyholeOpen className="w-4 h-4 text-gray-600" />
                                    <p className="text-sm font-medium text-gray-800">
                                        <span className="font-normal">
                                            Role:{" "}
                                        </span>
                                        {p.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                        <div className="flex justify-end gap-2">
                            <Button
                                size="md"
                                variant="outline"
                                onClick={() => onEdit(p)}
                                disabled={isProcessing}
                                iconLeft={<PenLine className="w-4 h-4" />}
                            />

                            <Button
                                size="md"
                                variant="danger"
                                onClick={() => onDelete(p.id)}
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

export default PengawasCard;
