'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import  Swal from 'sweetalert2';
import { useRef } from 'react';
import { PiListNumbers } from "react-icons/pi";
import { CgArrowRightR } from "react-icons/cg";
import { CgArrowLeftR } from "react-icons/cg";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.NEXT_PUBLIC_API_URL;

const MengerjakanTes = () => {
    const { testId } = useParams(); // Ambil testId dari URL path
    const [questions, setQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [markedReview, setMarkedReview] = useState([]);
    const [showNav, setShowNav] = useState(false);
    const [resultId, setResultId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [remainingTime, setRemainingTime] = useState(0);
    const [workTime, setWorkTime] = useState(0); 
    const [timerActive, setTimerActive] = useState(false);
    const countdownInterval = useRef(null);
    const totalOptions = 5;
    const [answeredQuestions, setAnsweredQuestions] = useState(new Array(totalOptions).fill(false));
    const [answeredOptions, setAnsweredOptions] = useState(new Array(totalOptions).fill(false));
    const workTimeInterval = useRef(null);
    const [isClicked, setIsClicked] = useState(false);
    const router = useRouter();
    // Inisialisasi `currentOption` langsung dari localStorage
    const [activeQuestion, setActiveQuestion] = useState(1); // Default ke soal pertama
    
    // State untuk opsi yang dipilih, dengan pengambilan dari localStorage
    const [currentOption, setCurrentOption] = useState(() => {
        const storedOption = localStorage.getItem('currentOption');
        return storedOption ? Number(storedOption) : 1;
    });

    // Contoh navigasi soal dengan penanda nomor
const soalList = [1, 2, 3, 4, 5]; // Misalnya nomor soal

// Menambahkan indikator soal belum dikerjakan
const SoalNavigation = ({ currentSoal, setCurrentSoal, answeredSoals }) => {
    return (
      <div className="soal-navigation">
        {soalList.map((soal) => (
          <button
            key={soal}
            onClick={() => setCurrentSoal(soal)}
            className={`soal-button ${currentSoal === soal ? 'active' : ''} ${answeredSoals.includes(soal) ? 'answered' : 'unanswered'}`}
          >
            {soal}
          </button>
        ))}
      </div>
    );
  };
  


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
    
    // Ambil atau buat sessionId
    useEffect(() => {
        let localSessionId = localStorage.getItem('sessionId');
        if (!localSessionId) {
            localSessionId = uuidv4();
            localStorage.setItem('sessionId', localSessionId);
        }
        setSessionId(localSessionId);
    }, []);
    
    useEffect(() => {
        if (!testId) return; // Tunggu hingga testId tersedia dari URL path

        const fetchQuestionsAndAnswers = async () => {
            try {
                const savedResultId = localStorage.getItem('resultId');
                if (savedResultId) {
                    setResultId(savedResultId);
                    await fetchAnswersByResultId(savedResultId);
                }

                const response = await fetch(`https://${URL}/api/tests/get-test/${testId}`, {
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

     // Handler to toggle isClicked when the button is clicked
     const handleClick = (i) => {
        setActiveQuestion(i + 1); // Set soal yang aktif
        setCurrentOption(i + 1); // Pindahkan ke soal yang dipilih
    };
    

    const fetchAnswersByResultId = async (resultId) => {
        try {
            const savedResultId = localStorage.getItem('resultId');
                if (savedResultId) {
                    setResultId(savedResultId);
                }
            const response = await fetch(`https://${URL}/answer/tests/${resultId}`, {
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
    // Simpan `currentOption` ke localStorage setiap kali berubah
    useEffect(() => {
        if (currentOption !== null) {
            localStorage.setItem('currentOption', currentOption);
        }
    }, [currentOption]);

    // Load token dan resultId dari localStorage saat komponen pertama kali dimuat
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);

        const savedResultId = localStorage.getItem('resultId');
        if (savedResultId) setResultId(savedResultId);
    }, []);

    // Perbarui jawaban yang sudah tersimpan untuk `currentOption`
    useEffect(() => {
        const currentQuestionId = questions[currentOption - 1]?.id;

        if (currentQuestionId && answers[currentQuestionId]) {
            setSelectedOption(answers[currentQuestionId].optionLabel);
            console.log(
                `Jawaban ditemukan untuk pertanyaan ${currentQuestionId}: ${answers[currentQuestionId].optionLabel}`
            );
        } else {
            setSelectedOption(null);
        }
    }, [currentOption, answers, questions]);

    // Fungsi untuk mengupdate waktu tersisa
    const updateRemainingTime = (newTime) => {
        if (!sessionId) return;
        if (newTime <= 0) {
            setTimerActive(false);
            clearInterval(countdownInterval.current); // Hentikan timer
            alert('Waktu habis!');
        } else {
            localStorage.setItem(`remainingTime_${sessionId}`, newTime);
        }
        return newTime;
    };

const startWorkTime = () => {
    workTimeInterval.current = setInterval(() => {
        setWorkTime((prevWorkTime) => {
            const newWorkTime = prevWorkTime + 1;
            // Simpan work time dengan sessionId
            localStorage.setItem(`workTime_${sessionId}`, newWorkTime);
            return newWorkTime;
        });
    }, 1000);
};

useEffect(() => {
    if (!sessionId) return; // Jangan lanjutkan jika sessionId belum ada

    const storedWorkTime = localStorage.getItem(`workTime_${sessionId}`);
    setWorkTime(storedWorkTime ? parseInt(storedWorkTime) : 0);

    const fetchRemainingTime = async () => {
        if (!sessionId) return; // Validasi sessionId sebelum digunakan
        const storedRemainingTime = localStorage.getItem(`remainingTime_${sessionId}`);
        if (storedRemainingTime) {
            const time = Number(storedRemainingTime);
            if (!isNaN(time) && time > 0) {
                setRemainingTime(time);
                setTimerActive(true);
                startWorkTime();
                startCountdown(time);
            }
        } else {
            // Fetch dari backend jika tidak ditemukan di localStorage
            try {
                const response = await fetch(`https://${URL}/timer/${testId}/worktime`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch worktime');

                const data = await response.json();
                const { hours, minutes, seconds } = data;
                const totalWorkTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

                if (totalWorkTimeInSeconds > 0) {
                    setRemainingTime(totalWorkTimeInSeconds);
                    setTimerActive(true);
                    localStorage.setItem(`remainingTime_${sessionId}`, totalWorkTimeInSeconds);
                    startWorkTime();
                    startCountdown(totalWorkTimeInSeconds);
                } else {
                    setRemainingTime(0);
                    alert('Waktu sudah habis!');
                }
            } catch (error) {
                console.error('Failed to fetch worktime:', error);
                alert('Gagal mengambil waktu kerja.');
            }
        }
    };

    fetchRemainingTime();

    return () => {
        clearInterval(workTimeInterval.current);
        clearInterval(countdownInterval.current);
    };
}, [sessionId, testId, token]);

    // Fungsi untuk memulai countdown waktu pengerjaan    // Memulai countdown timer
    const startCountdown = () => {
        if (countdownInterval.current) return; // Jangan buat interval baru jika sudah ada
        countdownInterval.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                const newTime = prevTime - 1;
                return updateRemainingTime(newTime);
            });
        }, 1000);
    };

        // Bersihkan interval saat komponen dilepas
    useEffect(() => {
        return () => clearInterval(countdownInterval.current);
    }, []);

    // Jalankan countdown jika timer aktif
    useEffect(() => {
        if (timerActive && remainingTime > 0) {
            startCountdown();
        } else {
            clearInterval(countdownInterval.current);
        }
    }, [timerActive, remainingTime]);

        // Fungsi untuk memulai timer (contoh dari backend atau tombol start)
    const initializeTimer = (initialTime) => {
        setRemainingTime(initialTime);
        setTimerActive(true);
    };

    
    const formatRemainingTime = (timeInSeconds) => {
        if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds) || timeInSeconds < 0) {
            return '00:00:00';
        }

        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    
    // Format remaining time for display
    const remainingTimeFormatted = formatRemainingTime(remainingTime);

    const saveDraftAnswer = async (testId, optionId, selectedOption) => {
        try {
            const response = await fetch(`https://${URL}/answer/tests/${testId}/temp`, {
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

            const response = await fetch(`https://${URL}/answer/tests/${testId}/update`, {
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
            const response = await fetch(`https://${URL}/answer/tests/submit`, {
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

            // Set the button click state to true
            setIsClicked(true);
        }
    };

    const handlemarkreview = () => {

        console.log("Button clicked");

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
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // SweetAlert untuk konfirmasi sebelum mengirim
        const confirmSubmit = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak dapat mengubah jawaban setelah mengirim!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, kirim jawaban!',
            cancelButtonText: 'Batal',
        });
    
        if (!confirmSubmit.isConfirmed) return;
    
        try {
            // Menampilkan loading indicator
            Swal.fire({
                title: 'Mengirim Jawaban...',
                text: 'Harap tunggu beberapa saat.',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
    
            // Proses upload gambar jika ada
            let uploadedImageUrl = "";
            if (questionPhoto) {
                const imageRef = ref(storage, `question/${questionPhoto.name + v4()}`);
                const snapshot = await uploadBytes(imageRef, questionPhoto);
                uploadedImageUrl = await getDownloadURL(snapshot.ref);
            }
    
            // Menyiapkan data pertanyaan
            const questionData = {
                pageName,
                question: cleanHtml(question),
                number: parseInt(number),
                questionPhoto: uploadedImageUrl,
                weight: parseFloat(weight),
                discussion: cleanHtml(discussion),
                options: options.map(option => ({
                    ...option,
                    optionDescription: option.optionDescription,
                    isCorrect: option.isCorrect,
                })),
            };
    
            let response;
            let result;
    
            if (multiplechoiceId !== "null") {
                // UPDATE existing question
                response = await fetch(`https://${URL}/api/multiplechoice/update-question/${multiplechoiceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(questionData),
                });
    
                if (response.ok) {
                    result = await response.json();
                    console.log('Update successful:', result);
                    
                    // Update localStorage
                    const existingPages = JSON.parse(localStorage.getItem(`pages_${testId}`)) || [];
                    const updatedPages = existingPages.map(page => 
                        page.id === multiplechoiceId 
                            ? { ...questionData, id: multiplechoiceId }
                            : page
                    );
                    localStorage.setItem(`pages_${testId}`, JSON.stringify(updatedPages));
                }
            } else {
                // CREATE new question
                response = await fetch(`https://${URL}/api/multiplechoice/add-questions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        testId: testId,
                        questions: [questionData],
                    }),
                });
    
                if (response.ok) {
                    result = await response.json();
                    console.log('Response dari API:', result);
                    const newMultiplechoiceId = result.data[0].id;
                    console.log('MultiplechoiceId:', newMultiplechoiceId);
    
                    // Update localStorage
                    localStorage.setItem('pageName', pageName);
                    const existingPages = JSON.parse(localStorage.getItem(`pages_${testId}`)) || [];
                    const newQuestion = { 
                        id: newMultiplechoiceId,
                        ...questionData,
                    };
                    existingPages.push(newQuestion);
                    localStorage.setItem(`pages_${testId}`, JSON.stringify(existingPages));
                }
            }
    
            if (response.ok) {
                const encodedPageName = encodeURIComponent(pageName);
                Swal.fire({
                    title: '<strong>Berhasil!</strong>',
                    html: '<p>Jawaban Anda telah berhasil dikirim.</p><p>Anda akan diarahkan ke halaman hasil.</p>',
                    icon: 'success',
                    confirmButtonText: '<i class="fa fa-check"></i> OK',
                    showCloseButton: true,
                    allowOutsideClick: false,
                    customClass: {
                        popup: 'swal2-popup-custom',
                    },
                }).then(() => {
                    router.push(`/author/buatSoal?testId=${testId}&pageName=${encodedPageName}`);
                });
            } else {
                console.error('Failed to process request:', response.statusText);
            }
    
        } catch (error) {
            console.error('Error:', error);
    
            // Menampilkan pesan error jika submit gagal
            await Swal.fire({
                title: 'Terjadi Kesalahan!',
                text: 'Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
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
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Header */}
            <header className="w-full bg-[#0B61AA] text-white p-4" style={{ maxWidth: '14540px' }}>
                <div className="flex justify-start items-center">
                    <button
                        className="block md:block lg:hidden text-white px-2 py-2 rounded-lg"
                        onClick={() => setShowNav(!showNav)}
                    >
                        {showNav ? (
                        <span className="flex items-center">
                            <PiListNumbers className="mr-2" size={30} /> Tutup Menu
                        </span>
                    ) : (
                        <PiListNumbers size={30} />
                        )}
                    </button>
                    <div className="flex items-start justify-start">
                        <img src="/images/etamtest.png" alt="Etamtest" className="h-[40px]" style={{ maxWidth: '179px' }} />
                    </div>
                </div>
            </header>

            {/* Navigasi untuk mobile */}
            {showNav && (
                <div className="fixed inset-0 z-40 bg-gray-800 bg-opacity-50 lg:hidden" />
            )}

            {showNav && (
                <div className="fixed inset-y-0 left-0 bg-white z-50 flex flex-col lg:hidden w-3/4 sm:w-2/3 md:w-1/2 transition-transform transform translate-x-0">
                    <div className="p-6 flex justify-between items-center">
                        <button
                            className="text-black bg-[#F3F3F3] px-2 py-1 rounded"
                            onClick={() => setShowNav(false)}
                        >
                            <PiListNumbers size={30} className="text-xl" />
                        </button>
                    </div>
                    <div className="mt-2 bg-[#F3F3F3] rounded-[20px] shadow-lg p-2 mx-4">
                        <div className="bg-[#0B61AA] p-2 rounded-[10px]" style={{ height: '50px' }}></div>
                        <div className="p-2 flex-grow">
                            <div className="grid grid-cols-5 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                                {Array.from({ length: questions.length }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-lg font-bold rounded border border-[#0B61AA] 
                                            ${currentOption === i + 1 ? 'bg-gray-600 text-white' : ''} 
                                            ${answeredQuestions.includes(i + 1) && currentOption !== i + 1 ? 'bg-gray-400' : 'bg-gray-200'} 
                                            hover:bg-gray-300`}
                                        onClick={() => handleClick(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* Question and Timer section */}
            <div className="flex flex-col lg:flex-row mt-12 p-6 mx-4 lg:mx-48 lg:space-x-6 rounded-[15px]">
                <div className="w-full lg:w-3/4 bg-[#0B61AA] p-6 sm:p-4 rounded-lg shadow-lg" style={{ maxWidth: '994px', height: 'auto' }}>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <h2 className="text-[12px] font-poppins sm:text-xs md:text-sm lg:text-lg font-bold text-white">{title}</h2>
                        <div className="flex items-center justify-center space-x-12 flex-grow">
                            <p className="text-[12px] sm:text-xs md:text-sm lg:text-lg font-poppins font-bold text-white ml-6">
                                {currentOption}/{questions.length}
                            </p>
                        </div>
                        <div className="bg-[#0B61AA] text-white font-poppins px-2 ml-8 py-2 rounded-[10px] border border-white font-bold text-[12px] sm:text-xs md:text-sm lg:text-lg">
                            Waktu Tersisa: {remainingTimeFormatted}
                        </div>
                    </div>


                    {/* Soal dan Opsi */}
                    {currentQuestion && (
                        <>
                            <div className="mb-6 sm:mb-4 bg-white p-4 sm:p-2 rounded-[15px] shadow">
                                <p className="text-lg font-poppins mb-6 sm:mb-4">{currentQuestion.questionText}</p>
                            </div>
                            {currentQuestion.options.map((option) => (
                                <div key={option.id} className="mb-4 sm:mb-2 bg-white p-4 sm:p-2 font-poppins rounded-lg shadow-lg">
                                    <input
                                        type="radio"
                                        id={option.id}
                                        name={`question-${currentQuestion.id}`}
                                        value={option.value}
                                        checked={selectedOption === option.value}
                                        onChange={() => handleOption(option.id, option.value, currentQuestion)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={option.id} className="text-xs sm:text-sm md:text-base">{option.label}</label>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row justify-between mt-6">
                        <div className="bg-white mb-4 p-4 rounded-[15px] shadow w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <div className="flex flex-row justify-center items-center w-full space-x-2 sm:space-x-4">
                                    {/* Tombol Soal Sebelumnya */}
                                    <button
                                        className="bg-transparent sm:bg-deepBlue text-black sm:text-white px-4 py-2 rounded-[15px] w-full max-w-[200px] flex justify-center items-center"
                                        style={{ height: '40px' }}
                                        onClick={handleprevquestion}
                                        disabled={currentOption === 1}>
                                        <span className="hidden font-poppins sm:block">Soal Sebelumnya</span>
                                        <CgArrowLeftR className="block sm:hidden text-lg text-black" />
                                    </button>

                                    {/* Tombol Ragu-Ragu */}
                                    <button
                                        className={`px-4 py-4 rounded-[15px] w-full max-w-[400px] text-black 
                                            ${markedReview[currentOption - 1] ? 'bg-yellow-500 hover:bg-yellow-600' : 
                                            answeredOptions[currentOption - 1] ? 'bg-[#F8B75B] hover:bg-yellow-500' : 
                                            'bg-[#F8B75B] hover:bg-yellow-500'}
                                            text-xs sm:text-sm lg:text-lg flex justify-center items-center lg:bg-yellow-500`} // Add bg blue for desktop
                                        style={{ height: '40px', whiteSpace: 'nowrap' }} // Prevent text wrapping
                                        onClick={handlemarkreview}>
                                        <span className="text-center font-poppins w-full">Ragu-Ragu</span>
                                    </button>

                                    {/* Tombol Submit / Soal Selanjutnya */}
                                    {currentOption === questions.length ? (
                                        <button
                                        className="bg-[#0B61AA] font-poppins text-white px-4 py-1 rounded-[15px] hover:bg-blue-700  lg:mb-0 w-full max-w-[150px] 
                                        text-xs sm:text-sm md:text-base lg:text-lg"  // Adjust text size and padding for mobile
                                        style={{ height: '40px' }}
                                        onClick={handleSubmit}>
                                        Submit
                                    </button>
                                    
                                    
                                    ) : (
                                        <button
                                            className="bg-transparent sm:bg-deepBlue text-black sm:text-white px-4 py-2 rounded-[15px]  w-full max-w-[200px] flex justify-center items-center"
                                            style={{ height: '40px' }}
                                            onClick={handlenextquestion}>
                                            <span className="hidden font-poppins sm:block">Soal Selanjutnya</span>
                                            <CgArrowRightR className="sm:hidden text-lg" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Question navigation */}
                <div className="hidden lg:block lg:w-1/4 mt-6 lg:mt-0 bg-[#F3F3F3] rounded-[20px] shadow-lg">
                    <div className="bg-[#0B61AA] p-4 rounded-[10px]" style={{ height: '50px' }}></div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {Array.from({ length: questions.length }, (_, i) => (
                                    <button
                                    key={i + 1}
                                    className={`w-10 h-10 text-lg font-poppins font-bold rounded border border-[#0B61AA] 
                                        ${currentOption === i + 1 ? 'bg-gray-600 text-white' : ''}  {/* Tombol yang aktif */}
                                        ${answeredQuestions.includes(i + 1) && currentOption !== i + 1 ? 'bg-gray-400' : 'bg-gray-200'}  {/* Soal yang sudah dijawab */}
                                        hover:bg-gray-300`}
                                        onClick={() => setCurrentOption(i + 1)}
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
