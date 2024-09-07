import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Authentification({ onAuth }) {
    const [type, setType] = useState("userIconSingin");
    const [users, setUsers] = useState({
        name: "",
        email: "",
        password: "",
        confirmePassword: ""
    });

    const navigate = useNavigate();

    const onChangeData = (e) => {
        const { name, value } = e.target;
        setUsers((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === "userIconSingin") {
            onAuth();
            navigate("/");
        } else if (type === "userIconSingUp") {
            // Replace this with your actual sign-up logic
            if (users.password !== users.confirmePassword) {
                alert("Passwords do not match!");
                return;
            }
            console.log("User registered:", users);
            // Simulate successful registration and redirect to home
            onAuth();
            navigate("/");
        }
    };

    return (
        <div className="overflow-hidden LoginbgImg h-screen">
            <div className="bg-black/80 h-screen flex flex-row justify-around items-center">
                <div className="w-1/2">
                    <h1 className="text-5xl text-gray-300/80 text-center italic font-bold">
                        Bienvenue au restaurant «Utopia bye Sooatel»
                    </h1>
                </div>

                <div className="h-auto p-5 bg-gradient-to-l from-black/80 to-gray-300/80 rounded">
                    <div className="text-center py-2">
                        <div className="mb-4">
                            <div className="flex flex-col justify-center items-center py-2">
                                <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-20 h-20 rounded-full" />
                            </div>
                            {type === "userIconSingin" ? (
                                <span className="text-2xl font-bold">
                                    Login to SOOATEL
                                </span>
                            ) : (
                                <span className="text-2xl font-bold">
                                    Register a new account
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-around mb-4">
                            <button
                                className={`px-4 py-2 rounded-lg 
                                    ${type === "userIconSingin" ? "bg-gradient-to-r from-gray-800 to-gray-300/80 text-white" : "bg-gray-200"}`}
                                onClick={() => setType("userIconSingin")}>
                                Sign In
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg 
                                    ${type === "userIconSingUp" ? "bg-gradient-to-l from-gray-800 to-gray-300/80 text-white" : "bg-gray-200"}`}
                                onClick={() => setType("userIconSingUp")}>
                                Sign Up
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {type === "userIconSingin" ? (
                                <>
                                    <div className="flex flex-col gap-3">
                                        <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                            <label className="text-gray-700">Your Email</label>
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="name@mail.com"
                                                className="w-72 px-4 py-2 border rounded-lg bg-white/10 outline-none"
                                                onChange={onChangeData}
                                                value={users.email}
                                            />
                                        </div>
                                        <div className="w-92 flex flex-col gap-2 items-center justify-between">
                                            <div className="flex flex-row gap-2 items-center justify-between">
                                                <label className="text-gray-700">Password</label>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    placeholder="********"
                                                    className="w-72 px-4 py-2 border rounded-lg bg-white/10 outline-none"
                                                    onChange={onChangeData}
                                                    value={users.password}
                                                />
                                            </div>
                                            <p className="text-red-500 text-xs italic">Please choose a password.</p>
                                        </div>
                                    </div>
                                    <button type="submit" className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg">
                                        Sign In
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-4">
                                        <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                            <label className="text-gray-700">Your Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                placeholder="your name"
                                                className="w-72 bg-white/10 px-4 py-2 border rounded-lg outline-none"
                                                onChange={onChangeData}
                                                value={users.name}
                                            />
                                        </div>
                                        <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                            <label className="text-gray-700">Your Email</label>
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="name@mail.com"
                                                className="w-72 bg-white/10 px-4 py-2 border rounded-lg outline-none"
                                                onChange={onChangeData}
                                                value={users.email}
                                            />
                                        </div>
                                        <div className="w-92 flex flex-col gap-2 items-center">
                                            <div className="w-full flex flex-row gap-2 items-center justify-between">
                                                <label className="text-gray-700">Password</label>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    placeholder="********"
                                                    className="w-72 bg-white/10 px-4 py-2 border rounded-lg outline-none"
                                                    onChange={onChangeData}
                                                    value={users.password}
                                                />
                                            </div>
                                            <p className="text-red-500 text-xs italic">Please choose a password.</p>
                                        </div>
                                        <div className="w-92 flex flex-col gap-2 items-center">
                                            <div className="flex flex-row gap-2 items-center justify-between ">
                                                <label className="text-gray-700">Confirm Password</label>
                                                <input
                                                    name="confirmePassword"
                                                    type="password"
                                                    placeholder="********"
                                                    className="w-72 bg-white/10 px-4 py-2 border rounded-lg outline-none"
                                                    onChange={onChangeData}
                                                    value={users.confirmePassword}
                                                />
                                            </div>
                                            <p className="text-red-500 text-xs italic">Please confirm your password.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-around items-center">
                                        <button type="submit" className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg">
                                            Sign Up
                                        </button>
                                        <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                                            Forgot Password?
                                        </a>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
