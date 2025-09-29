import { User, Fingerprint, Mail } from "lucide-react";
import React from "react";

const ShowAssesmentCard = ({ users, role }) => {
    const isSiswaRole = role === "siswa";

    return (
        <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-300 p-4"
                >
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-neutral-600" />
                        <p className="text-sm font-medium text-neutral-800">
                            {user.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSiswaRole ? (
                            <Fingerprint className="h-5 w-5 text-neutral-500" />
                        ) : (
                            <Mail className="h-5 w-5 text-neutral-500" />
                        )}
                        <p className="text-sm text-neutral-600">
                            {isSiswaRole ? user.nis : user.email}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowAssesmentCard;
