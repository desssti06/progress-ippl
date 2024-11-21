'use client';
import React, { useState } from "react"; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false); 
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false); 

    // Fungsi untuk toggle tampilan sandi
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
            }
    
            console.log("Login berhasil");

            // Simpan token di localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
            } else {
                throw new Error('Token tidak ditemukan');
            }
    
            setShowPopup(true);
    
            setTimeout(() => {
                setShowPopup(false);
                router.push('/admin/dashboard'); // Arahkan ke dashboard admin setelah login berhasil
            }, 3000);
        } catch (err) {
            console.error("Kesalahan login", err);
            alert(err.message);
        }
    };
    
    return (
        <div className="relative min-h-screen flex items-center bg-white">
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', padding: '20px' }}></div>

            <div className="absolute lg:right-1/2  lg:top-1/2 transform lg:-translate-y-1/2 w-full  max-w-screen p-4 lg:max-w-sm lg:p-8 bg-powderBlue shadow-md rounded-3xl ml-0 lg:ml-20">
                <h2 className="text-3xl font-bold mb-6 text-black text-center">Login Admin</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='email' className="block text-sm font-medium text-black">Alamat Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor='password' className="block text-sm font-medium text-black">Kata Sandi</label>
                        <div className="relative"> 
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        <span
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                            onClick={togglePasswordVisibility} // Event handler untuk toggle
                        >
                            {showPassword ? (
                                <FaEye className="w-5 h-5" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5" />
                            )}
                        </span>
                    </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-deepBlue text-putih py-2 px-10 rounded-2xl shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            Login
                        </button>
                    </div>
                    <p className="text-center mt-4 text-sm">
                        Belum memiliki akun? <Link href="/auth/registrasi" className="text-white font-bold hover:underline">Daftar</Link>
                    </p>
                </form>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold">Login Berhasil!</h3>
                        <p className="mt-2">Selamat! Anda berhasil login.</p>
                    </div>
                </div>
            )}
            <div className="hidden lg:block relative">
                <img 
                    src="/images/ellipse.png" 
                    alt="elips" 
                    className="hidden lg:block lg:max-h-screen object-contain"
                />
                <img 
                    src="/images/mobilelock.png" 
                    alt="mobile lock" 
                    className="absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-h-screen object-contain top-[-10%] left-1/2 transform -translate-x-1/2 max-h-20 z-10"
                />
            </div>
        </div>
    );
};

export default Login; // Pastikan ini adalah ekspor default
