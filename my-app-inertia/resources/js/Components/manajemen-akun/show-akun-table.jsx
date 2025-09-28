import { PenLine, Trash2 } from "lucide-react";
import React from "react";
import Button from "../ui/button";

const ShowAkunTable = ({
    users,
    type,
    role,
    onApprove,
    onReject,
    isProcessing,
    onOpenResetPasswordModal,
}) => {
    const isSiswa = role === "siswa";

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            {isSiswa ? "NIS" : "Email"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Role
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {users.map((user, index) => (
                        <tr
                            key={user.id}
                            className="transition-colors duration-150 hover:bg-slate-100 even:bg-slate-50"
                        >
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                                {index + 1}.
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">
                                {user.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                {isSiswa ? user.nis : user.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                                {user.role}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    {type === "pending" && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() =>
                                                    onReject(user.id)
                                                }
                                                disabled={isProcessing}
                                            >
                                                Tolak
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() =>
                                                    onApprove(user.id)
                                                }
                                                disabled={isProcessing}
                                            >
                                                Setujui
                                            </Button>
                                        </>
                                    )}
                                    {type === "approved" && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    onOpenResetPasswordModal(
                                                        user
                                                    )
                                                }
                                                disabled={isProcessing}
                                                iconLeft={
                                                    <PenLine className="h-4 w-4" />
                                                }
                                            />

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() =>
                                                    onReject(user.id)
                                                }
                                                disabled={isProcessing}
                                                iconLeft={
                                                    <Trash2 className="h-4 w-4" />
                                                }
                                            />
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowAkunTable;
