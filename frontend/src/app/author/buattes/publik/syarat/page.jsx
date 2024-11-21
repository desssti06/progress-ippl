'use client';
import { useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link from next/link

export default function Page() {
  const [activeTab, setActiveTab] = useState('publikasi'); // Set initial active tab to 'publikasi'
  const [isChecked, setIsChecked] = useState(false);
  const [testId, setTestId] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const testIdFromUrl = params.get("testId"); // Ambil testId dari URL
    if (testIdFromUrl) {
      setTestId(testIdFromUrl); // Set testId ke state
    }
  }, []);

  const handleNext = () => {
    if (isChecked) {
      if (testId) {
        router.push(`/author/buattes/publik/publikasi?testId=${testId}`); // Arahkan ke halaman publikasi dengan testId
      } else {
        console.error("testId is null. Cannot navigate.");
      }
    }
  };

  return (
    <>
      {/* Bar Atas */}
      <header className="bg-[#0B61AA] text-white p-4 sm:p-6 w-full h-[80px]">
        <div className="container flex items-center">
          <div className="flex space-x-4 w-full">
            <Link href="/homeAuthor">
              <img src="/images/Vector.png" alt="Vector" className="h-6 sm:h-9 absolute left-16 top-5" style={{ maxWidth: '279px' }} />
            </Link>
          </div>
        </div>
      </header>

      {/* Navigasi */}
      <nav className="bg-[#FFFFFF] text-black p-4">
        <ul className="grid grid-cols-2 sm:flex sm:justify-around gap-4 sm:gap-10">
          <li>
            <button
              className={`w-[140px] sm:w-[180px] px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-xl font-bold font-poppins ${activeTab === 'buatTes' ? 'bg-[#78AED6]' : ''}`}
              onClick={() => setActiveTab('buatTes')}
            >
              Buat Soal
            </button>
          </li>
          <li>
            <button
              className={`w-[140px] sm:w-[180px] px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-xl font-bold font-poppins ${activeTab === 'publikasi' ? 'bg-[#78AED6]' : ''}`}
              onClick={() => setActiveTab('publikasi')}
            >
              Publikasi
            </button>
          </li>
        </ul>
      </nav>



      {/* Konten */}
      <div className="bg-[#78AED6] p-8 sm:p-12 rounded-md mx-auto max-w-full sm:max-w-screen-lg mt-8 text-justify">
        <h2 className="text-black text-lg sm:text-xl mb-6 text-center">Syarat & Ketentuan</h2>
        <ol className="list-decimal list-inside sm:list-outside text-black text-sm sm:text-base space-y-4 pl-4 sm:pl-6">
          <li>Soal yang dipublikasikan harus orisinal dan tidak melanggar hak cipta. Jika terjadi pelanggaran hak cipta, author bertanggung jawab penuh atas segala tuntutan hukum yang mungkin timbul.</li>
          <li>Soal harus memenuhi standar kualitas, kejelasan, kebenaran jawaban, dan relevansi dengan topik.</li>
          <li>Tim platform berhak melakukan penyuntingan atau meminta revisi atas soal yang diajukan jika ditemukan kesalahan atau ketidaksesuaian dengan standar yang berlaku.</li>
          <li>Platform berhak menghapus soal yang telah dipublikasikan jika ditemukan adanya pelanggaran ketentuan tanpa pemberitahuan sebelumnya kepada author.</li>
          <li>Author bertanggung jawab atas keakuratan soal dan akibat dari kesalahan soal.</li>
          <li>Soal tidak boleh mengandung SARA, pornografi, atau konten ilegal.</li>
          <li>Dengan mempublikasikan soal, author memberikan lisensi non-eksklusif kepada aplikasi untuk menggunakan, memodifikasi, dan menampilkan soal tersebut kepada pengguna aplikasi. Hak cipta tetap dimiliki oleh author, namun aplikasi berhak menggunakannya untuk kepentingan aplikasi.</li>
        </ol>

        {/* Checkbox */}
        <div className="flex items-center mb-6 mt-6">
          <input
            type="checkbox"
            id="setujui"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="setujui" className="text-black text-sm sm:text-base">Setujui syarat dan ketentuan publikasi soal</label>
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className={`bg-white text-black py-2 px-4 rounded-lg hover:bg-[#0B61AA] hover:text-white ${isChecked ? '' : 'opacity-50 cursor-not-allowed'}`}
            aria-disabled={!isChecked}
            disabled={!isChecked}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </>
  );
}
