"use client"; 
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import axios from 'axios';
import { IoPersonCircle } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";


const VerifikasiAuthor2 = () => {
  const [data, setData] = useState([]); // State for backend data
  const [filter, setFilter] = useState("semua"); // State for filtering
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errorUser, setErrorUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [token, setToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredData = () => {
    let result = authors;
  
    // Filter berdasarkan status
    if (filter === "aktif") {
      result = result.filter((item) => item.isApproved);
    } else if (filter === "nonaktif") {
      result = result.filter((item) => !item.isApproved);
    }
  
    // Filter berdasarkan pencarian
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.email.toLowerCase().includes(searchQuery)
      );
    }
  
    return result;
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

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:2000/author/get-author');
        if (response.data && response.data.data) {
          setAuthors(response.data.data);
        } else {
          throw new Error('Data tidak sesuai format yang diharapkan');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat mengambil data author');
        console.error('Error fetching authors:', err);
      } finally {
        setLoading(false);
      }
    };

  fetchAuthors();
  }, []);

  const getStatusCount = () => {
    let aktif = 0;
    let nonaktif = 0;
  
    authors.forEach(item => {
      if (item.isApproved) aktif++;
      else nonaktif++;
    });
  
    return { aktif, nonaktif, total: authors.length };
  };
  

const { aktif, nonaktif, total } = getStatusCount();
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


const handleStatusChange = async (id, newStatus) => {
  try {
    // Implementasikan logika untuk mengubah status author
    // Misalnya, panggil API untuk mengupdate status
    await axios.patch(`http://localhost:2000/author/edit-author/${id}/status`, { isApproved: newStatus === 'Aktif' });
    
    // Update state lokal
    setAuthors(authors.map(author => 
      author.id === id ? { ...author, isApproved: newStatus === 'Aktif' } : author
    ));
  } catch (error) {
    console.error('Error updating author status:', error);
    // Handle error (e.g., show error message to user)
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
          <div className="flex flex-col flex-1">
            <nav className="bg-[#0B61AA] p-4 flex justify-center items-center">
              <div className="flex items-center pr-5">
                <span className="text-white text-[32px] font-poppins font-semibold mr-3">Data Author</span>
              </div>
            </nav>

            {/* Search Bar Section */}
            <div className="flex items-center justify-between px-8 py-5 bg-white gap-4 font-poppins">
              <div className="flex justify-end items-center w-2/3 max-w-lg bg-white px-4 py-2 rounded-full shadow">
                <FaSearch className="h-5 w-5 text-gray-600" />
                <input
                  type="text"
                  placeholder="Cari Berdasarkan Nama atau Email"
                  className="flex-1 border-none outline-none ml-4 text-lg"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="flex gap-4 items-center font-poppins">
              <button
                  onClick={() => setFilter("semua")}
                  className={`flex items-center justify-between w-[130px] px-4 py-2 text-black rounded-full ${filter === "semua" ? "bg-paleBlue" : "bg-abumuda"}`}
                >
                  <span>Semua</span>
                  <span className="text-red-600 font-semibold">{total}</span>
                </button>

                <button
                  onClick={() => setFilter("aktif")}
                  className={`flex items-center justify-between w-[130px] px-4 py-2 text-black rounded-full ${filter === "aktif" ? "bg-paleBlue" : "bg-abumuda"}`}
                >
                  <span>Aktif</span>
                  <span className="text-red-600 font-semibold">{aktif}</span>
                </button>

                <button
                  onClick={() => setFilter("nonaktif")}
                  className={`flex items-center justify-between  w-[130px] px-4 py-2 text-black rounded-full ${filter === "nonaktif" ? "bg-paleBlue" : "bg-abumuda"}`}
                >
                  <span>Nonaktif</span>
                  <span className="text-red-600 font-semibold">{nonaktif}</span>
                </button>

              </div>

            </div>

            {/* Table Section */}
            <div className="px-8 py-5 overflow-x-auto font-poppins">
              <table className="min-w-full border-collapse bg-white shadow-lg">
                <thead>
                  <tr className="bg-powderBlue text-black">
                    <th className="border p-2 sm:p-3">Tanggal</th>
                    <th className="border p-2 sm:p-3">ID</th>
                    <th className="border p-2 sm:p-3">Nama</th>
                    <th className="border p-2 sm:p-3">Email</th>
                    <th className="border p-2 sm:p-3">Tes Diterbitkan</th>
                    <th className="border p-2 sm:p-3">Status Akun</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData().map((author, rowIndex) => (
                    <tr key={author.id}>
                      <td className="border p-2 sm:p-3 text-center">{new Date(author.createdAt).toLocaleDateString()}</td>
                      <td className="border p-2 sm:p-3 text-center">{author.id}</td>
                      <td className="border p-2 sm:p-3 text-center">{author.name}</td>
                      <td className="border p-2 sm:p-3 text-center">{author.email}</td>
                      <td className="border p-2 sm:p-3 text-center">{author.publishedTestCount}</td>
                      <td className="border p-2 sm:p-3 text-center">
                        <select
                          value={author.isApproved ? 'Aktif' : 'Nonaktif'}
                          onChange={(e) => handleStatusChange(author.id, e.target.value)}
                          className={`inline-block w-[151px] px-2 py-1 rounded-full text-white ${author.isApproved ? 'bg-[#228804]' : 'bg-[#CF0000]'}`}
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Nonaktif">Nonaktif</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
      </div>
    </>
  );
};

export default VerifikasiAuthor2;
