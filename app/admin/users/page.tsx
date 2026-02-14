"use client";

import { useState, useEffect } from "react";
import UserCard from "@/components/users/UserCard";
import { getUsers } from "@/lib/services/dashboard.service";
import { User } from "@/lib/types/property";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10">
                <div className="text-center text-gray-500">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#5B0F1A]">Users</h1>
                <p className="text-gray-500 mt-1">Manage all registered users</p>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <p className="text-gray-500">No users found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}