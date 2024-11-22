'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const BuatTes = () => {
  const router = useRouter();
  const [jenisTes, setJenisTes] = useState('');
  const [kategoriTes, setKategoriTes] = useState('');
  const [namaTes, setNamaTes] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const [showJenisDropdown, setShowJenisDropdown] = useState(false);
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);

  const [activeTab, setActiveTab] = useState('buatTes');

  const jenisDropdownRef = useRef(null);
  const kategoriDropdownRef = useRef(null);
  const [authorId, setAuthorId] = useState(null);

  useEffect(() => {
    const fetchAuthorId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:2000/author/author-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch author data');
        }

        const authorData = await response.json();
        setAuthorId(authorData.id);
      } catch (error) {
        console.error('Error fetching author data:', error);
        // Handle error (e.g., redirect to login page)
      }
    };

    fetchAuthorId();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (jenisDropdownRef.current && !jenisDropdownRef.current.contains(event.target)) {
        setShowJenisDropdown(false);
      }
      if (kategoriDropdownRef.current && !kategoriDropdownRef.current.contains(event.target)) {
        setShowKategoriDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newTest = {
      authorId: authorId,
      type: jenisTes,
      category: kategoriTes,
      title: namaTes,
      testDescription: deskripsi
    };
  
    try {
      const response = await fetch('http://localhost:2000/test/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTest)
      });
  
      if (response.ok) {
        console.log('Tes berhasil disimpan!');
        const result = await response.json();
        const testId = result.id;  // Menggunakan 'id' dari respons
        if (testId) {
          router.push(`/author/buatSoal?testId=${testId}`);
        } else {
          console.error('Test ID tidak ditemukan dalam respons:', result);
        }
      } else {
        console.error('Gagal menyimpan tes.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    {/* Header dengan Warna Biru Kustom */}
      <header className="bg-[#0B61AA] text-white p-4 sm:p-6 w-auto h-[80px]">
        <div className="container  flex items-center">
          <div className="flex space-x-4 w-full">
            <Link href="/homeAuthor">
              <img src="/images/Vector.png" alt="Vector" className=" h-6 sm:h-9 absolute left-16 absolute top-5" // Gunakan positioning absolute untuk posisi kiri
                style={{ maxWidth: '279px' }} />
            </Link>
          </div>
        </div>
      </header>

      {/* Navigasi */}
      <nav className="bg-[#FFFFFF] text-black p-4">
        <ul className="grid grid-cols-2 flex justify-start sm:flex sm:justify-around gap-4 sm:gap-10">
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
            >
              Publikasi
            </button>
          </li>
        </ul>
      </nav>

      <div className='bg-white p-4'>
      {/* Konten Utama */}
      <div className="flex justify-center items-start mx-0 sm:mx-12">
        {activeTab === 'buatTes' && (
          <div className="bg-[#78AED6] p-8 rounded-md mx-auto w-full h-[750px] mt-[20px]">
            <div className="flex justify-start pr-9">
              {/* Bagian Kiri, Teks Rata Kanan */}
              <div className="text-left pr-8 ">
                <h3 className="font-poppins text-black sm:text-lg mb-7 mt-7 sm:mt-8 sm:pt-6 ">Jenis</h3>
                <h3 className="font-poppins text-black sm:text-lg mb-4 mt-7 sm:mt-.6 sm:pt-12">Kategori</h3>
                <h3 className="font-poppins text-black sm:text-lg mb-4 mt-16 sm:mt-2 sm:pt-12">Nama</h3>
                <h3 className="font-poppins text-black sm:text-lg mb-4 mt-10 sm:mt-10 sm:pt-12 ">Deskripsi</h3>
              </div>

              {/* Bar putih di samping */}
              <div className="bg-white p-6 rounded-md shadow-lg w-full h-[550px] sm:mr-0 mr-10">
                {/* Dropdown Jenis Tes */}
                <div className="mb-4 sm:pt-4">
                  <div className="relative" ref={jenisDropdownRef}>
                    <button
                      className="w-full border border-gray-300 p-2 rounded-full flex justify-between items-center bg-white"
                      onClick={() => setShowJenisDropdown(!showJenisDropdown)}
                    >
                      <span className="font-poppins text-gray-500 italic">{jenisTes || 'Jenis Tes'}</span>
                      <svg
                        className="w-4 h-4 ml-2 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.293 9.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {showJenisDropdown && (
                    <div className="absolute z-10 w-full mt-1 border border-gray-300 bg-white rounded-md shadow-lg">
                      <ul className="absolute z-10 w-full mt-1 border border-gray-300 bg-white rounded-md shadow-lg">
                        <li>
                          <button
                            className="font-poppins w-full text-left px-4 py-2 text-gray-700 italic hover:bg-gray-100"
                            onClick={() => { setJenisTes('PilihanGanda'); setShowJenisDropdown(false); }}
                          >
                            Pilihan Ganda
                          </button>
                        </li>
                        <li>
                          <button
                            className="font-poppins w-full text-left px-4 py-2 text-gray-700 italic hover:bg-gray-100"
                            onClick={() => { setJenisTes('Essay'); setShowJenisDropdown(false); }}
                          >
                            Essay
                          </button>
                        </li>
                      </ul>
                    </div>
                    )}

                  </div>
                </div>

                {/* Dropdown Kategori Tes */}
                <div className="mb-4 sm:pt-12 w-full  mr-0 sm:mr-0">
                  <div className="relative" ref={kategoriDropdownRef}>
                    <button
                      className="w-full border border-gray-300 p-2 rounded-full flex justify-between items-center bg-white "
                      onClick={() => setShowKategoriDropdown(!showKategoriDropdown)}
                    >
                      <span className="font-poppins text-gray-500 italic">{kategoriTes || 'Kategori Tes'}</span>
                      <svg
                        className="w-4 h-4 ml-2 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.293 9.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {showKategoriDropdown && (
                      <div className="absolute z-10 w-full mt-1 border border-gray-300 bg-white rounded-md shadow-lg">
                        <ul className="absolute z-10 w-full mt-1 border border-gray-300 bg-white rounded-md shadow-lg">
                          <li>
                            <button
                              className="font-poppins w-full text-left px-4 py-2 text-gray-700 italic hover:bg-gray-100"
                              onClick={() => { setKategoriTes('CPNS'); setShowKategoriDropdown(false); }}
                            >
                              CPNS
                            </button>
                          </li>
                          <li>
                            <button
                              className="font-poppins w-full text-left px-4 py-2 text-gray-700 italic hover:bg-gray-100"
                              onClick={() => { setKategoriTes('UTBK'); setShowKategoriDropdown(false); }}
                            >
                              UTBK
                            </button>
                          </li>
                          <li>
                            <button
                              className="font-poppins w-full text-left px-4 py-2 text-gray-700 italic hover:bg-gray-100 truncate"
                              onClick={() => { setKategoriTes('PEMROGRAMAN'); setShowKategoriDropdown(false); }}
                            >
                              PEMROGRAMAN
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Nama Tes */}
                <div className="mb-4 sm:pt-12">
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded-full"
                    placeholder="Nama Tes"
                    value={namaTes} // Diubah di sini
                    onChange={(e) => setNamaTes(e.target.value)} 
                  />
                </div>

                {/* Input Deskripsi */}
                <div className="mb-4 sm:pt-12">
                  <textarea
                    className="w-full border border-gray-300 p-2 rounded-md"
                    rows="4"
                    placeholder="Deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </div>

                {/* Tombol Simpan */}
                <div className="relative min-h-[600px] sm:min-h-[450px]">
                  <div className="absolute bottom-60 right-0 pb-10  mr-[-20px]">
                    <button
                      className="bg-white text-black w-[180px] px-6 py-2 rounded-md hover:bg-[#0B61AA] hover:text-white transition duration-300" 
                      onClick={handleSubmit}>
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'publikasi' && (
          <div className="bg-[#465C6F] p-6 rounded-md">
            <h2 className="text-white text-xl">Halaman Publikasi</h2>
          </div>
        )}
      </div>
      </div>
      
    </>
  );
}

export default BuatTes;