'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import jwtDecode from 'jwt-decode';
import { IoPersonCircle } from "react-icons/io5";


export default function Pemrograman() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const {resultId} = useParams();
  const [workTime, setWorkTime] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [testId, setTestId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [userData, setUserData] = useState({
    
    score: 0, // score sebagai angka
    userName: '',
    testTitle: '',
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  




  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        console.log('User ID set:', decodedToken.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!resultId) return;  // Pastikan resultId tersedia sebelum melakukan apa pun

    // Ambil workTime dari localStorage berdasarkan resultId
    const savedWorkTime = localStorage.getItem(`workTime_${resultId}`);
    if (savedWorkTime) {
      setWorkTime(parseInt(savedWorkTime)); // Konversi ke angka dan simpan di state
    }
  }, [resultId]); // Efek ini dijalankan ulang setiap kali resultId berubah

  useEffect(() => {
    const fetchTestDataAndLeaderboard = async () => {
      if (!resultId) return;

      setIsLoadingLeaderboard(true);
      setLeaderboardError(null);

      try {
        // Fetch test result data
        const resultResponse = await fetch(`http://localhost:2000/api/tests/test-result/${resultId}`);
        if (!resultResponse.ok) {
          throw new Error('Failed to fetch test result details');
        }
        const resultData = await resultResponse.json();
        
        // Assuming the test result data contains a field that can be used to identify the test
        // This could be 'testId', 'testTitle', or any unique identifier for the test
        const fetchedTestId = resultData.testId || resultData.testTitle;
        setTestId(fetchedTestId);

        if (!fetchedTestId) {
          throw new Error('Could not determine test identifier from result data');
        }

        // Now fetch leaderboard data using the fetched test identifier
        const leaderboardResponse = await fetch(`http://localhost:2000/api/leaderboard/${fetchedTestId}`);
        if (!leaderboardResponse.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboardData(leaderboardData.data);

        const userRankData = leaderboardData.data.find(item => item.userId === userId);
        console.log('User rank data:', userRankData);
        if (userRankData) {
          setUserRank(userRankData.ranking);
          console.log('User rank set:', userRankData.ranking);
        } else {
          console.log('User rank not found in leaderboard data');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setLeaderboardError(error.message);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    fetchTestDataAndLeaderboard();
  }, [resultId, userId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Menghitung menit
    const remainingSeconds = seconds % 60;    // Menghitung detik sisa
    return `${minutes} menit ${remainingSeconds} detik`;
  };


  const user = [
    {
      nama: "Ardhi",
      judul: "TRY OUT UTBK 2025#1",
      date: "15 - November - 2024",
      correct: "25",
      wrong: "120",
      time: "42:26",
      total: 900,
      maxTotal: 1000,
      rank: 114,
    }
  ];
  

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Fetch data from your API endpoint
        const response = await fetch(`http://localhost:2000/api/tests/test-result/${resultId}`); 
        const data = await response.json();

        setUserData({
          score: data.score,
          userName: data.userName,
          testTitle: data.testTitle,
          correctAnswers: data.correctAnswers,
          wrongAnswers: data.wrongAnswers,
        });
      } catch (error) {
        console.error('Error fetching test result:', error);
      }
    };

    fetchTestData();
  }, [resultId]);

  const getProgressWidth = () => {
    const maxScore = 100; // Anggap score maksimal adalah 100
    const percentage = (userData.score / maxScore) * 100;
    return `${Math.min(percentage , 100)}% `; // Batasan maksimal lebar 100%
  };


  const closeModal = () => setModalOpen(false);

  const handleRatingClick = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    console.log("Feedback:", feedback);
  
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error("Token tidak ditemukan. Silakan login kembali.");
      // Tambahkan logika untuk menangani kasus ketika token tidak ada, misalnya redirect ke halaman login
      return;
    }
  
    try {
      const response = await fetch('http://localhost:2000/api/testimonies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Tambahkan token ke header
        },
        body: JSON.stringify({
          comment: feedback,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Testimoni berhasil dikirim:", data);
        // Tambahkan logika untuk menangani respons sukses, misalnya menampilkan pesan sukses
      } else {
        const errorData = await response.json();
        console.error("Gagal mengirim testimoni:", errorData);
        // Tambahkan logika untuk menangani respons error, misalnya menampilkan pesan error
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengirim testimoni:", error);
      // Tambahkan logika untuk menangani error jaringan atau lainnya
    }
  
    // Tutup modal setelah mengirim feedback
    closeModal();
  
    // Reset feedback setelah pengiriman
    setFeedback("");
  };

  const Modal = () => (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
      onClick={closeModal} // Tambahkan event handler untuk menutup modal
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat klik di dalam modal
      >
        {/* <h2 className="text-lg font-semibold mb-4 text-center">Seberapa Puas Anda dengan Layanan Kami?</h2> */}
  
        {/* Star Rating */}
        {/* <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => handleRatingClick(star)}
              xmlns="http://www.w3.org/2000/svg"
              fill={rating >= star ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`w-8 h-8 cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-400"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </div> */}
  
        {/* Feedback Input */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Apa yang Bisa Kami Tingkatkan?
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          rows="3"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Masukkan masukan Anda di sini"
        ></textarea>
  
        {/* Submit Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={feedback === ""}
        >
          Kirim
        </button>
      </div>
    </div>
  );
  
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`http://localhost:2000/api/discussions/${resultId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `pembahasan-${resultId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Tampilkan pesan error ke pengguna
    }
  };

  return (
    <>
      <header className="relative flex w-full bg-deepBlue text-white p-3 items-center z-50">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center p-2 lg:ml-9">
            <Link href="/">
              <img 
                src="/images/etamtest.png" 
                alt="EtamTest" 
                className="lg:h-14 h-8 mr-3 object-contain" 
              />
            </Link> 
          </div>

          <div className="relative flex inline-block items-center">
            <div className="mx-auto">
              <h5 className="text-xl lg:text-3xl font-bold font-bodoni lg:mr-8">Hasil Tes</h5>
              <nav className="mt-0 lg:mt-1">
                <ol className="list-reset flex space-x-2">
                  <li>
                    <Link href="/user/dashboard" legacyBehavior>
                      <a className="text-[0.6rem] lg:text-sm hover:text-orange font-poppins font-bold">Home</a>
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/CPNS" legacyBehavior>
                      <a className="text-[0.6rem] lg:text-sm hover:text-orange font-poppins font-bold">Hasil Tes</a>
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
            <div className='hidden lg:block'>
            <IoPersonCircle
              className="h-14 w-14 cursor-pointer mr-3 text-current text-white"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            />

              {/* Dropdown */}
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-35 bg-white rounded-lg shadow-lg z-10 p-1
                              before:content-[''] before:absolute before:-top-4 before:right-8 before:border-8 
                              before:border-transparent before:border-b-white"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link legacyBehavior href="/profile-edit">
                    <a className="block px-4 py-1 text-deepBlue text-sm  hover:bg-deepBlue hover:text-white rounded-md border-abumuda">
                      Ubah Profil
                    </a>
                  </Link>
                  <Link legacyBehavior href="/logout">
                    <a className="block px-4 py-1 text-deepBlue text-sm  hover:bg-deepBlue hover:text-white rounded-md">
                      Logout
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Apa yang Bisa Kami Tingkatkan?
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Masukkan masukan Anda di sini"
              required
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Kirim Feedback
            </button>
          </div>
        </div>
      )}

      {/* judul hasil tes */}
      {user.map((user, index) => (
        <div className='text-center font-poppins font-bold text-deepBlue p-5'> 
          <h2 className="text-2xl font-bold ">Halo {userData.userName}!!</h2>
            <p>
              Hasil {userData.testTitle}
            </p>
            <p>
            <span className="font-semibold">{user.date}</span>
            </p>
        </div>
      ))}
    
      <section className='bg-white p-8 text-bold'>
        <div>
          {/* Main Content */}
          <main className="bg-abumuda p-1 pt-0 rounded-lg shadow-lg mt-0">

            {/* Score Progress Bar */}
            <div className='mb-4 bg-deepBlue p-5 lg:p-8 rounded-lg'>
              {user.map((user,index)=> (
                <div className="w-full bg-white h-8 rounded-full overflow-hidden ">
                  <div
                    className="bg-paleBlue h-8 flex relative items-center justify-center text-deepBlue font-bold text-lg transition-all duration-300"
                    style={{ width: getProgressWidth() }} // width sesuai dengan persentase
                  > 
                    <div className='absolute right-0 bg-white text-deepBlue p-2 border border-grey shadow '>
                    {userData.score} {/* Menampilkan nilai total */}
                    </div>
                  </div>
                </div>
                
              ))}
            </div>

            {/* Flex container for Performance and Top Score */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-0 text-center">
              {/* Performance Section */}
              {user.map((user, index) => (
                <div className="bg-abumuda p-6 flex-1 flex flex-col items-center pr-5 pb-8">
                  <h3 className="text-4xl font-semibold text-deepBlue">Performa</h3>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex text-sm lg:text-2xl items-center text-black block font-semibold bg-white p-2 pr-8 rounded-lg">
                      <ul>
                        <li><i className=" fa-solid fa-xmark text-red-500"></i> {userData.wrongAnswers} </li>
                        <li>Salah</li>
                      </ul>
                    </div>
                    <div className="text-black text-sm lg:text-2xl font-semibold bg-white p-2 pr-8 rounded-lg ">
                      <ul>
                        <li><i className=" fa-solid fa-check text-green"></i> {userData.correctAnswers} </li>
                        <li>Benar</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-black mt-2 flex items-center gap-4">
                    <div className="text-sm lg:text-2xl bg-white p-2 font-semibold rounded-lg">
                      <ul>
                        <li><i className="fa-solid fa-clock text-grey "></i> {formatTime(workTime)} </li>
                        <li> Waktu</li>
                      </ul>
                    </div>
                    {/* <div className="text-sm lg:text-2xl bg-white p-2 font-semibold rounded-lg">
                      <ul>
                      <li>{userRank !== null ? userRank : 'N/A'}</li>
                        <li>Peringkat</li>
                      </ul>
                    </div> */}
                    <div className="text-sm lg:text-2xl font-semibold bg-white px-5 p-2 rounded-lg">
                      <ul>
                        <li>{userData.score} </li>
                        <li>Nilai</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex space-x-3 group-hover:opacity-100 transition-opacity duration-300 z-30 pt-4">
                  <a onClick={handleDownloadPDF} className="bg-white border border-deepBlue text-[0.5rem] lg:text-lg text-deepBlue text-bold px-2  lg:px-2 py-2 rounded-full inline-block hover:bg-orange hover:text-deepBlue cursor-pointer">
                    Unduh Pembahasan Soal
                  </a>
                  <a href= {`/user/topscore/${testId}`} className="bg-paleBlue border border-deepBlue text-[0.5rem] lg:text-lg text-deepBlue text-bold px-6  lg:px-7 py-2 rounded-full inline-block hover:bg-orange hover:text-deepBlue">
                    Lihat Top Score
                  </a>
                </div>
                </div>
                
              ))}

              {/* Top Score Section */}
              <div className="bg-white hidden lg:block p-2 flex-1 rounded-lg shadow-md">
                <h2 className="text-center text-2xl text-[#0B61AA] font-bold mb-6">Top Score</h2>
                <div className="overflow-auto">
                  <table className="w-full text-left table-auto border-collapse">
                    <thead className="bg-[#0B61AA] text-white">
                      <tr>
                        <th className="px-2 py-1">Rangking</th>
                        <th className="px-2 py-1">Nama</th>
                        <th className="px-2 py-1">Nilai Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.slice(0, 3).map((entry, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                          <td className="border px-4 py-2 text-center">{entry.ranking}</td>
                          <td className="border px-4 py-2">{entry.name}</td>
                          <td className="border px-4 py-2 text-center">{entry.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
            
          </main>
            
        </div>
      </section>
    </>
  );
}

