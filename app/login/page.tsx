"use client"
import { BASE_API_URL } from "@/global"
import { StoreCookie } from "@/lib/client-cookie"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { ToastContainer, toast } from "react-toastify"

const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/user/login`
            const payload = JSON.stringify({ email, password })
            const { data } = await axios.post(url, payload, {
                headers: { "Content-Type": "application/json" }
            })

            if (data.status === true) {
                toast(data.message, {
                    hideProgressBar: true,
                    containerId: "toastlogin",
                    type: "success",
                    autoClose: 2000
                })
                StoreCookie("token", data.token)
                StoreCookie("id", data.data.id)
                StoreCookie("name", data.data.name)
                StoreCookie("role", data.data.role)

                const role = data.data.role
                if (role === "MANAGER") {
                    setTimeout(() => router.replace("/manager/dashboard"), 1000)
                } else if (role === "CASHIER") {
                    setTimeout(() => router.replace("/cashier/dashboard"), 1000)
                }
            } else {
                toast(data.message, {
                    hideProgressBar: true,
                    containerId: "toastlogin",
                    type: "warning"
                })
                console.log(data.message)
            }
        } catch (error) {
            toast("Something Wrong", {
                hideProgressBar: true,
                containerId: "toastlogin",
                type: "error"
            })
            console.log(error)
        }
    }

    return (
        <div className="relative w-screen h-screen flex overflow-hidden text-white font-sans">
            <ToastContainer containerId="toastLogin" />

            {/* 1. GAMBAR BACKGROUND FULL SCREEN (Diletakkan di layer paling belakang) */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/image/login2.jpg" 
                    alt="Background POS"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlay Gelap Tipis */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* 2. SISI KIRI: Branding & Floating Widget */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative z-10 flex-col justify-between p-12">
                {/* Logo & Brand Name */}
                <div className="flex items-center gap-3">
                    <Image alt="AEON VELVRA" width={40} height={40} src="/image/logowht.png" className="h-auto" />
                    <span className="text-xl font-bold tracking-wider text-orange-400 uppercase">AEON VELVRA</span>
                </div>

                {/* Floating Widget */}
                <div className="flex flex-col gap-3 max-w-xs">
                    {/* Top Food Items Card */}
                    <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between shadow-xl">
                        <div>
                            <p className="text-xs text-slate-300">Top Food Items</p>
                            <div className="flex gap-1.5 mt-1">
                                <span className="text-base">🍜</span>
                                <span className="text-base">🍔</span>
                                <span className="text-base">🍟</span>
                            </div>
                        </div>
                        <span className="text-emerald-400 text-sm font-semibold">+15.2%</span>
                    </div>

                    {/* Orders Today Card */}
                    <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between shadow-xl">
                        <div>
                            <p className="text-xs text-slate-300">Orders Today</p>
                            <div className="flex gap-1 mt-1 text-sm">🍕 🥤 🥪</div>
                        </div>
                        <span className="text-emerald-400 text-sm font-semibold">+8.4%</span>
                    </div>
                </div>
            </div>

            {/* 3. SISI KANAN: Form Login dengan Efek Blur (Frosted Glass) */}
            <div className="w-full lg:w-1/2 h-full relative z-10 flex flex-col justify-between p-6 sm:p-12 md:p-20 backdrop-blur-xl bg-black/50 border-l border-white/10 overflow-y-auto">
                {/* Topbar */}
                <div className="flex justify-end items-center">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition backdrop-blur-sm">
                        <span>🇬🇧</span>
                        <span>EN</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-3 h-3 text-slate-400"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                </div>

                {/* Form Area */}
                <div className="w-full max-w-[420px] mx-auto my-auto py-8">
                    <div className="flex items-center gap-3 lg:hidden mb-6">
                        <Image alt="AEON VELVRA" width={32} height={32} src="/image/logowht.png" className="h-auto" />
                        <span className="text-lg font-bold tracking-wider text-orange-400 uppercase">AEON VELVRA</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 text-center lg:text-left">
                        Welcome Manager & Cashier!
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base text-center lg:text-left mb-8">
                        Sign in to manage orders, inventory, and team performance.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm text-slate-300">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-white/10 bg-black/30 backdrop-blur-md px-4 py-3 text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm text-slate-300">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-xs text-orange-400 hover:text-orange-300"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-white/10 bg-black/30 backdrop-blur-md px-4 py-3 pr-12 text-white placeholder:text-slate-400 focus:border-orange-400 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-300">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe((prev) => !prev)}
                                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-orange-400 focus:ring-orange-500"
                                />
                                Remember me
                            </label>
                            <button type="button" className="text-orange-400 hover:text-orange-300">
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-400 cursor-pointer"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-3 text-slate-400 text-xs">
                        <span className="h-px flex-1 bg-white/10" />
                        <span>Secure access</span>
                        <span className="h-px flex-1 bg-white/10" />
                    </div>
                </div>

                <div className="flex justify-center pb-2 text-xs text-slate-400">
                    © 2025 AEON VELVRA. All rights reserved.
                </div>
            </div>
        </div>
    )
}

export default LoginPage