import { useState } from "react";
import { updateProfile, updatePassword } from "../services/axios";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [name, setName] = useState(
        user?.name || ""
    );

    const [email, setEmail] = useState(
        user?.email || ""
    );

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSaveProfile = async () => {
    try {
        const response = await updateProfile({
            name,
            email
        });

        localStorage.setItem(
            "user",
            JSON.stringify(response.data)
        );

        alert("Profile updated successfully.");
    } catch (error) {
        console.error(
            "Failed to update profile:",
            error
        );
    }
    };
      
    const handleChangePassword = async () => {
    try {
        await updatePassword({
            password,
            newPassword
        });

        alert("Password changed successfully.");

        setPassword("");
        setNewPassword("");
    } catch (error) {
        console.error(
            "Failed to change password:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Failed to change password."
        );
    }
    };

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
    };


    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="px-4 pt-2">
                <h2 className="text-4xl font-semibold text-gray-900">
                    Settings
                </h2>

                <p className="text-gray-500 mt-2">
                    Manage your account and application settings
                </p>
            </div>

            {/* Profile */}
            <div className="mx-4 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Profile
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Your account information
                    </p>
                </div>

                <div className="p-6 space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full max-w-xl bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#1f6f6b]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full max-w-xl bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#1f6f6b]"
                        />
                    </div>

                    <button
                        onClick={handleSaveProfile}
                        className="bg-[#1f6f6b] hover:bg-[#185b58] text-white px-5 py-2.5 rounded-xl font-medium transition"
                    >
                        Save changes
                    </button>

                </div>

            </div>

            {/* Password */}
            <div className="mx-4 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Password
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Change your account password
                    </p>
                </div>

                <div className="p-6 space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current password
                        </label>

                        <input
                            value= {password}
                            onChange={(e) =>
                                setPassword(e.target.value)

                            }
                            type="password"
                            className="w-full max-w-xl bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#1f6f6b]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New password
                        </label>

                        <input
                            value= {newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            type="password"
                            className="w-full max-w-xl bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#1f6f6b]"
                        />
                    </div>

                    <button
                        onClick={handleChangePassword}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition"
                    >
                        Change password
                    </button>

                </div>

            </div>

            {/* Account */}
            <div className="mx-4 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Account
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage your current session
                    </p>
                </div>

                <div className="p-6">

                    <button
                        onClick={handleLogout}
                        className="border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-medium transition"
                    >
                        Log out
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Settings;