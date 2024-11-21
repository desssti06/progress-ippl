'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import  Swal from 'sweetalert2';
import { useRef } from 'react';

const MengerjakanTes = () => {
    const { testId } = useParams(); // Ambil testId dari URL path
    const [questions, setQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentOption, setCurrentOption] = useState(1);
    const [markedReview, setMarkedReview] = useState([]);
    const [showNav, setShowNav] = useState(false);
    const [resultId, setResultId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [remainingTime, setRemainingTime] = useState(0);
    const [workTime, setWorkTime] = useState(0); 
    const [timerActive, setTimerActive] = useState(false);
    const totalOptions = 5;
    const [answeredQuestions, setAnsweredQuestions] = useState(new Array(totalOptions).fill(false));
    const [answeredOptions, setAnsweredOptions] = useState(new Array(totalOptions).fill(false));
    const workTimeInterval = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const savedResultId = localStorage.getItem('resultId');
        if (savedResultId) {
            setResultId(savedResultId);
            console.log('Loaded resultId from localStorage:', savedResultId);
        }
    }, []);    

    useEffect(() => {
        const storedAnswers = localStorage.getItem('answers');
        if (storedAnswers) {
            const parsedAnswers = JSON.parse(storedAnswers);
            setAnswers(parsedAnswers);
            const currentQuestionId = questions[currentOption - 1]?.id;
            if (parsedAnswers[currentQuestionId]) {
                setSelectedOption(parsedAnswers[currentQuestionId].optionValue);
            }
        }

        const handleBeforeUnload = (event) => {
            event.preventDefault();  // Mencegah refresh otomatis
            event.returnValue = '';  // Mengharuskan browser menampilkan dialog konfirmasi default
        };   
    
        window.addEventListener('beforeunload', handleBeforeUnload);  // Tambahkan event listener
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);  // Hapus event listener ketika komponen unmount
        };
    }, [questions, currentOption]);

    useEffect(() => {
        if (!testId) return; // Tunggu hingga testId tersedia dari URL path

        const fetchQuestionsAndAnswers = async () => {
            try {
                const savedResultId = localStorage.getItem('resultId');
                if (savedResultId) {
                    setResultId(savedResultId);
                    await fetchAnswersByResultId(savedResultId);
                }

                const response = await fetch(`http://localhost:2000/api/tests/get-test/${testId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Gagal mengambil data test');

                const data = await response.json();
                const { title: testTitle, multiplechoice } = data.data;
                setTitle(testTitle);

                const formattedQuestions = multiplechoice.map((question) => ({
                    id: question.id,
                    questionText: question.question,
                    options: question.option.map((opt) => ({
                        id: opt.id,
                        label: opt.optionDescription,
                        value: opt.optionDescription,
                    })),
                }));

                setQuestions(formattedQuestions);
                setMarkedReview(Array(formattedQuestions.length).fill(false));

                const currentQuestionId = formattedQuestions[currentOption - 1]?.id;
                if (currentQuestionId && answers[currentQuestionId]) {
                    setSelectedOption(answers[currentQuestionId].optionLabel);
                }
            } catch (error) {
                console.error('Gagal mengambil data soal atau jawaban:', error);
            }
        };

        fetchQuestionsAndAnswers();
    }, [testId, token]);

    const fetchAnswersByResultId = async (resultId) => {
        try {
            const savedResultId = localStorage.getItem('resultId');
                if (savedResultId) {
                    setResultId(savedResultId);
                }
            const response = await fetch(`http://localhost:2000/answer/tests/${resultId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Gagal mengambil data jawaban');

            const data = await response.json();
            const formattedAnswers = data.reduce((acc, answer) => {
                acc[answer.option.questionId] = { optionId: answer.optionId, optionLabel: answer.userAnswer };
                return acc;
            }, {});

            setAnswers(formattedAnswers);

            const currentQuestionId = questions[currentOption - 1]?.id;
            if (currentQuestionId && formattedAnswers[currentQuestionId]) {
                setSelectedOption(formattedAnswers[currentQuestionId].optionLabel);
            }
        } catch (error) {
            console.error('Kesalahan saat mengambil jawaban:', error);
        }
    };

    useEffect(() => {
        const currentQuestionId = questions[currentOption - 1]?.id;
    
        // Cek apakah ada jawaban yang tersimpan untuk pertanyaan saat ini
        if (currentQuestionId && answers[currentQuestionId]) {
            setSelectedOption(answers[currentQuestionId].optionLabel);  // Set jawaban yang sudah tersimpan
            console.log(`Jawaban ditemukan untuk pertanyaan ${currentQuestionId}: ${answers[currentQuestionId].optionLabel}`);
        } else {
            setSelectedOption(null);  // Jika tidak ada jawaban, kosongkan pilihan
        }
    }, [currentOption, answers, questions]);
    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
    
        const savedResultId = localStorage.getItem('resultId');
        if (savedResultId) setResultId(savedResultId);
    }, []);
    
    const formatRemainingTime = (timeInSeconds) => {
        if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds) || timeInSeconds < 0) {
            return '00:00:00'; // Fallback to default format
        }
    
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
    
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!resultId) return;

        const storedWorkTime = localStorage.getItem(`workTime_${resultId}`);
        if (storedWorkTime) {
            setWorkTime(parseInt(storedWorkTime));
        } else {
            setWorkTime(0);
        }

    // Fetch remaining time from localStorage or backend
    const fetchRemainingTime = async () => {
        const storedRemainingTime = localStorage.getItem(`remainingTime_${resultId}`);
        console.log('Stored remaining time from localStorage:', storedRemainingTime);
        
        if (storedRemainingTime) {
            const time = Number(storedRemainingTime);
            if (!isNaN(time) && time > 0) {
                setRemainingTime(time);
                setTimerActive(true); // Activate timer immediately
                startWorkTime(); // Start work time interval immediately
                startCountdown(time); // Start countdown for remaining time immediately
            }
        } else {
            // Fetch from backend if not found in localStorage
            try {
                const response = await fetch(`http://localhost:2000/timer/${testId}/worktime`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch worktime');

                const data = await response.json();
                console.log('Fetched worktime from backend:', data);

                const { hours, minutes, seconds } = data;
                const totalWorkTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

                if (totalWorkTimeInSeconds > 0) {
                    setRemainingTime(totalWorkTimeInSeconds);
                    setTimerActive(true); // Activate timer after getting time from backend
                    localStorage.setItem(`remainingTime_${resultId}`, totalWorkTimeInSeconds); // Save to localStorage
                    startWorkTime(); // Start work time interval
                    startCountdown(totalWorkTimeInSeconds); // Start countdown immediately
                } else {
                    setRemainingTime(0);
                    alert("Waktu sudah habis!");
                }
            } catch (error) {
                console.error('Failed to fetch worktime:', error);
                alert("Gagal mengambil waktu kerja.");
            }
        }
    };

    const startWorkTime = () => {
        // Start interval for workTime
        workTimeInterval.current = setInterval(() => {
            setWorkTime(prevWorkTime => {
                const newWorkTime = prevWorkTime + 1; // Add 1 second
                localStorage.setItem(`workTime_${resultId}`, newWorkTime); // Save workTime to localStorage
                return newWorkTime;
            });
        }, 1000); // Every 1 second
    };

    const startCountdown = (initialTime) => {
        // Start countdown immediately
        let countdownTimer = setInterval(() => {
            setRemainingTime(prevTime => {
                const newTime = prevTime - 1;

                if (newTime <= 0) {
                    clearInterval(countdownTimer); // Stop countdown timer if time is up
                    setTimerActive(false);
                    alert('Waktu habis!');
                    return 0; // Ensure it doesn't go below zero
                }

                localStorage.setItem(`remainingTime_${resultId}`, newTime); // Save remaining time to localStorage
                return newTime; // Return new remaining time
            });
        }, 1000); 
        
        return () => clearInterval(countdownTimer); // Clear interval when component unmounts
    };

    // Start both timers
    fetchRemainingTime(); // Call to fetch remaining time

    return () => {
        clearInterval(workTimeInterval.current); // Clear work time interval when component unmounts
    };
}, [resultId, testId, token]); // Dependencies include resultId, testId, and token

