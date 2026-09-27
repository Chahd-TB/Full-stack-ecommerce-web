import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../services/axios";

export default function AuthPage() {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isLogin = mode === "login";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password || (!isLogin && !name)) {
            setError("Fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const response = isLogin
                ? await loginUser({ email, password })
                : await signupUser({ name, email, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 min-h-screen bg-[#f6f4ee] text-[#1c1b17] font-sans">
            {/* Left brand panel — hidden below lg breakpoint */}
            <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-[#1f6f6b] text-white p-12">
                <svg
                    width="380"
                    height="380"
                    viewBox="0 0 380 380"
                    fill="none"
                    className="absolute top-0 right-0 opacity-50"
                >
                    <circle
                        cx="330"
                        cy="40"
                        r="180"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                    />
                    <circle
                        cx="330"
                        cy="40"
                        r="130"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                    />
                    <circle
                        cx="330"
                        cy="40"
                        r="80"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                    />
                </svg>

                <div className="relative z-10 font-serif text-4xl font-semibold">
                    ✦ Productly
                </div>

                <div className="relative z-10 max-w-85">
                    <h2 className="font-serif font-medium text-2xl leading-[1.15] mb-3.5">
                        Every product,
                        <br />
                        always in view.
                    </h2>

                    <p className="text-white/75 text-lg leading-relaxed">
                        Track stock levels, manage categories, and stay ahead of
                        what's running low all from one place.
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex items-center justify-center p-10">
                <div className="w-full max-w-85">
                    <h1 className="font-serif font-medium text-2xl mb-1.5">
                        {isLogin ? "Welcome back" : "Create your account"}
                    </h1>

                    <p className="text-[#8a8577] text-sm mb-7">
                        {isLogin
                            ? "Sign in to your dashboard"
                            : "Start managing your inventory"}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="mb-4.5">
                                <label className="block text-[13px] text-[#8a8577] mb-1.5">
                                    Full name
                                </label>

                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-transparent border-0 border-b border-[#e4e1d4] py-2 px-0.5 text-[14.5px] outline-none focus:border-[#1f6f6b] transition-colors"
                                />
                            </div>
                        )}

                        <div className="mb-4.5">
                            <label className="block text-[13px] text-[#8a8577] mb-1.5">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-transparent border-0 border-b border-[#e4e1d4] py-2 px-0.5 text-[14.5px] outline-none focus:border-[#1f6f6b] transition-colors"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="block text-[13px] text-[#8a8577] mb-1.5">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full bg-transparent border-0 border-b border-[#e4e1d4] py-2 px-0.5 text-[14.5px] outline-none focus:border-[#1f6f6b] transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-[#a8422f] text-[13px] -mt-1.5 mb-4">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-center bg-[#1f6f6b] hover:bg-[#154e4b] text-white py-3 rounded-full text-sm font-medium mt-2 transition-colors disabled:opacity-50 disabled:cursor-default"
                        >
                            {loading
                                ? "Please wait…"
                                : isLogin
                                ? "Sign in"
                                : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-[13.5px] text-[#8a8577] mt-6">
                        {isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "}

                        <button
                            type="button"
                            onClick={() => {
                                setMode(isLogin ? "signup" : "login");
                                setError("");
                            }}
                            className="text-[#1f6f6b] hover:text-[#154e4b] font-medium transition-colors"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}