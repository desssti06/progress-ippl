'use client';
import { useRouter } from 'next/navigation';

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
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
            {/* Gambar Latar */}
            <img 
                src="/images/polygon.png" 
                alt="Polygon Background" 
                className="absolute inset-0 w-full h-full object-cover lg:object-contain lg:object-left hidden lg:block"
            />

            {/* Gambar Mobile & Tablet */}
            <div className="absolute top-6 left-0 right-0 mx-auto md:top-12 lg:hidden">
                <img 
                    src="/images/mobilepassword.png" 
                    alt="Img 2" 
                    className="w-full max-w-xs h-auto object-contain mx-auto"
                />
            </div>

            {/* Konten */}
            <div className="relative w-full max-w-sm bg-powderBlue shadow-md rounded-3xl p-6 sm:p-8 mt-24 md:mt-0">
                <h2 className="text-2xl font-bold text-center text-black mb-4">Persyaratan</h2>
                <p className="text-sm sm:text-base text-black">Untuk mendaftar sebagai author, silakan lengkapi persyaratan berikut:</p>
                <ul className="list-disc list-inside mt-4 text-sm sm:text-base">
                    <li>Scan identitas diri (KTP/SIM) asli</li>
                    <li>Scan Kartu Keluarga asli</li>
                    <li>Curriculum Vitae (CV)</li>
                    <li>Pas foto berwarna ukuran 3x4</li>
                </ul>
                <p className="text-sm sm:text-base mt-4">
                    Buatlah file .zip berisi dokumen-dokumen persyaratan di atas lalu kirim ke alamat e-mail 
                    <span className="font-bold"> EtamTest@gmail.com</span> dan tunggu pemberitahuan selanjutnya.
                </p>
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="bg-deepBlue hover:bg-paleBlue text-white py-2 px-4 rounded-2xl text-sm sm:text-base font-medium">
                        Selesai
                    </button>
                </div>
            </div>

            {/* Gambar Kanan pada Desktop */}
            <div className="hidden lg:block absolute right-20 top-1/2 transform -translate-y-1/2">
                <img 
                    src="/images/mobilepassword.png" 
                    alt="Img 2" 
                    className="w-80 h-auto object-contain"
                />
            </div>
        </div>
    );
};

export default Persyaratan;
