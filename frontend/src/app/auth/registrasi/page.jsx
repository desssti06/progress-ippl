'use client';
import React, { useState } from "react"; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Registrasi = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [showPopup, setShowPopup] = useState(); 
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false); 

    // Fungsi untuk toggle tampilan sandi
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2000/auth/registrasi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: role.toUpperCase(),
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(data.message || 'Data yang Anda masukkan tidak valid. Silakan periksa kembali.');
                } else if (response.status === 401) {
                    throw new Error('Anda tidak memiliki hak akses. Silakan login kembali.');
                } else if (response.status === 409) {
                    throw new Error('Email anda telah terdaftar. Gunakan email lain.');
                } else if (response.status === 500) {
                    throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
                } else {
                    throw new Error('Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.');
                }
            }
    
            console.log("Akun berhasil didaftarkan");

            setShowPopup(true);

            setTimeout(() => {
                setShowPopup(false);
                if (role === 'AUTHOR') {
                    router.push('/auth/syarat');
                } else {
                    router.push('/auth/login');
                }
            }, 3000);
        } catch (err) {
            console.error("Kesalahan registrasi", err);
            alert(err.message);
        }
    };
    
    return (
        <div className="flex h-screen">
            <img 
                src="/images/polygon.png" 
                alt="Img 1" 
                className="w-full md:w-auto lg:w-auto h-screen object-contain object-left"
            />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', padding: '20px' }}></div>

            <div className="absolute lg:right-1/2  lg:top-1/2 transform lg:-translate-y-1/2 w-full  max-w-screen p-4 lg:max-w-sm lg:p-7 bg-powderBlue shadow-md rounded-3xl ml-0 lg:ml-20">
                <h2 className="text-3xl font-bold mb-6 text-black text-center">Daftar</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='name' className="block text-sm font-medium text-black">Nama:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
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
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                    </div>
                    </div>
                    <div className="relative">
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                            <option value="AUTHOR">Author</option>
                            <option value="USER">User</option>
                        </select>
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                            <MdOutlineKeyboardArrowDown size={20} />
                        </span>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-deepBlue text-putih py-2 px-10 rounded-2xl shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            Kirim
                        </button>
                    </div>
                    <p className="text-center mt-4 text-sm">
                        Sudah memiliki akun? <Link href="/auth/login" className="text-white font-bold hover:underline">Login</Link>
                    </p>
                </form>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold">Akun Anda Berhasil Didaftarkan!</h3>
                        <p className="mt-2">Selamat! Akun Anda telah berhasil didaftarkan.</p>
                    </div>
                </div>
            )}
            
           <img 
                src="/images/mobilepassword.png" 
                alt="Img 2" 
                className="w-full max-w-xs md:max-w-sm lg:max-w-md h-auto object-contain"
            />
         </div>
    );
};

export default Registrasi;