// Format remaining time for display
const remainingTimeFormatted = formatRemainingTime(remainingTime);
    
    // Timer countdown effect
    useEffect(() => {
        let timer;
    
        if (timerActive && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prevTime) => {
                    const newTime = prevTime - 1; // Decrease remaining time
    
                    if (newTime <= 0) {
                        clearInterval(timer); // Stop timer if time is up
                        setTimerActive(false);
                        alert('Waktu habis!');
                    }
    
                    localStorage.setItem(`remainingTime_${resultId}`, newTime); // Save remaining time to localStorage based on resultId
                    return newTime; // Return new remaining time
                });
            }, 1000);
        }
    
        return () => clearInterval(timer); // Clear interval when component unmounts
    }, [timerActive, remainingTime, resultId]);

    const saveDraftAnswer = async (testId, optionId, selectedOption) => {
        try {
            const response = await fetch(`http://localhost:2000/answer/tests/${testId}/temp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ testId, answers: [{ optionId, selectedOption }] }),
            });

            if (!response.ok) throw new Error('Gagal menyimpan draft jawaban');

            const data = await response.json();
            return data.resultId;
        } catch (error) {
            console.error('Kesalahan saat memperbarui draft jawaban:', error);
        }
    };

    // Update existing draft answers
    const updateDraftAnswer = async (resultId, oldOptionId, newOptionId, newAnswer) => {
        try {
            console.log('Updating draft answer:', { resultId, oldOptionId, newOptionId, newAnswer });

            const response = await fetch(`http://localhost:2000/answer/tests/${testId}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    resultId,
                    oldOptionId,
                    newOptionId,
                    newAnswer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Response error:', errorData);
                throw new Error('Gagal memperbarui draft jawaban');
            }

            const responseData = await response.json();
            console.log('Draft updated successfully:', responseData);
            return responseData.resultId;
        } catch (error) {
            console.error('Error in updateDraftAnswer:', error.message);
        }
    };

    // Fungsi untuk submit jawaban akhir
    const submitFinalAnswers = async (resultId) => {
        try {
            // Ambil resultId dari localStorage
            const resultId = localStorage.getItem('resultId');
            if (!resultId) {
                throw new Error('Result ID tidak ditemukan di localStorage');
            }
    
            // Ambil token dari localStorage (atau diambil dari tempat lain sesuai implementasi)
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token tidak ditemukan. Pastikan Anda sudah login.');
            }
    
            // Kirim request ke backend dengan resultId di body
            const response = await fetch(`http://localhost:2000/answer/tests/submit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Sertakan token di header
                },
                body: JSON.stringify({ resultId }), // Kirim resultId di body
            });
    
            // Cek apakah respons tidak OK (status 4xx atau 5xx)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengirim jawaban final');
            }
    
            // Parsing response jika sukses
            const data = await response.json();
            console.log('Jawaban final berhasil disimpan:', data);
            alert('Jawaban final berhasil disimpan!');
        } catch (error) {
            console.error('Error saat mengirim jawaban final:', error);
            alert('Terjadi kesalahan saat mengirim jawaban final: ' + error.message);
        }
    };

    const handleOption = async (optionId, optionLabel, question) => {
        setSelectedOption(optionLabel);
        const previousAnswer = answers[question.id];
        let currentResultId = resultId || localStorage.getItem('resultId');  // Ambil resultId dari localStorage jika tidak tersedia

        if (!answeredQuestions.includes(currentOption)){
            setAnsweredQuestions([...answeredQuestions, currentOption]);
        }

        const updatedMarkedReview = [...markedReview];
        updatedMarkedReview[currentOption - 1] = true; // Tandai jawaban untuk soal saat ini
        setMarkedReview(updatedMarkedReview);
        
        if (previousAnswer) {
            if (previousAnswer.optionId !== optionId || previousAnswer.optionLabel !== optionLabel) {
                if (currentResultId) {
                    try {
                        await updateDraftAnswer(currentResultId, previousAnswer.optionId, optionId, optionLabel);
                        const updatedAnswers = {
                            ...answers,
                            [question.id]: { optionId, optionLabel },
                        };
                        setAnswers(updatedAnswers);
    
                        // Simpan jawaban ke localStorage
                        localStorage.setItem('answers', JSON.stringify(updatedAnswers));
    
                        console.log('Jawaban berhasil diperbarui');
                    } catch (error) {
                        console.error('Gagal memperbarui draft:', error);
                    }
                }
            }
        } else {
            try {
                const newResultId = await saveDraftAnswer(testId, optionId, optionLabel);
                setResultId(newResultId);
                localStorage.setItem('resultId', newResultId);
    
                const updatedAnswers = {
                    ...answers,
                    [question.id]: { optionId, optionLabel },
                };
                setAnswers(updatedAnswers);
    
                // Simpan jawaban baru ke localStorage
                localStorage.setItem('answers', JSON.stringify(updatedAnswers));
    
                console.log('Jawaban disimpan sebagai draft baru dengan resultId:', newResultId);
            } catch (error) {
                console.error('Gagal menyimpan draft:', error);
            }
        }
    };
    
    const handlenextquestion = () => {
        if (currentOption < questions.length) {
            setCurrentOption((prev) => prev + 1);
            const nextQuestionId = questions[currentOption]?.id;
            if (answers[nextQuestionId]) {
                setSelectedOption(answers[nextQuestionId].optionLabel);
            } else {
                setSelectedOption(null);
            }
        }
    };

    const handleprevquestion = () => {
        if (currentOption > 1) {
            setCurrentOption((prev) => prev - 1);
            const prevQuestionId = questions[currentOption - 2]?.id;
            if (answers[prevQuestionId]) {
                setSelectedOption(answers[prevQuestionId].optionLabel);
            } else {
                setSelectedOption(null);
            }
        }
    };

    const handlemarkreview = () => {
        // console.log("Button clicked");
        // const updatedMarkedReview = [...markedReview];
        // updatedMarkedReview[currentOption - 1] = !updatedMarkedReview[currentOption - 1];
        // setMarkedReview(updatedMarkedReview);
        // console.log(updatedMarkedReview);

        console.log("Button clicked");
        // setMarkedReview(prevMarkedReview => {
        //     const updatedMarkedReview = [...prevMarkedReview];
        //     updatedMarkedReview[currentOption - 1] = !updatedMarkedReview[currentOption - 1]; // Toggle status
        //     console.log("Updated Marked Review:", updatedMarkedReview);
        //     return updatedMarkedReview;
        // });
        const updatedMarkedReview = [...markedReview];
        // Toggle status pada markedReview untuk currentOption
        updatedMarkedReview[currentOption - 1] = !updatedMarkedReview[currentOption - 1];
        setMarkedReview(updatedMarkedReview);
        console.log("markedReview setelah diperbarui:", updatedMarkedReview);

        // Tambahkan log di sini untuk memeriksa nilai setelah update
        console.log("currentOption:", currentOption);
        console.log("markedReview:", updatedMarkedReview);
        console.log("answeredOptions:", answeredOptions);
    };

    const handleAnswerInput = (optionIndex) => {
        setAnsweredOptions(prev => {
            const updatedAnswers = [...prev];
            updatedAnswers[optionIndex] = true; // Tandai bahwa opsi sudah diisi
            return updatedAnswers;
        });
    };

     // Fungsi untuk memperbarui warna nomor soal
     const handleAnswerQuestion = (index) => {
        const updatedAnsweredQuestions = [...answeredQuestions];
        updatedAnsweredQuestions[index] = !updatedAnsweredQuestions[index]; // Toggle jawaban
        setAnsweredQuestions(updatedAnsweredQuestions);
    };


    // Panggil `submitFinalAnswers` ketika tombol "Submit" diklik
    const handleSubmit = async () => {
        const confirmSubmit = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak dapat mengubah jawaban setelah mengirim!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, kirim jawaban!',
            cancelButtonText: 'Batal'
        });
    
        if (confirmSubmit.isConfirmed) {
            try {
                // Bersihkan interval untuk workTime agar tidak terus bertambah
                clearInterval(workTimeInterval);
    
                // Hapus data workTime dari localStorage untuk memastikan tidak ada carry-over
                localStorage.removeItem(`workTime_${resultId}`);
                
                await submitFinalAnswers();
    
                // Bersihkan data dari localStorage setelah submit
                localStorage.removeItem('answers');
                localStorage.removeItem('resultId');
                localStorage.removeItem(`remainingTime_${resultId}`);
    
                // Redirect ke halaman hasil
                router.push(`/tes/mengerjakan-tes/hasil-tes/${resultId}`);
            } catch (error) {
                console.error('Error submitting final answers:', error);
    
                Swal.fire({
                    title: 'Terjadi Kesalahan!',
                    text: 'Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    useEffect(() => {
        const storedAnswers = localStorage.getItem('answers');
        
        if (storedAnswers) {
            const parsedAnswers = JSON.parse(storedAnswers);
            setAnswers(parsedAnswers);  // Isi state answers dengan jawaban dari localStorage
            console.log('Loaded answers from localStorage:', parsedAnswers);
        }
    }, []);
    

    const currentQuestion = questions.length > 0 ? questions[currentOption - 1] : null;

    console.log("Render Check:");
    console.log("currentOption:", currentOption);
    console.log("markedReview:", markedReview);
    console.log("answeredOptions:", answeredOptions);

    // UseEffect untuk melacak perubahan state
    useEffect(() => {
        console.log("State Updated:");
        console.log("currentOption:", currentOption);
        console.log("markedReview:", markedReview);
        console.log("answeredOptions:", answeredOptions);
    }, [markedReview, answeredOptions, currentOption]);

    return (
        <div className="min-h-screen flex flex-col p-6 bg-white font-sans">
            {/* Header */}
            <div className="w-full bg-[#0B61AA] text-white p-4 text-center flex items-center" style={{ height: '70px' }}>
                <button className="block md:block lg:hidden text-white bg-red-500 px-4 py-2 rounded-lg"
                    onClick={() => setShowNav(!showNav)}>
                    {showNav ? 'Tutup Menu' : 'Menu'}
                </button>
                <h1 className="text-3xl font-bold ml-4">EtamTest</h1>
            </div>

            {/* Navigasi untuk mobile */}
            {showNav && (
                <div className="fixed inset-0 z-40 bg-gray-800 bg-opacity-50 lg:hidden" />
            )}
            {showNav && (
                <div className="fixed inset-y-0 left-0 bg-[#fff] z-50 flex flex-col lg:hidden ">
                    <div className=" p-6 flex justify-between items-center">
                        <button className="text-red-500 bg-[#F3F3F3] px-2 py-1 rounded"
                            onClick={() => setShowNav(false)}>
                            Tutup
                        </button>
                    </div>
                    <div className="mt-2 bg-[#F3F3F3] rounded-[20px] shadow-lg p-2 mx-4">
                        <div className="bg-[#0B61AA] p-2 rounded-[10px]" style={{ height: '50px' }}></div>
                        <div className="p-2 flex-grow">
                            <div className="grid grid-cols-5 gap-1">
                                {Array.from({ length: questions.length }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`w-10 h-10 text-lg font-bold rounded border border-[#0B61AA] 
                                            ${answeredQuestions.includes(i + 1) ? 'bg-gray-400' : markedReview[i] ? 'bg-yellow-500 text-white' : 'bg-gray-200'} 
                                            hover:bg-gray-300`}
                                        onClick={() => setCurrentOption(i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Question and Timer section */}
            <div className="flex flex-col lg:flex-row mt-6 lg:space-x-6 rounded-[15px]">
                <div className="w-full lg:w-3/4 bg-[#0B61AA] p-6 sm:p-4 rounded-lg shadow-lg" style={{ maxWidth: '994px', height: 'auto' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className=" lg:text-lg md:text-lg text-xs font-bold text-white ">{title}</h2>
                        <div className="flex items-center justify-center space-x-2 flex-grow">
                            <p className="text-white font-bold lg:text-lg md:text-lg text-sm">{currentOption}/{questions.length}</p>
                        </div>
                        <div className="bg-[#0B61AA] text-white px-4 sm:px-2 py-2 sm:py-1 rounded-[10px] border border-white font-bold lg:text-lg md:text-lg text-xs">Waktu Tersisa: {remainingTimeFormatted}</div>
                    </div>

                    {/* Soal dan Opsi */}
                    {currentQuestion && (
                        <>
                            <div className="mb-6 sm:mb-4 bg-white p-4 sm:p2 rounded-[15px] shadow">
                                <p className="text-lg mb-6 sm:mb-4">{currentQuestion.questionText}</p>
                            </div>
                            {currentQuestion.options.map((option) => (
                            <div key={option.id} className="mb-4 sm:mb-2 bg-white p-4 sm:p-2 rounded-lg shadow-lg">
                                <input
                                    type="radio"
                                    id={option.id}
                                    name={`question-${currentQuestion.id}`}  // Beri nama unik per pertanyaan
                                    value={option.value}
                                    checked={selectedOption === option.value}  // Bandingkan dengan option.value yang unik
                                    onChange={() => handleOption(option.id, option.value, currentQuestion)}  // Gunakan option.value saat set jawaban
                                    className="mr-2"
                                />
                                <label htmlFor={option.id} className="text-lg">{option.label}</label>
                            </div>
                        ))
                        
                    }
                        </>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col md:flex-row justify-between mt-6">
                        <div className="bg-white mb-4 p-4 rounded-[15px] shadow w-full">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="flex justify-between w-full mb-2">
                                    <button
                                        className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700"
                                        style={{ height: '40px', flex: '1', marginRight: '8px' }}
                                        onClick={handleprevquestion}
                                        disabled={currentOption === 1}>
                                        Soal sebelumnya
                                    </button>
                                    <button
                                    //    className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 w-full 
                                    //     ${markedReview[currentOption - 1] ? 'bg-yellow-500' : ' '}`}
                                        // className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 w-full ${markedReview[currentOption - 1] || answeredOptions[currentOption - 1] ? 'bg-yellow-500' : 'bg-gray-300'}`}
                                        className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 w-full 
                                            ${(markedReview[currentOption - 1] || answeredOptions[currentOption - 1]) ? 'bg-yellow-500' : 'bg-gray-300'}
                                        `}
                                        style={{ height: '40px', width: '100%', maxWidth: '200px', margin: '0 auto' }}
                                        onClick={handlemarkreview}>
                                        Ragu-Ragu
                                    </button>
                                    {currentOption === questions.length ? (
                                        <button
                                            className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700 mb-2 md:mb-0 md:ml-4 flex-1"
                                            style={{ height: '40px' }}
                                            onClick={handleSubmit}>
                                            Submit
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-[#0B61AA] text-white px-4 py-2 rounded-[15px] hover:bg-blue-700"
                                            style={{ height: '40px', flex: '1', marginLeft: '8px' }}
                                            onClick={handlenextquestion}>
                                            Soal Selanjutnya
                                        </button>
                                    )}
                                </div>
                                <div className=" block md:hidden w-full">
                                    <button
                                        // className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 w-full ${markedReview[currentOption - 1] ? 'bg-yellow-500' : ''}`}
                                        className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 w-full 
                                            ${markedReview[currentOption - 1] ? 'bg-yellow-500' : ''}`}
                                        // className={`bg-[#F8B75B] text-black px-4 py-2 rounded-[15px] hover:bg-yellow-500 w-full 
                                        //     ${markedReview[currentOption - 1] || answeredOptions[currentOption - 1] ? 'bg-yellow-500' : 'bg-gray-300'}`}
                                        style={{ height: '40px' }}
                                        onClick={handlemarkreview}>
                                        Ragu-Ragu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question navigation */}
                <div className="hidden lg:block lg:w-1/4 mt-6 lg:mt-0 bg-[#F3F3F3] rounded-[20px] shadow-lg">
                    <div className="bg-[#0B61AA] p-4 rounded-[10px]" style={{ height: '50px' }}></div>
                    <div className="p-6">
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: questions.length }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`w-10 h-10 text-lg font-bold rounded border border-[#0B61AA] 
                                        ${answeredQuestions.includes(i + 1) ? 'bg-gray-400' : markedReview[i] ? 'bg-yellow-500 text-white' : 'bg-gray-200'} 
                                        hover:bg-gray-300`}
                                    onClick={() => setCurrentOption(i + 1)}>
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