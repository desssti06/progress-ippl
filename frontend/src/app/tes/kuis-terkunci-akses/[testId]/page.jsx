// halaman kuisterkunci
"use client";
import Link from "next/link";
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { FaLock } from "react-icons/fa";

const MengerjakanTes = () => {
  const totalQuestions = 40; // Pindahkan deklarasi totalQuestions ke atas
  const [selectedoption, setSelectedoption] = useState(null);
  const [currentoption, setCurrentoption] = useState(1);
  const [markedreview, setMarkedreview] = useState(
    Array(totalQuestions).fill(false)
  );
  const [isBlurred, setIsBlurred] = useState(true); // State to toggle blur
  const { testId } = useParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
  }, []);

  const handleoption = (option) => {
    setSelectedoption(option);
  };

  const handlenextquestion = () => {
    if (currentoption < totalQuestions) {
      setCurrentoption(currentoption + 1);
      setSelectedoption(null);
    }
  };

  const handleprevquestion = () => {
    if (currentoption > 1) {
      setCurrentoption(currentoption - 1);
      setSelectedoption(null);
    }
  };

  const handlemarkreview = () => {
    const updatedMarkedReview = [...markedreview];
    updatedMarkedReview[currentoption - 1] =
      !updatedMarkedReview[currentoption - 1]; // Toggle the current question review status
    setMarkedreview(updatedMarkedReview);
  };

  const handleSubmit = () => {
    alert("Submit jawaban berhasil!");
  };

  return (
  <div className="max-w-full font-poppins">
    <div className="min-h-screen flex flex-col p-4 bg-white">
      {/* Header */}
      <div
        className="w-full bg-[#0B61AA] text-white p-4"
        style={{
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div className="header-left" style={{ position: "absolute", left: "20px" }}>
          <a href="#" className="logo">
            <img
              src="/images/etamtest.png"
              alt="Logo"
              style={{ width: "120px", height: "auto" }}
            />
          </a>
        </div>

        <div className="ml-auto flex items-center">
            <h2 className="lg:text-lg md:text-lg text-xl font-bold text-white font-poppins">TryOut CPNS</h2>
        </div>
      </div>
      {/* Question and Timer section */}
      <div className="min-h-screen flex flex-col lg:flex-row mt-4 lg:space-x-6 rounded-[15px]">
        <div
          className="w-full lg:w-3/4 bg-[#0B61AA] p-6 sm:p-4 rounded-lg shadow-lg flex-grow mih-h-screen"
          style={{ maxWidth: "994x", height: "auto" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="lg:text-lg md:text-lg text-xl font-bold text-white font-poppins">
              Soal CPNS
            </h2>
            <p className="text-white font-bold lg:text-lg md:text-lg text:-sm">
              {currentoption}/{totalQuestions}
            </p>
            <div className="bg-[#0B61AA] text-white px-4 sm:px-2 sm:py-1 rounded-[10px] border border-white font-bold lg:text-lg md:text-lg text-xs">
              00:00:00
            </div>
          </div>

          {/* Question Container (Blur Overlay) */}
          <div className="relative mb-6 bg-white p-4 rounded-[15px] shadow">
            {/* Blur Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-white/50 rounded-[15px] z-10 flex items-center justify-center">
              <div className="text-center">
                {/* Gambar Gembok */}
                <FaLock className="text-yellow-400 w-16 h-16 mb-4 mx-auto" />

                {/* Button Dapatkan Akses */}
                <p className="text-sm mb-4">
                  Klik dibawah ini untuk mendapatkan akses soal
                </p>
                <Link href={`/tes/payment/${testId}`}>
                <button
                  className="px-4 py-2 bg-[#7BB3B4] text-white rounded-full shadow hover:bg-[#6A9DA3] transition duration-300 ease-in-out font-bold"
                >
                  Dapatkan Akses
                </button>
                </Link>
              </div>
            </div>
            {/* Soal (Blurred Content) */}
            <div className="relative bg-white p-4 mb-4 rounded-lg shadow-lg z-0">
              <p className="text-lg mb-6">
                Dalam penyusunan kebijakan publik, prinsip "checks and balances"
                sangat penting untuk memastikan bahwa kekuasaan tidak terpusat
                pada satu pihak. Prinsip ini terutama diterapkan dalam hubungan
                antara lembaga eksekutif, legislatif, dan yudikatif. Manakah
                dari pilihan berikut yang merupakan contoh penerapan prinsip
                "checks and balances" di Indonesia?
              </p>
            </div>

            {/* Jawaban (Blurred Content) */}
            <div className="relative mb-4 bg-white p-4 rounded-lg shadow-lg z-0">
              <input
                type="radio"
                id="optionA"
                name="option"
                value={"A"}
                className="mr-2"
                disabled
              />
              <label htmlFor="optionA" className="text-lg">
                A. Presiden berhak mengeluarkan peraturan pemerintah pengganti
                undang-undang (Perppu)
              </label>
            </div>

            <div className="relative mb-4 bg-white p-4 rounded-lg shadow-lg z-0">
              <input
                type="radio"
                id="optionB"
                name="option"
                value={"B"}
                className="mr-2"
                disabled
              />
              <label htmlFor="optionB" className="text-lg">
                B. Mahkamah Konstitusi dapat membatalkan undang-undang yang
                dianggap bertentangan dengan UUD 1945
              </label>
            </div>

            <div className="relative mb-4 bg-white p-4 rounded-lg shadow-lg z-0">
              <input
                type="radio"
                id="optionC"
                name="option"
                value={"C"}
                className="mr-2"
                disabled
              />
              <label htmlFor="optionC" className="text-lg">
                C. DPR memiliki hak interpelasi untuk meminta keterangan dari
                presiden
              </label>
            </div>

            <div className="relative mb-4 bg-white p-4 rounded-lg shadow-lg z-0">
              <input
                type="radio"
                id="optionD"
                name="option"
                value={"D"}
                className="mr-2"
                disabled
              />
              <label htmlFor="optionD" className="text-lg">
                D. Komisi Yudisial memberikan rekomendasi calon hakim agung
                kepada DPR
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row justify-between mt-6">
            <div className="bg-white mb-4 p-4 rounded-[15px] shadow w-full">
              <div className="flex flex-col md:flex-row justify-between mt-6 items-center" style={{marginBottom: '20px'}}>
                <div className="flex justify-between w-full mb-2">
                  <button
                    className="bg-[#0B61AA] text-white text-center px-4 py-2 rounded-[15px] hover:bg-blue-700 w-full lg:text-lg md:text-md text-sm font-poppins"
                    style={{ height: "40px", flex: "1", marginRight: "8px", marginBottom: "10px" }}
                    onClick={handleprevquestion}
                    disabled={currentoption === 1}
                  >
                    Soal Sebelumnya
                  </button>
                  <button
                    className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 mb-2 md:mb-0 md:mx-4 flex-1 font-poppins ${markedreview[currentoption - 1] ? "bg-yellow-500" : ""} md:block hidden`}
                    style={{ height: "40px", flex: "1", width:'100%', maxWidth:'200px', margin: "0 auto" }}
                    onClick={handlemarkreview}
                  >
                    Ragu-Ragu
                  </button>
                  {currentoption === totalQuestions ? (
                    <button
                      className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700 mb-2 md:mb-0 md:ml-4 flex-1 font-poppins"
                      style={{ height: "40px"}}
                      onClick={handleSubmit}
                    >
                      Kumpulkan
                    </button>
                  ) : (
                    <button
                        className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700 font-poppins"
                        style={{ height: "40px", flex: "1", marginLeft: "8px", marginBottom: "10px"}}
                        onClick={handlenextquestion}
                      >
                        Soal Selanjutnya
                      </button>
                    )}
                </div>
                <div className="block md:hidden w-full">
                  <button 
                    className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 w-full ${markedreview[currentoption - 1] ? 'bg-yellow-500' : ''}`}
                    style={{heigt:'40px'}}
                    onClick={handlemarkreview}
                  >
                    Ragu-Ragu 
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question navigation */}
        <div className="hidden lg:block w-full lg:w-1/4 mt-6 lg:mt-0 bg-[#F3F3F3] rounded-[20px] shadow-lg">
          <div
            className="bg-[#0B61AA] p-4 rounded-[10px]"
            style={{ height: "50px" }}
          ></div>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <button
                  key={i + 1}
                  className={`w-10 h-10 text-lg font-bold rounded border border-[#0B61AA] ${
                    markedreview[i] ? "bg-yellow-500 text-white" : "bg-gray-200"
                  } hover:bg-gray-300`}
                  onClick={() => setCurrentoption(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
  </div>
  </div>
  );
};

export default MengerjakanTes;
