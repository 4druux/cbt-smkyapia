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
            {users.map((user) => (
                <div
                    key={user.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-300 p-4"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <p className="text-sm font-medium text-neutral-700">
                                {user.name}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {isSiswa ? (
                                <Fingerprint className="h-5 w-5" />
                            ) : (
                                <Mail className="h-5 w-5" />
                            )}
                            <p className="text-sm font-medium text-neutral-700">
                                {isSiswa ? user.nis : user.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <LockKeyholeOpen className="h-5 w-5" />
                            <p className="text-sm font-medium text-neutral-700">
                                {user.role}
                            </p>
                        </div>
                    </div>

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
                                    iconLeft={<PenLine className="h-4 w-4" />}
                                />
                                <Button
                                    size="md"
                                    variant="danger"
                                    onClick={() => onReject(user.id)}
                                    disabled={isProcessing}
                                    iconLeft={<Trash2 className="h-4 w-4" />}
                                />
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowAkunCard;
