'use client';
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useEffect } from 'react';
import sanitizeHtml from 'sanitize-html';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storage } from "../../../firebase/config";
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dynamic from 'next/dynamic';
import { AiOutlineCloseSquare } from 'react-icons/ai';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false 
});

const MembuatSoal = () => {
  const router = useRouter();
  const [testId, setTestId] = useState('');
  const [multiplechoiceId, setMultiplechoiceId] = useState('');
  const [id, setId] = useState('');
  const [pageName, setPageName] = useState('');
  const [question, setQuestion] = useState('');
  const [number, setNumber] = useState('');
  const [questionPhoto, setQuestionPhoto] = useState(null);
  const [weight, setWeight] = useState();
  const [discussion, setDiscussion] = useState('');
  const [options, setOptions] = useState([{ optionDescription: '', isCorrect: false }]);
  const [pages, setPages] = useState([{ questions: [] }]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [labelCount, setLabelCount] = useState(0); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testIdFromUrl = params.get("testId");
    const multiplechoiceIdFromUrl = params.get("multiplechoiceId");
    const pageNameFromUrl = params.get("pageName");
    const numberFromUrl = params.get("nomor");

    console.log("Fetched testId:", testIdFromUrl); 
    console.log("Fetched multiplechoiceId:", multiplechoiceIdFromUrl); 
    console.log("Raw pageName from URL:", pageNameFromUrl);

    if (pageNameFromUrl) {
      const decodedPageName = decodeURIComponent(pageNameFromUrl);
      console.log("Decoded pageName:", decodedPageName);
      setPageName(decodedPageName);
    }
    if (testIdFromUrl) {
      setTestId(testIdFromUrl);
    }
    if (multiplechoiceIdFromUrl) {
      setMultiplechoiceId(multiplechoiceIdFromUrl); 
    }
    if (numberFromUrl) setNumber(numberFromUrl);
  }, []);

  useEffect(() => {
    if (!multiplechoiceId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:2000/api/multiplechoice/question/${multiplechoiceId}`);
        if (!response.ok) {
          const errorMessage = await response.text(); 
          throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }
        const data = await response.json();
        console.log('Response dari API:', data);
        // setPageName(data.pageName);
        setWeight(data.weight);
        setNumber(data.number);
        setQuestion(data.question);
        setOptions(data.option);
        setDiscussion(data.discussion);
        if (data.questionPhoto) {
          setQuestionPhoto(data.questionPhoto);
        }

        if (data.option && Array.isArray(data.option)) {
          setOptions(data.option.map(opt => ({
            id: opt.id,
            optionDescription: opt.optionDescription,
            isCorrect: opt.isCorrect
          })));
        }
        
      } catch (error) {
        console.error('Error fetching question:', error);
        setError('Terjadi kesalahan saat memuat data: ' + error.message);
      }
    };
  
    fetchData();
  }, [multiplechoiceId]);
  
  const addOption = () => {
    setOptions([...options, { optionDescription: '', isCorrect: false }]);
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = options.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    );
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,  // Setel hanya opsi yang dipilih ke true
    }));
    setOptions(newOptions);
  };

  const cleanHtml = (html) => {
    return sanitizeHtml(html, {
      allowedTags: [], 
      allowedAttributes: {},
    });
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setWeight(value); 
    }
  }

  const loadPagesFromLocalStorage = () => {
    if (testId && typeof window !== 'undefined') {
        const savedPages = localStorage.getItem(`pages_${testId}`);
        if (savedPages) {
          return JSON.parse(savedPages);
        }
    }
    return null;
  };

  useEffect(() => {
      const savedPages = loadPagesFromLocalStorage();
      if (savedPages) {
          setPages(savedPages);
      }
  }, [testId]); 

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      try {
        // Ambil key localStorage yang benar
        const localStorageKey = `pages-${testId}`;
        
        // Cek apakah multiplechoiceId ada
        if (multiplechoiceId) {
          // 1. Hapus data dari database
          const response = await fetch(`http://localhost:2000/api/multiplechoice/question/${multiplechoiceId}`, {
            method: 'DELETE',
          });
  
          if (!response.ok) {
            throw new Error('Gagal menghapus soal dari database');
          }
        }
  
        // 2. Ambil data pages dari localStorage
        const savedPages = localStorage.getItem(localStorageKey);
        console.log('Data sebelum dihapus:', savedPages); // Debug
  
        if (savedPages) {
          let pages = JSON.parse(savedPages);
          
          // 3. Temukan dan hapus nomor soal dari pages
          let deletedNumber = null;
          let deletedPageIndex = -1;
          
          // Cari nomor yang akan dihapus
          pages.forEach((page, pageIndex) => {
            const questionIndex = page.questions.indexOf(parseInt(number));
            if (questionIndex !== -1) {
              deletedNumber = parseInt(number);
              deletedPageIndex = pageIndex;
              // Hapus nomor dari array questions
              page.questions.splice(questionIndex, 1);
            }
          });
  
          console.log('Nomor yang dihapus:', deletedNumber); // Debug
          console.log('Data setelah splice:', pages); // Debug
  
          // 4. Reorder semua nomor setelah penghapusan
          if (deletedNumber !== null) {
            // Flatkan semua nomor dari semua halaman
            const allNumbers = pages.reduce((acc, page) => [...acc, ...page.questions], []);
            console.log('Semua nomor setelah flatten:', allNumbers); // Debug
            
            // Update nomor-nomor yang lebih besar dari nomor yang dihapus
            pages = pages.map(page => ({
              ...page,
              questions: page.questions.map(num => 
                num > deletedNumber ? num - 1 : num
              ).sort((a, b) => a - b)
            }));
  
            console.log('Data setelah reorder:', pages); // Debug
  
            // 5. Hapus page jika tidak ada soal tersisa
            pages = pages.filter(page => page.questions.length > 0);
            
            // 6. Update localStorage dengan key yang benar
            localStorage.setItem(localStorageKey, JSON.stringify(pages));
            
            console.log('Data final yang disimpan:', pages); // Debug
          }
        }
  
        // 7. Redirect kembali ke halaman luar
        router.push(`/author/buatSoal?testId=${testId}`);
        
      } catch (error) {
        console.error('Error saat menghapus soal:', error);
        alert('Terjadi kesalahan saat menghapus soal. Silakan coba lagi.');
      }
    }
  };

  const handleDeleteJawaban = async (index, optionId) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);

    try {
      if (optionId) {
        const response = await fetch(`http://localhost:2000/api/multiplechoice/option/${optionId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            console.error('Failed to delete option:', response.statusText);
        } else {
          console.log('Opsi berhasil dihapus dari server');
        } 
      }
    } catch (error) {
        console.error('Error deleting option:', error);
    }
  };

  const [jawabanBenar, setJawabanBenar] = useState(null);

  const handleJawabanBenarChange = (index) => {
    setJawabanBenar(index);
  };

  // const uploadImage = () => {
  //   if (questionPhoto == null) return;
  //     const imageRef = ref(storage, `question/${questionPhoto.name + v4()}`)
  //     uploadBytes(imageRef, questionPhoto).then(() => {
  //       alert("image uploaded");
  //     })
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Handle image upload if exists
      let uploadedImageUrl = "";
      if (questionPhoto) {
        const imageRef = ref(storage, `question/${questionPhoto.name + v4()}`);
        const snapshot = await uploadBytes(imageRef, questionPhoto);
        uploadedImageUrl = await getDownloadURL(snapshot.ref); // Mendapatkan URL download gambar
      }
  
      // Prepare common data structure
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
        response = await fetch(`http://localhost:2000/api/multiplechoice/update-question/${multiplechoiceId}`, {
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
        response = await fetch('http://localhost:2000/api/multiplechoice/add-questions', {
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
        router.push(`/author/buatSoal?testId=${testId}&pageName=${encodedPageName}`);
      } else {
        console.error('Failed to process request:', response.statusText);
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="mx-auto">
      <header className="bg-deepBlue text-white p-4 sm:p-6 w-auto h-[80px]">
        <div className="container  flex items-center">
          <div className="flex space-x-4 w-full">
            <Link href="/homeAuthor">
              <img src="/images/etamtest.png" alt="EtamTest" className="h-6 sm:h-9 absolute left-16 absolute top-5" // Gunakan positioning absolute untuk posisi kiri
                style={{ maxWidth: '279px' }} />
            </Link>
          </div>
        </div>
      </header>
  
      <div className="container mx-auto lg: p-2 p-4 w-full" style={{ maxWidth: '1309px' }}>
      <nav className="container bg-[#FFFF] text-black p-4 sm:p-6">
        <ul className="flex space-x-6 sm:space-x-20">
          <li>
            <button
              className={`w-[120px] sm:w-[220px] h-[48px] rounded-[20px] shadow-md font-bold font-poppins ${activeTab === 'buatTes' ? 'bg-[#78AED6]' : ''}`}
              onClick={() => setActiveTab('buatTes')}
              >
              Buat Soal
            </button>
          </li> 
          <li>
            <button
              className={`w-[120px] sm:w-[220px] h-[48px] rounded-[20px] shadow-md font-bold font-poppins ${activeTab === 'publikasi' ? 'bg-[#78AED6]' : ''}`}
              onClick={() => setActiveTab('publikasi')}
              >
              Publikasi
            </button>
          </li>
        </ul>
      </nav>
  
        <header className='bg-[#0B61AA] font-bold font-poppins text-white p-4'>
          <div className="flex items-center justify-between">
            <span>{pageName}</span>
          </div>
        </header>
  
        <div className="bg-[#FFFFFF] border border-black p-4 rounded-lg shadow-md w-full mb-6 " >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='mb-4'>
              <label htmlFor="soal">No.      </label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div className='m'>
              <div className='border border-black bg-[#D9D9D9] p-2 rounded mb-4' style={{ maxWidth: '1309px', height: '250px' }}>
                <div className='p-4 flex justify-between items-center mb-0.5 w-full'>
                  <div className='flex items-center'>
                    <label className="block mb-2">Soal Pilihan Ganda</label>
                  </div>
                  <div className='flex items-center'>
                    <label className="font-medium-bold mr-2">Bobot</label>
                    <input
                      type="text"
                      step="0.01"
                      min="0"
                      id="weight"
                      value={weight}
                      onChange={handleWeightChange}
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                </div>
                <ReactQuill 
                  value={question} 
                  onChange={setQuestion} 
                  modules={{
                    toolbar: [
                      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['bold', 'italic', 'underline'],
                      ['image'],
                      ['clean']
                    ],
                    // handlers: {
                    //   image: () => document.getElementById('imageUpload').click() // Trigger input file upload
                    // }
                  }}
                  formats={[
                    'header',
                    'font',
                    'list',
                    'bullet',
                    'bold',
                    'italic',
                    'underline',
                    'image',
                  ]}
                  // onImageUpload={uploadImage}
                  className='bg-white shadow-md rounded-md border border-gray-500'
                  style={{ maxWidth: '1220px', height: '150px', overflow: 'hidden' }}
                  placeholder='Buat Soal di sini...'
                  required 
                />
              </div>
            </div>

            <div className="mb-4">
              <input
                type="file"
                onChange={(event) => setQuestionPhoto(event.target.files[0])}
                className="border p-2 w-full"
                accept="image/*"
              />
            </div>
  
            <div>
            <h2 className="text-lg font-semi-bold mb-2">Jawaban</h2>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={option.optionDescription}
                  onChange={(e) => handleOptionChange(index, 'optionDescription', e.target.value)}
                  placeholder="Tulis jawaban untuk opsi"
                  className="p-2 w-full"
                  theme='snow'
                  required
                />
                <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center justify-between text-black font-bold px-4 rounded-[10px] border border-black space-x-2"
                    >
                      <input
                        type="radio"
                        id={`jawaban-${index}`}
                        name="jawabanBenar"
                        value={index}
                        checked={option.isCorrect}
                        onChange={() => handleCorrectOptionChange(index)}
                        className="w-4 h-4"
                      />
                      <span>Benar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteJawaban(index, option.id)}
                      className="ml-4"
                    >
                      {/* Ganti gambar dengan ikon React */}
                      <AiOutlineCloseSquare className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addOption} className="bg-[#7bb3b4] hover:bg-[#8CC7C8] text-black font-bold py-2 px-4 rounded-[15px] border border-black">
                + Tambah
              </button>
            </div>
  
            <div className="mb-4">
              <label className="block mb-2">Pembahasan</label>
              <ReactQuill 
                value={discussion} 
                onChange={setDiscussion} 
                modules={{
                  toolbar: [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline'],
                    ['clean']
                  ]
                }}
                formats={[
                  'header',
                  'font',
                  'list',
                  'bullet',
                  'bold',
                  'italic',
                  'underline',
                ]}
                // onImageUpload={uploadImage}
                placeholder='Tulis kunci jawaban di sini...' />
            </div>
          </form>
          <div className='mt-4 flex justify-end space-x-4 -mr-2'>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className="bg-[#E58A7B] border border-black px-4 py-2 hover:text-white font-poppins rounded-[15px]"
              >
                Hapus
              </button>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleSubmit} className="bg-[#E8F4FF] border border-black px-4 py-2 hover:text-white font-poppins rounded-[15px]">Simpan</button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#A6D0F7] border border-black px-4 py-2 hover:text-white font-poppins rounded-[15px]"
                >
                  Kembali
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default MembuatSoal;