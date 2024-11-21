'use client';
import React from "react"; 
import { useRouter } from 'next/navigation';
import Image from "next/image";
import gambar1 from '@/app/assets/registrasi.png';

const Persyaratan = () => {
    const router = useRouter();

    const handleButtonClick = () => {
        try {
            router.push('/auth/login');
        } catch (error) {
            console.error("Failed to navigate:", error);
        }
    };

    return (
        <div className="relative min-h-screen  flex items-center bg-white">
            {/* Img 2 - Kanan */}
            <img 
            src="/images/polygon.png" 
            alt="Img 1" 
            className="w-full md:w-auto lg:w-auto h-screen object-contain object-left"
            />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
            <img 
                src="/images/mobilepassword.png" 
                alt="mobilepassword" 
                className="w-full max-w-xs md:max-w-sm max-w-md lg:h-max-screen object-contain"
            />
            </div>

            <div className="absolute lg:right-1/2  lg:top-1/2 transform lg:-translate-y-1/2 w-full  max-w-screen p-4 lg:max-w-sm lg:p-7 bg-powderBlue shadow-md rounded-3xl ml-0 lg:ml-20">
                <h2 className="text-3xl font-bold mb-6 text-black text-center">Persyaratan</h2>
                <p>Untuk mendaftar sebagai author, silakan lengkapi persyaratan berikut:</p>
                <ul className="list-disc list-inside mt-4">
                    <li>1. Scan identitas diri (KTP/SIM) asli</li>
                    <li>2. Scan Kartu Keluarga asli</li>
                    <li>3. Curriculum Vitae (CV)</li>
                    <li>4. Pas foto berwarna ukuran 3x4</li>
                </ul>
                <p className="mt-4">Buatlah file .zip berisi dokumen-dokumen persyaratan di atas lalu kirim ke alamat e-mail EtamTest@gmail.com dan tunggu pemberitahuan selanjutnya.</p>
                
                <div className="flex justify-center mt-8 w-full">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        aria-label="Navigate to login page"
                        className="hover:bg-orange hover:text-deepBlue text-deepBlue bg-paleBlue p-2 rounded-2xl text-xs font-poppins">
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Persyaratan;
