'use client'
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gambar1 from '@/app/assets/elips.png';
import gambar2 from '@/app/assets/register.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const auth = getAuth(); // Initialize Firebase Auth

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Use signInWithEmailAndPassword from firebase/auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("Login successful", user);

            router.push('/dashboard'); // Redirect to a logged-in page
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center bg-white">
            <div
                style={{
                    backgroundImage: `url(${gambar1})`,
                    backgroundPosition: 'right',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '350px auto',
                }}
                className="absolute inset-0 bg-cover bg-no-repeat"
            />
            <div
                style={{
                    backgroundImage: `url(${gambar2})`,
                    backgroundPosition: 'right',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '400px auto',
                }}
                className="absolute inset-0 bg-cover bg-no-repeat"
            />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full max-w-md p-8 bg-secondary shadow-md rounded-lg ml-20">
                <h2 className="text-2xl font-bold mb-6 text-black">Login</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor='email' className="block text-sm font-medium text-black">Email:</label>
                        <input 
                            type="text" 
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor='password' className="block text-sm font-medium text-black">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green text-black py-2 px-4 rounded-md shadow-sm hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        Login
                    </button>
                    <p className="text-center mt-4 text-sm">
                        Belum memiliki akun? <Link href="/register" className="text-black font-bold hover:underline">Daftar</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
