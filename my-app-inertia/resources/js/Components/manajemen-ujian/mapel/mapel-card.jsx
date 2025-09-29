import Button from "@/Components/ui/button";
import { PenLine, Trash2 } from "lucide-react";

const MapelCard = ({ mapels, onEdit, onDelete, isProcessing }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {mapels.map((mapel, index) => (
                <div
                    key={mapel.id}
                    className="p-4 space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-neutral-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-neutral-800">
                                    <span className="font-normal">
                                        Mata Pelajaran:{" "}
                                    </span>
                                    {mapel.nama_mapel}
                                </p>
                                <p className="text-sm font-medium text-neutral-800">
                                    <span className="font-normal">Kode: </span>
                                    {mapel.kode_mapel}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(mapel)}
                                disabled={isProcessing}
                                iconLeft={<PenLine className="w-4 h-4" />}
                            />
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => onDelete(mapel.id)}
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

export default MapelCard;