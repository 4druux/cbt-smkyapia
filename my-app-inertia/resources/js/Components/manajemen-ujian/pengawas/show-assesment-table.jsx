import React from "react";

const ShowAssesmentTable = ({ users, role }) => {
    const isSiswaRole = role === "siswa";

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            {isSiswaRole ? "Nama Siswa" : "Nama Pengguna"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                            {isSiswaRole ? "NIS" : "Email"}
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
                                {isSiswaRole ? user.nis : user.email}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowAssesmentTable;
