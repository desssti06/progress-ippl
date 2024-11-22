"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FaUserTie } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";


const VerifikasiAuthor1 = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errorUser, setErrorUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [token, setToken] = useState('');

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

      window.location.href = '/auth/login-admin';
  } catch (error) {
      console.error('Error during logout:', error);
  }
};

  return (
    <>
      
      <div className="flex h-screen ">
          <div className="flex h-screen">
            <div className="w-[131px]  lg:w-[350px] bg-[#78AED6] p-4 flex flex-col items-center">
              <div className="mb-5 flex items-center justify-center w-full">
                <img src="/images/etamtest.png" alt="Etam Test Logo" className="object-contain lg:h-[50px]" />
              </div>
              <div className="mb-5 flex items-center">
               
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
                      <Link legacyBehavior href={`/admin/edit-profile/${userId}`}>
                        <a className="block px-4 py-1 text-deepBlue text-sm text-gray-700 hover:bg-deepBlue hover:text-white rounded-md border-abumuda">
                          Ubah Profil
                        </a>
                      </Link>
                      <Link legacyBehavior href="/auth/login-admin">
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
              
                <div className="ml-3 text-white">
                  <h3 className="font-poppins font-bold text-basic text-white text-[10px] lg:text-[24px] ">{userData?.name}</h3>
                  <p className="text-[18px] font-poppins m-0">Administrator</p>
                </div>
              </div>
              <div className="justify-start w-full">
                <Link href="/admin/dashboard">
                  <button className="block font-poppins font-bold w-full py-2 px-2 hover:bg-deepBlue text-white rounded-full text-sm lg:text-lg text-left">
                    Home
                  </button>
                </Link>
                <Link href="/admin/kelola-author"> 
                  <button className="block font-poppins font-bold w-full py-2 px-2 bg-deepBlue bg-opacity-50  hover:bg-deepBlue text-white rounded-full text-sm lg:text-lg text-left">
                    Kelola Author
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          
          <div className="flex-1 flex flex-col min-h-screen">
            <nav className="bg-[#0B61AA] p-4 flex justify-end items-center">
              <div className="flex items-center pr-5">
                <span className="text-white font-poppins font-bold mr-3">Hai, {userData?.name}!</span>
              </div>
            </nav>

            {/* Kontainer utama untuk background putih */}
            <div className="flex-1 flex justify-center items-center bg-white">
              <div className="block lg:flex justify-center rounded-lg items-center bg-[#F3F3F3] lg:w-[837px] w-[210px] h-[440px] lg:h-[463px]">
                  {/* Box 1 */}
                  <div className="lg:w-[190px] lg:h-[200px] text-center p-3 bg-paleBlue hover:bg-powderBlue shadow-lg m-3 rounded-lg flex flex-col justify-center items-center text-[#0B61AA] text-lg font-bold">
                    <Link legacyBehavior href="/admin/kelola-author/data-author" passHref>
                      <a className="w-full h-full flex flex-col justify-center items-center animate-flyIn">
                        <FaUserTie className="text-8xl text-deepblue object-cover" />
                        <p className="mt-3 lg:text-basic">Data Author</p>
                      </a>
                    </Link>
                  </div>

                  {/* Box 2 */}
                  <div className="lg:w-[190px] lg:h-[200px] justify-center text-center p-3 bg-paleBlue  shadow-lg hover:bg-powderBlue m-3 rounded-lg flex flex-col items-center text-[#0B61AA] text-lg font-bold">
                    <Link legacyBehavior href="/admin/kelola-author/verifikasi-author" passHref>
                      <a className="w-full h-full flex flex-col justify-center items-center animate-flyIn">
                      <FaUserTie className="text-8xl text-deepBlue object-cover" />
                        <p className="mt-3 lg:text-basic">Verifikasi Author</p>
                      </a>
                    </Link>
                  </div>
              </div>
                                                                              
            </div>
          </div>

      </div> 
     
    </>
  );
};

export default VerifikasiAuthor1 ;
