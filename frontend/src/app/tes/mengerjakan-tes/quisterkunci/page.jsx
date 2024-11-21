"use client";
import React, { useState } from "react";
import { IoIosLock } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";

const MengerjakanTes = () => {
  const totalQuestions = 40; // Pindahkan deklarasi totalQuestions ke atas
  const [selectedoption, setSelectedoption] = useState(null);
  const [currentoption, setCurrentoption] = useState(1);
  const [markedreview, setMarkedreview] = useState(
    Array(totalQuestions).fill(false)
  );
  const [isBlurred, setIsBlurred] = useState(true); // State to toggle blur

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
    <div className="min-h-screen flex flex-col p-6 bg-white font-sans">
      {/* Header */}
      <div
        className="w-full bg-[#0B61AA] text-white p-4"
        style={{
          maxWidth: "1440px",
          height: "70px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0",
        }}
      >
        {/* Kiri (Judul dan Breadcrumb) */}
        <div
          className="header-left"
          style={{
            textAlign: "left",
            margin: "20px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <h1
            className="header-title"
            style={{
              fontSize: "25px",
              margin: "0",
              padding: "0",
              fontFamily: "'Libre Bodoni', serif",
            }}
          >
            Mengerjakan Tryout
          </h1>
          <div
            className="breadcrumb text-sm text-white"
            style={{
              margin: "0",
              padding: "0",
              fontFamily: "'Libre Bodoni', serif",
            }}
          >
            <a href="#" className="hover:underline">
              Home
            </a>{" "}
            /
            <a href="#" className="hover:underline">
              Tryout UTBK
            </a>{" "}
            /
            <a href="#" className="hover:underline">
              Detail Soal
            </a>{" "}
            /
            <a href="#" className="hover:underline">
              Mengerjakan Tryout
            </a>
          </div>
        </div>

        {/* Kanan (Logo dan Profile) */}
        <div
          className="header-right"
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px",
            padding: "0",
          }}
        >
          <a className="logo mr-6" style={{ margin: "0", padding: "0" }}>
            <img
              src="/image/logo.png"
              alt="Logo"
              className="h-auto"
              style={{ width: "150px", height: "auto", margin: "0" }}
            />
          </a>
          <div className="profileIcon" style={{ margin: "20px", padding: "0" }}>
            <IoPersonCircle 
              className="h-auto text-current text-white"
              style={{ width: "40px", height: "40px", marginRight: "10px" }} 
              alt="Profile Icon" 
            />
          </div>
        </div>
      </div>
      {/* Question and Timer section */}
      <div className="flex flex-col lg:flex-row mt-6 lg:space-x-6 rounded-[15px]">
        <div
          className="w-full lg:w-3/4 bg-[#0B61AA] p-6 rounded-lg shadow-lg"
          style={{ maxWidth: "994x", height: "784px" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white ">
              Soal CPNS - High Level
            </h2>
            <p className="text-white font-bold">
              {currentoption}/{totalQuestions}
            </p>
            <div className="bg-[#0B61AA] text-white px-4 py-2 rounded-[10px] border border-white font-bold">
              00:00:00
            </div>
          </div>

          {/* Question Container (Blur Overlay) */}
          <div className="relative mb-6 bg-white p-4 rounded-[15px] shadow">
            {/* Blur Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-white/50 rounded-[15px] z-10 flex items-center justify-center">
              <div className="text-center">
                {/* Gambar Gembok */}
                <IoIosLock className="w-60 h-60 mb-4 mx-auto text-white"/>

                {/* Button Dapatkan Akses */}
                <p className="text-sm mb-4">
                  Klik dibawah ini untuk mendapatkan akses soal
                </p>
                <button
                  className="px-4 py-2 bg-[#7BB3B4] text-white rounded-full shadow hover:bg-[#6A9DA3] transition duration-300 ease-in-out font-bold"
                  onClick={() => alert("Silakan lanjutkan pembelian.")}
                >
                  Dapatkan Akses
                </button>
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
          <div className="flex justify-between mt-6">
            <div className="bg-white mb-4 p-4 rounded-[15px] shadow w-full">
              <div
                className="flex justify-between items-center"
                style={{ height: "70px" }}
              >
                <button
                  className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700"
                  style={{ height: "40px" }}
                  onClick={handleprevquestion}
                  disabled={currentoption === 1} // Disable if first question
                >
                  Soal sebelumnya
                </button>
                <button
                  className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 ${
                    markedreview[currentoption - 1] ? "bg-yellow-500" : ""
                  }`}
                  style={{ height: "40px" }}
                  onClick={handlemarkreview}
                >
                  Ragu-Ragu
                </button>
                {currentoption === totalQuestions ? (
                  <button
                    className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700"
                    style={{ height: "40px" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700"
                    style={{ height: "40px" }}
                    onClick={handlenextquestion}
                  >
                    Soal Selanjutnya
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question navigation */}
        <div className="w-full lg:w-1/4 mt-6 lg:mt-0 bg-[#F3F3F3] rounded-[20px] shadow-lg">
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
  );
};

export default MengerjakanTes;
