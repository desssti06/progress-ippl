'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoPersonCircle } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { SlBookOpen } from "react-icons/sl";
import { FaEye } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import jwtDecode from 'jwt-decode';

export default function Home() {
  const [popularTests, setPopularTests] = useState([]);
  const [freeTests, setFreeTests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState (['']);
  const [loading, setLoading] = useState([true]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState([null]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [authorTests, setAuthorTests] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

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
  
  
  useEffect(() => {
    const fetchAuthorTests = async () => {
      try {
        setLoading(true);
        // Ambil token dari localStorage atau dari state management Anda
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:2000/api/tests/author-tests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAuthorTests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch author tests');
        setLoading(false);
        console.error('Error fetching author tests:', err);
      }
    };
  
    fetchAuthorTests();
  }, []);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:2000/author/author-data', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAuthorData([response.data]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch author data');
        setLoading(false);
        console.error('Error fetching author data:', err);
      }
    };
  
    fetchAuthorData();
  }, []);


  const handleSearch = async (e) => {
    
    e.preventDefault();
    if (!searchQuery) return;
  
    try {
      const response = await fetch(`http://localhost:2000/dashboard/search-tests?title=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search tests');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching tests:', error);
      setError(error.message);
    }
  };


  // Pindahkan semua state ke dalam komponen
  const [populercurrentIndex, populersetCurrentIndex] = useState(0);
  const [populeritemsToShow, setPopulerItemsToShow] = useState(2);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setPopulerItemsToShow(4); // Tampilkan 4 item di desktop
      } else {
        setPopulerItemsToShow(2); // Tampilkan 2 item di mobile
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const populernextSlide = () => {
    if (populercurrentIndex < authorTests.length - populeritemsToShow) {
      populersetCurrentIndex(populercurrentIndex + 1);
    }
  };

  const populerprevSlide = () => {
    if (populercurrentIndex > 0) {
      populersetCurrentIndex(populercurrentIndex - 1);
    }
  };

  const [gratiscurrentIndex, gratissetCurrentIndex] = useState(0);
  const [gratisitemsToShow, setGratisItemsToShow] = useState(2);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setGratisItemsToShow(4);
      } else {
        setGratisItemsToShow(2);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const gratisnextSlide = () => {
    if (gratiscurrentIndex < authorTests.length - gratisitemsToShow) {
      gratissetCurrentIndex(gratiscurrentIndex + 1);
    }
  };

  const gratisprevSlide = () => {
    if (gratiscurrentIndex > 0) {
      gratissetCurrentIndex(gratiscurrentIndex - 1);
    }
  };

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Logout function
  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:2000/auth/logout', {
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
    
      <div className="flex flex-col h-screen font-poppin">
        {/* Header */}
        <header className="flex justify-end items-center bg-[#0B61AA] p-4">
          <div className="relative flex inline-block items-center ">
            <div className="mx-auto">
              <span className="text-xl text-white font-poppins font-bold mr-3">Hai, {userData?.name}</span>
            </div>
          {/* Profile */}
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
                <Link legacyBehavior href={`/author/edit-profile/${userId}`}>
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
        </header>
        
        <div className='flex flex-1'>
          {/* Sidebar */}
          <aside
            className="bg-[#78AED6] w-64 p-5 min-h-full fixed top-0 left-0"
          >
            <div className="text-white mb-5">
              <img src="/images/etamtest.png" alt="Logo" className="h-auto w-36" />
            </div>
          
            <nav>
              <ul className="space-y-3">
                <li className="text-white cursor-pointer bg-[#0B61AA] hover:bg-deepBlue bg-opacity-50 rounded-lg py-2 px-4 min-w-[200px]">
                  <Link legacyBehavior href="/author/dashboard">
                    <a> Home</a>
                  </Link>
                </li>
                <li className="text-white cursor-pointer py-2 px-4 hover:bg-deepBlue  rounded-lg">
                  <Link legacyBehavior href="/author/analisis-soal">
                    <a> Analisis Soal</a>
                  </Link>
                </li>
                <li className="text-white cursor-pointer py-2 px-4 hover:bg-deepBlue  rounded-lg">
                  <Link legacyBehavior href="/author/my-saldo">
                    <a> My Saldo</a>
                  </Link>
                </li>
              </ul>
            </nav>

          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white ml-64 overflow-y-auto">
            {/* Search Bar */}
            <div className="bg-gradient-to-r from-[#CAE6F9] to-[#0B61AA] p-12">
              <div className="container justify-between mt-10 lg:mt-4 lg:max-w-[610px] max-w-full ">
                  <form 
                  onSubmit={handleSearch} 
                  className="flex items-center p-1 rounded-2xl bg-white w-full font-poppins"
                >
                  <input 
                    type="text" 
                    placeholder="Cari Tes Soal" 
                    className="flex-grow p-1 lg:p-2  rounded-2xl focus:outline-none focus:ring-2 focus:ring-powderBlue font-poppins max-w-[130px] lg:max-w-[610px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="p-1 lg:p-2 text-deepBlue font-bold rounded-2xl hover:bg-gray-200 font-poppins "
                  >
                  <FaSearch className="text-xl" />
                  </button>
                </form>
              </div>
            </div>

            {/* Informasi Total Soal dan Peserta */}
        
            <div className="flex pr-4 gap-5 mt-4 ml-3 justify-between">
              <div className="flex pr-4 gap-5 mt-4 ml-3 ">
                <div className="bg-[#F3F3F3] px-3 py-1 max-w-auto justify-between item-center rounded-[15px] shadow-lg shadow-lg text-[#0B61AA]">
                  <span>Total Soal</span>
                  <span className="font-semibold ml-4">{authorData?.[0]?.totalSoal || 0}</span>

                </div>
                <div className="bg-[#F3F3F3] px-3 py-1 max-w-auto justify-between item-center rounded-[15px]  shadow-lg text-[#0B61AA]">
                  <span>Total Peserta</span> 
                  <span className="font-semibold ml-2">{authorData?.[0]?.totalPeserta || 0}</span>
                </div>
              </div>
              
              <Link href='/author/buattes'>
                <button className="bg-deepBlue hover:bg-powderBlue shadow-lg hover:text-deepBlue text-white py-2 mt-2 px-5 p-5 rounded-[10px]">
                + NEW
                </button>
              </Link>
            </div>
          
            {/* Bagian Paling Populer */}
            <section className="mx-auto p-5 font-poppins relative">
              <div className="mx-auto mt-5 font-bold font-poppins text-deepBlue">
                Terbaru
                {/* Container untuk kategori, menambahkan grid layout yang konsisten */}
                <div className=" mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {authorTests.slice(populercurrentIndex, populercurrentIndex + populeritemsToShow).map((test) => (
                    <div className="bg-abumuda shadow-lg p-1 relative group">                        
                        <div className="flex justify-between items-center z-10">
                          <div className="flex items-center space-x-2 font-bold text-deepBlue">
                          <FaEye className="text-xs lg:text-base object-contain" /> 
                            <span className="text-[0.6rem] lg:text-sm font-poppins">{test.history}</span>
                          </div>
                        </div>

                        <div className="flex justify-center mt-2 lg:mt-4 ">
                          <SlBookOpen className="text-4xl lg:text-[80px] object-contain" />
                        </div>

                        <div className="flex justify-center mt-2 lg:mt-4 text-deepBlue ">
                          <h3 className="text-center text-[0.8rem] lg:text-lg font-bold mt-0 lg:mt-2 font-poppins">{test.kategori}</h3>
                        </div>

                        <div className="bg-deepBlue text-white p-1 lg:p-2  mt-4 relative z-20 ">
                          <div className="flex items-center space-x-2 justify-between">
                            <h3 className="text-left text-[0.625rem] lg:text-base font-bold mt-2">{test.judul}</h3>
                          </div>

                          <p className="text-left text-[0.5rem] lg:text-sm leading-relaxed">{test.prediksi_kemiripan}</p>
                          <p className="text-[0.4rem] lg:text-xs leading-relaxed">Dibuat Oleh:</p>

                          <div className="flex justify-between space-x-2 leading-relaxed mt-1">
                            <div className="flex text-left space-x-1 lg:space-x-4">
                              <img src={test.authorProfile} alt= {userData?.name}  className="h-16 w-16 rounded-full object-cover" />
                              <span className="text-[0.375rem] lg:text-sm font-semibold">{test.author}</span>
                            </div>
                            <span className="text-[0.375rem] lg:text-sm font-semibold">
                              {test.price === 0 ? (
                                'Gratis'
                              ) : (
                                <IoIosLock className="text-sm lg:text-sm inline-block object-contain" />
                              )}
                            </span>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>

                {/* Tombol panah kiri */}
                <button
                  onClick={populerprevSlide}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${populercurrentIndex === 0 ? 'hidden' : ''}`}
                >
                  &#10094;
                </button>

                {/* Tombol panah kanan */}
                <button
                  onClick={populernextSlide}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${populercurrentIndex >= authorTests.length - populeritemsToShow ? 'hidden' : ''}`}
                >
                  &#10095;
                </button>
              </div>
            </section>

            {/* Bagian Populer */}
            <section className="block mx-auto p-5 font-poppins relative">
              <div className="mx-auto mt-5 font-bold font-poppins text-deepBlue">
                Populer
                {/* Container untuk kategori, menambahkan grid layout yang konsisten */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                  {authorTests.slice(gratiscurrentIndex, gratiscurrentIndex + gratisitemsToShow).map((test) => (
                    <div key={test.id} className="bg-abumuda shadow-lg p-1 relative group">
                      
                      <div className="flex justify-between items-center z-10">
                        <div className="flex items-center space-x-2 font-bold text-deepBlue">
                          <FaEye className="text-xs lg:text-base object-contain" />
                          <span className="text-[0.6rem] lg:text-sm font-poppins">{test.views}</span>
                        </div>
                      </div>

                      <div className="flex justify-center mt-2 lg:mt-4 relative z-20 ">
                        <SlBookOpen alt={test.kategori} className="text-4xl lg:text-[80px] object-contain" />
                      </div>

                      <div className="flex justify-center mt-2 lg:mt-4 text-deepBlue relative z-20 ">
                        <h3 className="text-center text-[0.8rem] lg:text-lg font-bold mt-0 lg:mt-2 font-poppins">{test.kategori}</h3>
                      </div>

                      <div className="bg-deepBlue text-white p-1 lg:p-2  mt-4 relative z-20 ">
                        <div className="flex items-center space-x-2 justify-between">
                          <h3 className="text-left text-[0.625rem] lg:text-base font-bold mt-2">{test.judul}</h3>
                        </div>

                        <p className="text-left text-[0.5rem] lg:text-sm leading-relaxed">{test.prediksi_kemiripan}</p>
                        <p className="text-[0.4rem] lg:text-xs leading-relaxed">Dibuat Oleh:</p>

                        <div className="flex justify-between space-x-2 leading-relaxed mt-1">
                          <div className="flex text-left space-x-1 lg:space-x-4">
                            <img src={test.authorProfile} alt={test.kategori} className="h-3 lg:h-5 object-contain" />
                            <span className="text-[0.375rem] lg:text-sm font-semibold">{test.author}</span>
                          </div>
                          <span className="text-[0.375rem] lg:text-sm font-semibold">
                            {test.free ? 'Gratis' : <IoIosLock className="text-sm lg:text-sm inline-block object-contain" />}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tombol panah kiri */}
                <button
                  onClick={gratisprevSlide}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${gratiscurrentIndex === 0 ? 'hidden' : ''}`}
                >
                  &#10094;
                </button>

                {/* Tombol panah kanan */}
                <button
                  onClick={gratisnextSlide}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${gratiscurrentIndex >= authorTests.length - gratisitemsToShow ? 'hidden' : ''}`}
                >
                  &#10095;
                </button>
              </div>
            </section>
          </main>
        </div>
         
      </div>
    </>
  );
}

