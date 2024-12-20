'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiEye} from 'react-icons/fi';
import { IoMenu } from 'react-icons/io5';
import { TbFileSad } from "react-icons/tb";
import { IoPersonCircle } from "react-icons/io5";
import { useParams } from 'next/navigation';
import dotenv from 'dotenv';
dotenv.config();
const URL = process.env.NEXT_PUBLIC_API_URL;


export default function RiwayatTransaksiHeader() {
  const [activeTab, setActiveTab] = useState('Belum Bayar');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState([null]);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { testId } = useParams();
  const [userId, setUserId] = useState(null);

  const menus = [ 
    { href: '/user/dashboard', text: "Home" },
    { href: '/user/favorite', text: "Favorit" },
    { href: '/user/riwayat-transaksi', text: "Transaksi" },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); 
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
        const response = await fetch(`https://${URL}/user/profile`, {
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

  // Ambil token dari localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  if (loading && !error) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Ambil data pengguna berdasarkan token
  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchTransactions();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://${URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData); // Menyimpan data pengguna yang login
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!token) {
      console.error('Token tidak tersedia');
      return;
    }

    try {
      const response = await fetch(`https://${URL}/api/riwayat-transaksi`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const formatStatus = (status) => {
    return status.replace(/\s*\(.*?\)\s*/g, '').trim();
  };

  const getDataByTab = () => {
    return transactions.filter((item) => {
      const itemStatus = item.customStatus || '';
      return itemStatus.includes(activeTab);
    });
  };

  // Logout function
const handleLogout = async () => {
  try {
      const response = await fetch(`https://${URL}/auth/logout`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Sertakan token jika perlu
          },
      });
      if (!response.ok) {
          throw new Error('Logout failed');
      }

      localStorage.clear();

      window.location.href = '/auth/login';
  } catch (error) {
      console.error('Error during logout:', error);
  }
};

  return (
    <>
      {/* Sidebar ketika tampilan mobile */}
      <aside className={`fixed top-16 pt-6 left-0 w-64 bg-white h-full transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden z-40`}>
        <ul className="p-4 space-y-4 text-deepblue round-lg">
          <div className="flex flex-col items-center">
          {userData?.userPhoto ? (
              <img 
                src={userData.userPhoto} // Gunakan foto dari userData jika ada
                alt="profile" 
                className="h-14 w-14 cursor-pointer mb-2 rounded-full object-cover" 
              />
            ) : (
              <IoPersonCircle 
                className="h-14 w-14 text-gray-500 cursor-pointer mb-2 rounded-full" // Fallback ke ikon IoPersonCircle
              />
            )}
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

      {/* Overlay Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          onClick={toggleSidebar} // Klik overlay menutup sidebar
        ></div>
      )}

      {/* Overlay Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          onClick={toggleSidebar} // Klik overlay menutup sidebar
        ></div>
      )}
      
      {/* Header Utama */}
      <header className="sticky p-4 bg-deepBlue top-0 left-0 right-0 text-white w-full font-poppins lg:p-3 z-50">
        <div className="mx-auto flex justify-between items-center font-poppins max-w-full">
          <div className="flex justify-between">
          <button onClick={toggleSidebar}>
            <IoMenu className="h-[30px] w-8 h-8 lg:hidden"/> {/* Gunakan IoMenu sebagai ikon */}
          </button>

            <button onClick={toggleSidebar}>
              <img
                src="/images/etamtest.png"
                alt="Etamtest"
                className="h-[30px] lg:h-10 sm:h-9 pl-3"
              />
            </button>
          </div>

          <div className="flex items-center space-x-4">
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
            <div className="relative inline-block">
              {userData?.userPhoto ? (
                <img
                  src={userData.userPhoto}
                  alt="User Profile"
                  className="h-14 w-14 rounded-full cursor-pointer mr-5 object-cover"
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


      {menuOpen && (
        <div className="fixed insert-0 z-40 flex">
          <div className="flex-1 bg-black opacity-50 z-30" onClick={toggleMenu}></div>
        </div>
      )}

      <nav className="w-full h-[51px] sm:h-[68px] bg-white shadow-md overflow-x-hidden">
        <div className="container mx-auto flex flex-nowrap justify-start space-x-2 py-2 sm:py-2">
          {['Belum Bayar', 'Berhasil (Belum Dikerjakan)', 'Selesai (Sudah Dikerjakan)', 'Tidak Berhasil'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg px-4 pb-2 text-xs sm:text-lg ${activeTab === tab ? 'text-[#0B61AA] border-b-4 border-[#0B61AA]' : 'text-gray-500'} hover:text-[#0B61AA]`}
            >
              {formatStatus(tab)}
            </button>
          ))}
        </div>
      </nav>

      <div className="container mx-auto p-4 space-y-4 overflow-y-auto h-screen">
  {getDataByTab().length === 0 ? (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 h-screen">
      <TbFileSad className="text-8xl mb-4" />
      <p className="text-lg font-semibold">Tidak ada transaksi </p>
      <p className="text-sm mt-2">
        Anda belum memiliki transaksi. Silakan lakukan transaksi terlebih dahulu.
      </p>
    </div>
  ) : (
    getDataByTab().map((item) => (
      <div
        key={item.id}
        className="w-full bg-[#F3F3F3] shadow-md p-4 flex rounded-lg"
      >
        <div className="bg-white relative w-[112px] h-[140px] sm:w-[150px] sm:h-[168px] rounded-lg shadow-md flex flex-col items-center justify-center">
          <div className="absolute top-1 left-2 flex items-center space-x-1 text-sm text-gray-500">
            <FiEye className="w-4 h-4 text-gray-500" />
            <span>{item.historyCount}</span>
          </div>
          <img
            src={item.image || '/images/tes.png'}
            alt={item.test.title}
            className="w-[70px] h-[80px] sm:w-[100px] sm:h-[120px] object-contain"
          />
          <div className="text-center mt-2 text-sm font-semibold text-[#0B61AA]">
            Try Out {item.test.category}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-[#0B61AA]">{item.test.title}</h3>
          <p className="text-xs sm:text-sm text-[#0B61AA]">Prediksi Kemiripan {item.test.similarity}%</p>
          <div className="flex items-center mt-4 pt-4">
            {item.test.author?.photo ? (
              <img
                src={item.test.author?.photo}
                alt="Foto Author"
                className="w-10 h-10 rounded-full mr-2"
              />
            ) : (
              <IoPersonCircle className="w-6 h-6 text-gray-500 mr-2" />
            )}
            <div>
              <p className="text-xs sm:text-sm">Dibuat Oleh:</p>
              <strong className="text-xs sm:text-sm">{item.test.author?.name || 'Penulis Tidak Diketahui'}</strong>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            {item.customStatus === 'Belum Bayar' && (
              <Link
                href={`/tes/payment/${item.testId}`}
                className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg"
              >
                Bayar
              </Link>
            )}
            {item.customStatus === 'Berhasil (Belum Dikerjakan)' && (
              <Link
                href={`/tes/detailsoal/${item.testId}`}
                className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg"
              >
                Mulai
              </Link>
            )}
            {item.customStatus === 'Selesai (Sudah Dikerjakan)' && (
              <Link
                href={`/user/topscore/${item.testId}`}
                className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg"
              >
                Score
              </Link>
            )}
            {(item.customStatus === 'Tidak Berhasil (Gagal)' || item.customStatus === 'Tidak Berhasil (Expired)') && (
              <Link
                href="/user/dashboard"
                className="bg-[#0B61AA] text-white text-sm sm:text-lg px-4 py-2 rounded-lg"
              >
                Beli Lagi
              </Link>
            )}
          </div>
        </div>
      </div>
    ))
  )}
</div>

    </>
  );
}
