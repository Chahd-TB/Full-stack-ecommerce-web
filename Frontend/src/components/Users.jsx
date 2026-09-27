import { useState, useMemo, useEffect } from "react";
import {
    getUsers,
    makeAdmin,
    makeUser
} from "../services/axios";

import StatCard from "./StatCard";

const SWATCH_COLORS = [
    "bg-teal-600",
    "bg-orange-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-emerald-600"
];

function initials(name) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

function swatchColor(id) {
    const number = parseInt(
        id.slice(-4),
        16
    ) || 0;

    return SWATCH_COLORS[
        number % SWATCH_COLORS.length
    ];
}

function RoleBadge({ role }) {
    if (role === "admin") {
        return (
            <span className="text-teal-700 font-medium bg-teal-100 rounded-full px-3 py-1">
                Admin
            </span>
        );
    }

    return (
        <span className="text-gray-600 font-medium bg-gray-100 rounded-full px-3 py-1">
            User
        </span>
    );
}

function UserRow({
    user,
    onMakeAdmin,
    onMakeUser
}) {
    return (
        <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors">

            <td className="py-5 px-4">
                <div className="flex items-center gap-3">

                    <div
                        className={`w-10 h-10 rounded-full ${swatchColor(
                            user._id
                        )} text-white flex items-center justify-center text-sm font-semibold shrink-0`}
                    >
                        {initials(user.name)}
                    </div>

                    <span className="font-medium text-gray-800">
                        {user.name}
                    </span>

                </div>
            </td>

            <td className="py-5 px-4 text-gray-600">
                {user.email}
            </td>

            <td className="py-5 px-4">
                <RoleBadge role={user.role} />
            </td>

            <td className="py-5 px-4">

                {user.role === "admin" ? (
                    <button
                        onClick={() =>
                            onMakeUser(user.email)
                        }
                        className="text-sm text-orange-600 font-medium hover:underline"
                    >
                        Make User
                    </button>
                ) : (
                    <button
                        onClick={() =>
                            onMakeAdmin(user.email)
                        }
                        className="text-sm text-teal-700 font-medium hover:underline"
                    >
                        Make Admin
                    </button>
                )}

            </td>

        </tr>
    );
}

function Users() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();

                setUsers(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch users:",
                    error
                );
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const search = query.toLowerCase();

        return users.filter((user) => {
            return (
                user.name
                    .toLowerCase()
                    .includes(search) ||
                user.email
                    .toLowerCase()
                    .includes(search)
            );
        });
    }, [users, query]);

    const adminCount = users.filter(
        (user) => user.role === "admin"
    ).length;

    const regularUserCount =
        users.length - adminCount;

    const handleMakeAdmin = async (email) => {
        try {
            await makeAdmin(email);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.email === email
                        ? {
                              ...user,
                              role: "admin"
                          }
                        : user
                )
            );
        } catch (error) {
            console.error(
                "Failed to make user admin:",
                error
            );
        }
    };

    const handleMakeUser = async (email) => {
        try {
            await makeUser(email);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.email === email
                        ? {
                              ...user,
                              role: "user"
                          }
                        : user
                )
            );
        } catch (error) {
            console.error(
                "Failed to make user:",
                error
            );
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="px-4 pt-2">

                <h2 className="text-4xl font-semibold text-gray-900">
                    Users
                </h2>

                <p className="text-gray-500 mt-2">
                    Manage user accounts and permissions
                </p>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">

                <StatCard
                    value={users.length}
                    label="Users"
                />

                <StatCard
                    value={adminCount}
                    label="Admins"
                />

                <StatCard
                    value={regularUserCount}
                    label="Regular users"
                    variant="purple"
                />

            </div>

            {/* Search */}
            <div className="px-4">

                <input
                    value={query}
                    onChange={(e) =>
                        setQuery(e.target.value)
                    }
                    placeholder="Search users..."
                    className="bg-white border border-gray-200 px-4 py-2.5 text-base rounded-xl w-64 outline-none focus:border-[#1f6f6b]"
                />

            </div>

            {/* Table */}
            <div className="mx-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-base">

                        <thead>
                            <tr className="text-left text-sm text-gray-500 bg-gray-50 border-b border-gray-200">

                                <th className="py-4 px-4 font-medium">
                                    User
                                </th>

                                <th className="py-4 px-4 font-medium">
                                    Email
                                </th>

                                <th className="py-4 px-4 font-medium">
                                    Role
                                </th>

                                <th className="py-4 px-4 font-medium">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {filteredUsers.map((user) => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    onMakeAdmin={
                                        handleMakeAdmin
                                    }
                                    onMakeUser={
                                        handleMakeUser
                                    }
                                />
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-12 text-center text-gray-400"
                                    >
                                        No users match your
                                        search.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Users;