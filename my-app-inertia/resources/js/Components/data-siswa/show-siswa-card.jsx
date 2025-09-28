import { PenLine, Trash2, Save, X } from "lucide-react";
import Button from "../ui/button";
import InputField from "../common/input-field";

const ShowSiswaCard = ({
    students,
    editingId,
    editData,
    editErrors,
    handleEditClick,
    handleUpdate,
    handleDelete,
    handleCancelEdit,
    handleInputChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {students.map((student, index) => (
                <div
                    key={student.id}
                    className="p-4 space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-neutral-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-neutral-800">
                                    {student.nama}
                                </p>
                                <p className="text-sm font-medium text-neutral-800">
                                    <span className="font-normal">NIS: </span>
                                    {student.nis}
                                </p>
                                <p className="text-sm font-medium text-neutral-800">
                                    <span className="font-normal">JK: </span>
                                    {student.jenis_kelamin === "L"
                                        ? "Laki-laki"
                                        : "Perempuan"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                        {editingId === student.id ? (
                            <div className="flex flex-col gap-3">
                                <InputField
                                    id={`edit-nama-card-${student.id}`}
                                    key={`nama-card-${student.id}`}
                                    name="nama"
                                    label="Nama Siswa"
                                    type="text"
                                    value={editData.nama}
                                    onChange={handleInputChange}
                                    error={
                                        editErrors?.nama
                                            ? editErrors.nama[0]
                                            : undefined
                                    }
                                />

                                <InputField
                                    id={`edit-nis-card-${student.id}`}
                                    key={`nis-card-${student.id}`}
                                    name="nis"
                                    label="Nomor Induk Siswa"
                                    type="text"
                                    value={editData.nis}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    error={
                                        editErrors?.nis
                                            ? editErrors.nis[0]
                                            : undefined
                                    }
                                />

                                <div>
                                    <span className="text-xs text-neutral-500">
                                        Jenis Kelamin
                                    </span>
                                    <div className="flex items-center space-x-6 mt-1">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                key={`jk-l-card-${student.id}`}
                                                type="radio"
                                                name={`jenis_kelamin_${student.id}`}
                                                value="L"
                                                checked={
                                                    editData.jenis_kelamin ===
                                                    "L"
                                                }
                                                onChange={(e) => {
                                                    const event = {
                                                        target: {
                                                            name: "jenis_kelamin",
                                                            value: e.target
                                                                .value,
                                                        },
                                                    };
                                                    handleInputChange(event);
                                                }}
                                                className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                            />
                                            <span>Laki-laki</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                key={`jk-p-card-${student.id}`}
                                                type="radio"
                                                name={`jenis_kelamin_${student.id}`}
                                                value="P"
                                                checked={
                                                    editData.jenis_kelamin ===
                                                    "P"
                                                }
                                                onChange={(e) => {
                                                    const event = {
                                                        target: {
                                                            name: "jenis_kelamin",
                                                            value: e.target
                                                                .value,
                                                        },
                                                    };
                                                    handleInputChange(event);
                                                }}
                                                className="form-radio h-4 w-4 text-pink-600 border-slate-300 focus:ring-pink-500"
                                            />
                                            <span>Perempuan</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        size="md"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        iconLeft={<X className="w-4 h-4" />}
                                    />
                                    <Button
                                        size="md"
                                        onClick={(e) =>
                                            handleUpdate(e, student.id)
                                        }
                                        iconLeft={<Save className="w-4 h-4" />}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="md"
                                    variant="outline"
                                    onClick={() => handleEditClick(student)}
                                    iconLeft={<PenLine className="w-4 h-4" />}
                                />
                                <Button
                                    size="md"
                                    variant="danger"
                                    onClick={(e) => handleDelete(e, student.id)}
                                    iconLeft={<Trash2 className="w-4 h-4" />}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowSiswaCard;
