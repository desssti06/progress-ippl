'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IoPersonCircle } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { SlBookOpen } from "react-icons/sl";

export default function RiwayatTransaksiHeader() {
  const [activeTab, setActiveTab] = useState('Belum Bayar');
  const [menuOpen, setMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState([null]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    console.log('Transactions updated:', transactions);
  }, [transactions]);

  useEffect(() => {
    // Mengakses localStorage di sisi klien
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    console.log('Token:', storedToken);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fungsi untuk menghapus teks dalam kurung
  const formatStatus = (status) => {
    return status.replace(/\s*\(.*?\)\s*/g, '').trim();
  };

  // Fungsi untuk mengambil riwayat transaksi dari backend
  const fetchTransactions = async () => {
    if (!token) {
      console.error('Token tidak tersedia');
      return;
    }

    try {
      const response = await fetch('http://localhost:2000/api/riwayat-transaksi', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Transactions:', data);
        setTransactions(data);
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  // Fungsi untuk mendapatkan data sesuai dengan tab yang aktif
const getDataByTab = () => {
  console.log('All Transactions:', transactions);
  console.log('Active Tab:', activeTab);
  const filteredTransactions = transactions.filter((item) => {
    const itemStatus = item.customStatus || '';
    return itemStatus.includes(activeTab);
  });
  console.log('Filtered Transactions:', filteredTransactions);
  return filteredTransactions;
};

console.log('Filtered Data:', getDataByTab());


const menus = [
  {href:'/user/dashboard', text: "Home"},
  {href:'/user/favorite', text: "Favorit"},
  {href:'/user/riwayat-transaksi', text: "Transaksi"},
]

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
  if (!isSidebarOpen) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
};

useEffect(() => {
  const getUserIdFromToken = () => {
    try {
      setLoading(true);
      // Pastikan kode ini hanya dijalankan di sisi klien
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        const decodedToken = jwtDecode(token);
        if (!decodedToken.id) {
          throw new Error('User ID tidak ditemukan dalam token');
        }

        setUserId(decodedToken.id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setError(error.message);
      // Redirect ke halaman login jika token tidak valid
    } finally {
      setLoading(false);
    }
  };

  getUserIdFromToken();
}, []);

useEffect(() => {
  const fetchUserData = async () => {
    let token;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    
    if (!token) {
      setErrorUser('Token tidak ditemukan');
      setLoadingUser(false);
      return;
    }

    try {
      setLoadingUser(true);
      const response = await fetch('http://localhost:2000/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      if (data) {
        setUserData(data);
      } else {
        throw new Error('Data pengguna tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorUser('Gagal mengambil data pengguna');
      if (error.message === 'Failed to fetch user data') {
        // Token mungkin tidak valid atau kadaluarsa
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        router.push('/login');
      }
    } finally {
      setLoadingUser(false);
    }
  };

  fetchUserData();
}, []);

useEffect(() => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
      setToken(storedToken);
  }
}, []);


  return (
    <>
      {/* Header */}
      <header className="sticky p-4 bg-deepBlue top-0 left-0 right-0 text-white w-full font-poppins lg:p-3 z-50">
        <div className="mx-auto flex justify-between items-center font-poppins max-w-full ">
          <div className="flex justify-between">
            {/* Ikon Menu untuk mobile */}
            <button onClick={toggleSidebar}>
            <IoMenu  className="h-[30px] lg:hidden"/>
            </button>

            <button onClick={toggleSidebar}>
            <img 
                src="/images/etamtest.png" 
                alt="EtamTest" 
                className="h-[30px] lg:h-10 pl-3" 
              />
            </button>
          </div>

          <div className="flex  items-center space-x-4">
            {/* Navigation Bar untuk desktop */}
            <nav className="md:block lg:block flex">
              <ul className="flex lg:space-x-7 md:space-x-4">
                {menus.map((menu, index) => (
                  <li key={index}>
                    <Link legacyBehavior href={menu.href}>
                      <a className="hidden hover:text-orange font-bold lg:block">{menu.text}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Profile */}
            <div className="relative inline-block">
              {userData?.userPhoto ? (
                <img
                  src={userData.userPhoto}
                  alt="User Profile"
                  className="h-14 w-14 rounded-full cursor-pointer mr-5"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                />
              ) : (
                <IoPersonCircle
                  className="h-14 w-14 rounded-full cursor-pointer text-white mr-5"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                />
              )}

              {/* Dropdown */}
              {isDropdownOpen && (
                <div
                  className="absolute right-2 mt-0 w-37 bg-white rounded-lg shadow-lg z-10 p-1 
                  before:content-[''] before:absolute before:-top-4 before:right-8 before:border-8
                  before:border-transparent before:border-b-white"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link legacyBehavior href={`/user/edit-profile/${userId}`}>
                    <a className="block px-4 py-1 text-deepBlue text-sm text-gray-700 hover:bg-deepBlue hover:text-white rounded-md border-abumuda">
                      Ubah Profil
                    </a>
                  </Link>
                  <Link legacyBehavior href="/auth/login">
                    <a
                      onClick={handleLogout}
                      className="block px-4 py-1 text-deepBlue text-sm text-gray-700 hover:bg-deepBlue hover:text-white rounded-md"
                    >
                      Logout
                    </a>
                  </Link>
                </div>
              )}
            </div>

          </div>
          
        </div>
      </header>

      {/* Sidebar ketika tampilan mobile */}
      <aside className={`fixed top-16 pt-6 left-0 w-64 bg-white h-full transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden z-40`}>
        <ul className="p-4 space-y-4 text-deepblue round-lg">
          <div className="flex flex-col items-center">
            <li>
            <img
              src={userData?.userPhoto || undefined}  // Gunakan foto dari userData, atau undefined jika tidak ada
              alt="profile"
              className="h-14 w-14 cursor-pointer mb-2 rounded-full"
              // Gunakan conditional rendering untuk menampilkan ikon jika userPhoto tidak ada
              onError={(e) => {
                e.target.onerror = null;  // Menghindari infinite loop jika gambar error
                e.target.src = "";  // Mengosongkan src sehingga akan menampilkan ikon
              }}
            />

            {!userData?.userPhoto && (
              <IoPersonCircle className="h-14 w-14 text-gray-500 cursor-pointer mb-2" />
            )}
            </li>
            <p className="font-bold">{userData?.name}</p>
          </div>
          {menus.map((menu, index) => (
            <li key={index}>
              <Link legacyBehavior href={menu.href}>
                <a className="block hover:text-deepBlue hover:bg-paleBlue font-bold p-2">{menu.text}</a>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay untuk menutup sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Tab Menu di Bawah Header */}
      <nav className="w-[375px] h-[51px] sm:w-[1440px] sm:h-[68px] bg-white shadow-md overflow-x-auto">
        <div className="container mx-auto flex flex-nowrap justify-start space-x-2 py-2 sm:py-4">
      {[
        'Belum Bayar',
        'Berhasil (Belum Dikerjakan)',
        'Selesai (Sudah Dikerjakan)',
        'Tidak Berhasil'
      ].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-lg px-4 pb-2 text-xs sm:text-lg ${
            activeTab === tab ? 'text-[#0B61AA] border-b-4 border-[#0B61AA]' : 'text-gray-500'
          } hover:text-[#0B61AA]`}
        >
          {formatStatus(tab)} {/* Hilangkan teks dalam kurung untuk tampilan tab */}
        </button>
      ))}

        </div>
      </nav>

      {/* Konten Berdasarkan Tab yang Aktif */}
      <div className="container mx-auto p-4 space-y-4">
        {getDataByTab().map((item) => (
          <div
            key={item.id}
            className="w-full sm:w-[1374px] bg-[#F3F3F3] shadow-md p-4 flex rounded-lg"
          >
            {/* Gambar Tes dengan Kategori dan Jumlah Orang */}
            <div className="bg-white relative w-[112px] h-[140px] sm:w-[150px] sm:h-[168px] rounded-lg shadow-md flex flex-col items-center justify-center">
              {/* Icon mata dan jumlah orang */}
              <div className="absolute top-1 left-2 flex items-center space-x-1 text-sm text-gray-500">
                <FaEye className="w-4 h-4" />
                <span>{item.historyCount}</span>
              </div>
              {/* Gambar */}
              <img
                src={item.image || undefined}  // Gunakan gambar jika ada, atau undefined jika tidak ada
                alt={item.test.title}
                className="w-[70px] h-[80px] sm:w-[100px] sm:h-[120px] object-contain"
                onError={(e) => {
                  e.target.onerror = null;  // Menghindari infinite loop jika gambar error
                  e.target.src = "";  // Mengosongkan src sehingga akan menampilkan ikon
                }}
              />

              {!item.image && (
                <SlBookOpen className="w-[70px] h-[80px] sm:w-[100px] sm:h-[120px] text-gray-500" />
              )}
              {/* Kategori Tes */}
              <div className="text-center mt-2 text-sm font-semibold text-[#0B61AA]">
                Try Out {item.test.category}
              </div>
            </div>


            {/* Detail Tes */}
            <div className="ml-4 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-[#0B61AA]">{item.test.title}</h3>
              <p className="text-xs sm:text-sm text-[#0B61AA]">
                Prediksi Kemiripan {item.test.similarity}%
              </p>
              <div className="flex items-center mt-4 pt-4">
              {item.test.author?.photo ? (
                <img
                  src={item.test.author?.photo}
                  alt="Foto Pembuat"
                  className="w-10 h-10 rounded-full mr-2"
                  onError={(e) => {
                    e.target.onerror = null; // Menghindari infinite loop jika gambar error
                    e.target.src = ""; // Mengosongkan src, akan men-trigger kondisi untuk menampilkan ikon
                  }}
                />
              ) : (
                <IoPersonCircle className="h-10 w-10 text-gray-500 cursor-pointer mb-2" />
              )}
              <p className="font-bold">{item.test.author?.name || 'Nama tidak tersedia'}</p>
                <div>
                  <p className="text-xs sm:text-sm">Dibuat Oleh:</p>
                  <strong className="text-xs sm:text-sm">{item.test.author?.name || 'Penulis Tidak Diketahui'}</strong>
                </div>
              </div>
              {/* Tautan Aksi */}
              <div className="flex justify-end mt-4 space-x-2">
                {item.customStatus === 'Belum Bayar' && (
                  <Link href="/bayar" className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg">
                    Bayar
                  </Link>
                )}
                {item.customStatus === 'Berhasil (Belum Dikerjakan)' && (
                  <Link href="/mulai" className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg">
                    Mulai
                  </Link>
                )}
                {item.customStatus === 'Selesai (Sudah Dikerjakan)' && (
                  <Link href="/score" className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg">
                    Score
                  </Link>
                )}
                {item.customStatus === 'Tidak Berhasil' && (
                  <Link href="/beli-lagi" className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg">
                    Beli Lagi
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
