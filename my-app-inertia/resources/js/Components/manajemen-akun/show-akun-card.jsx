import {
    LockKeyholeOpen,
    Mail,
    PenLine,
    Trash2,
    User,
    Fingerprint,
} from "lucide-react";
import React from "react";
import Button from "../ui/button";

const ShowAkunCard = ({
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
        <div className="grid grid-cols-1 gap-4">
            {users.map((user, index) => (
                <div
                    key={user.id}
                    className="p-4 space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-neutral-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-neutral-600" />
                                    <p className="text-sm font-medium text-neutral-800">
                                        {user.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isSiswa ? (
                                        <Fingerprint className="w-4 h-4 text-neutral-600" />
                                    ) : (
                                        <Mail className="w-4 h-4 text-neutral-600" />
                                    )}
                                    <p className="text-sm font-medium text-neutral-800">
                                        <span className="font-normal">
                                            {isSiswa ? "NIS: " : "Email: "}
                                        </span>
                                        {isSiswa ? user.nis : user.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LockKeyholeOpen className="w-4 h-4 text-neutral-600" />
                                    <p className="text-sm font-medium text-neutral-800">
                                        <span className="font-normal">
                                            Role:{" "}
                                        </span>
                                        {user.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                        <div className="flex justify-end gap-2">
                            {type === "pending" && (
                                <>
                                    <Button
                                        size="md"
                                        variant="danger"
                                        onClick={() => onReject(user.id)}
                                        disabled={isProcessing}
                                    >
                                        Tolak
                                    </Button>
                                    <Button
                                        size="md"
                                        variant="success"
                                        onClick={() => onApprove(user.id)}
                                        disabled={isProcessing}
                                    >
                                        Setujui
                                    </Button>
                                </>
                            )}
                            {type === "approved" && (
                                <>
                                    <Button
                                        size="md"
                                        variant="outline"
                                        onClick={() =>
                                            onOpenResetPasswordModal(user)
                                        }
                                        disabled={isProcessing}
                                        iconLeft={
                                            <PenLine className="h-4 w-4" />
                                        }
                                    />
                                    <Button
                                        size="md"
                                        variant="danger"
                                        onClick={() => onReject(user.id)}
                                        disabled={isProcessing}
                                        iconLeft={
                                            <Trash2 className="h-4 w-4" />
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowAkunCard;
