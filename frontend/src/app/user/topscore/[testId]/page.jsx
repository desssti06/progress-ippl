'use client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { AiOutlineUser } from "react-icons/ai";

const TopScore = () => {
    // State untuk menyimpan data score
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { testId } = useParams();
    const [testTitle, setTestTitle] = useState('');
    const [loadingTitle, setLoadingTitle] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:2000/api/leaderboard/${testId}`);
                if (response.data && response.data.data) {
                    setScores(response.data.data);
                } else {
                    throw new Error('Data tidak sesuai format yang diharapkan');
                }
            } catch (error) {
                console.error('Error fetching top scores:', error);
                setError('Gagal mengambil data top score');
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [testId]);

    useEffect(() => {
        const fetchTestTitle = async () => {
            try {
              const response = await fetch('/api/getTestTitle');
              if (!response.ok) throw new Error('Failed to fetch');
              const data = await response.json();
              setTestTitle(data.title);
            } catch (error) {
              console.error('Error fetching test title:', error);
              setErrorTitle('Gagal mengambil judul tes');
            } finally {
              setLoadingTitle(false);
            }
          };

        fetchTestTitle();
    }, [testId]);




    return (
        <div className="min-h-screen bg-[#FFFFFF] font-sans">
            {/* Header */}
            <header className="w-full bg-[#0B61AA] text-white p-4" style={{ maxWidth: '1440px', height: '90px' }}>
                <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap">
                    <div>
                        <img 
                            src="/images/etamtest.png" 
                            alt="Etamtest" 
                            className="h-6 sm:h-auto sm:max-h-[52px] w-auto max-w-[216px] md:max-h-[52px] md:max-w-[216px]" 
                            style={{ height: '45px', width: '120px' }} 
                        />
                    </div>

                    {/* Title and breadcrumb */}
                    <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-center whitespace-nowrap font-poppins">
                            Top Score
                        </h1>

                        {/* Profil icon hanya muncul pada ukuran sm ke atas */}
                        <div className="flex items-center justify-center h-12 w-12 bg-white rounded-full">
                            <AiOutlineUser className="h-14 w-14 text-gray-700" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto mt-6 px-4 sm:px-0">
                {/* Top Score Section */}
                <div className="flex items-center justify-center" style={{ maxWidth: '1018px', height: '160px', margin: '0 auto' }}>
                    <div className="bg-[#F3F3F3] p-6 rounded-[30px] shadow-md w-full flex flex-col items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl text-[#0B61AA] font-bold mb-2 font-poppins">Top Score</p>
                            <p className="text-2xl text-[#0B61AA] font-bold font-poppins">{testTitle}</p>
                        </div>
                    </div>
                </div>

                {/* Kontainer untuk scrollbar */}
                <div className="overflow-x-auto" style={{ maxHeight: '350px' }}>

                    {/* Scores Table Section */}
                    <div className="mt-6">
                            <div className="max-w-full p-6 rounded-lg shadow-md bg-[#F3F3F3]">
                            <table className="min-w-full text-left table-auto border-collapse">
                                <thead className="bg-[#CAE6F9] text-black">
                                    <tr>
                                        <th className="px-2 py-2 text-center sticky top-0 bg-[#CAE6F9] font-poppins">Rangking</th>
                                        <th className="px-2 py-2 text-center sticky top-0 bg-[#CAE6F9] font-poppins">Nama</th>
                                        <th className="px-2 py-2 text-center sticky top-0 bg-[#CAE6F9] font-poppins">Nilai Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 font-poppins">Loading...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 font-poppins text-red-500">{error}</td>
                                        </tr>
                                    ) : scores.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 font-poppins">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        scores.map((score, index) => (
                                            <tr key={index} className={`border ${index === 0 ? 'rounded-t-[30px]' : ''} ${index === scores.length - 1 ? 'rounded-b-[30px]' : ''}`}>
                                                <td className={`border px-2 py-2 text-center ${index % 2 === 0 ? 'bg-[#C5CBCA]-100' : 'bg-white'} rounded-tl-[30px] ${index === 0 ? 'rounded-tl-[30px]' : ''} ${index === scores.length - 1 ? 'rounded-bl-[30px]' : ''} font-poppins`}>
                                                    {score.ranking}
                                                </td>
                                                <td className={`border px-2 py-2 text-left ${index % 2 === 0 ? 'bg-[#C5CBCA]-100' : 'bg-white'} font-poppins`}>
                                                    {score.name}
                                                </td>
                                                <td className={`border px-2 py-2 text-center rounded-tr-[30px] rounded-br-[30px] ${index % 2 === 0 ? 'bg-[#C5CBCA]-100' : 'bg-white'} ${index === 0 ? 'rounded-tr-[30px]' : ''} ${index === scores.length - 1 ? 'rounded-br-[30px]' : ''} font-poppins`}>
                                                    {score.score}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TopScore;
