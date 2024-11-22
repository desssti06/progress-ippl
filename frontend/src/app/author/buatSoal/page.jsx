'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const KotakNomor = () => {
  const router = useRouter();
  const [testId, setTestId] = useState('');
  const [pages, setPages] = useState([]);
  const [multiplechoiceId, setMultiplechoiceId] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isRenaming, setIsRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const savedPages = localStorage.getItem(`pages-${testId}`);
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    } else {
      const initialPages = [{ pageNumber: 1, questions: [1], pageName: 'Beri Nama Tes' }];
      setPages(initialPages);
      localStorage.setItem(`pages-${testId}`, JSON.stringify(initialPages));
    }
  }, [testId]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const testIdFromUrl = params.get("testId");
    const multiplechoiceIdFromUrl = params.get("multiplechoiceId");
    const pageNameFromUrl = params.get("pageName") || localStorage.getItem('pageName');

    if (testIdFromUrl) {
      setTestId(testIdFromUrl);
      const savedPages = localStorage.getItem(`pages_${testIdFromUrl}`);
      if (savedPages) {
        setPages(JSON.parse(savedPages));
      } else {
        fetchPagesFromDB(testIdFromUrl); // Fetch pages from DB if not in local storage
      }
    }

    if (multiplechoiceIdFromUrl) {
      setMultiplechoiceId(multiplechoiceIdFromUrl);
    }

    if (pageNameFromUrl) {
      setPages((prevPages) => prevPages.map((page) => ({
        ...page,
        pageName: decodeURIComponent(pageNameFromUrl),
      })));
    }

  }, []);

  const getMaxQuestionNumberInPage = (page) => {
    if (Array.isArray(page.questions)) {
      return Math.max(...page.questions);
    }
    return 0;
  };

  const getAllUsedNumbers = (pages) => {
    const usedNumbers = new Set();
    pages.forEach(page => {
      if (Array.isArray(page.questions)) {
        page.questions.forEach(num => usedNumbers.add(num));
      }
    });
    return Array.from(usedNumbers).sort((a, b) => a - b);
  };

  const getNextAvailableNumber = (pages) => {
    const usedNumbers = getAllUsedNumbers(pages);
    let nextNumber = 1;
    
    // Mencari nomor terendah yang belum digunakan
    while (usedNumbers.includes(nextNumber)) {
      nextNumber++;
    }
    return nextNumber;
  };

  const reorderAllPages = (pages) => {
    let nextNumber = 1;
    return pages.map(page => ({
      ...page,
      questions: page.questions.map(() => nextNumber++)
    }));
  };

  const updateQuestionNumbersInDB = async (testId, maxQuestionNumber) => {
    try {
      // Dapatkan semua nomor soal yang ada di database untuk tes ini
      const response = await fetch(`http://localhost:2000/api/multiplechoice/getQuestionNumbers?testId=${testId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      const questionNumbers = data.questionNumbers;
  
      // Filter nomor soal yang lebih besar dari nomor terbesar di halaman saat ini
      const numbersToUpdate = questionNumbers.filter(num => num > maxQuestionNumber);
  
      // Jika tidak ada nomor yang lebih besar, keluar dari fungsi
      if (numbersToUpdate.length === 0) {
        return;
      }
  
      // Update nomor soal di database
      for (const number of numbersToUpdate) {
        const updateResponse = await fetch(`http://localhost:2000/api/multiplechoice/update-questionNumber?testId=${testId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldNumber: number,
            newNumber: number + 1,
          }),
        });
  
        if (!updateResponse.ok) {
          throw new Error(`HTTP error ${updateResponse.status} when updating question number ${number}`);
        }
      }
    } catch (error) {
      console.error('Error updating question numbers in DB:', error);
    }
  };

  const addQuestion = async (pageIndex) => {
    try {
      // Dapatkan nomor terbesar di halaman saat ini
      const maxQuestionNumber = getMaxQuestionNumberInPage(pages[pageIndex]);
  
      // Cek apakah nomor sebelumnya sudah ada di database
      const multiplechoiceId = await fetchMultipleChoiceId(testId, maxQuestionNumber);
      if (!multiplechoiceId) {
        // Tampilkan peringatan jika nomor sebelumnya belum ada di database
        alert(`Silakan isi nomor soal ${maxQuestionNumber} terlebih dahulu.`);
        return;
      }
  
      // Update nomor soal di database yang lebih besar dari nomor terbesar di halaman saat ini
      await updateQuestionNumbersInDB(testId, maxQuestionNumber);

      setPages(prevPages => {
        const updatedPages = [...prevPages];
        const currentPage = { ...updatedPages[pageIndex] };
        currentPage.questions = [...(currentPage.questions || []), getNextAvailableNumber(updatedPages)];
        currentPage.questions.sort((a, b) => a - b);    
        updatedPages[pageIndex] = currentPage;

        const finalPages = reorderAllPages(updatedPages);
        localStorage.setItem(`pages-${testId}`, JSON.stringify(finalPages));
        return finalPages;
      });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const addPage = async () => {
    try {
      // Get the next available question number
      const nextNumber = getNextAvailableNumber(pages);
  
      // Check if the previous question number is already in the database
      const multiplechoiceId = await fetchMultipleChoiceId(testId, nextNumber - 1);
      if (!multiplechoiceId) {
        // Show a warning if the previous question number is not filled
        alert(`Silakan isi nomor soal ${nextNumber - 1} terlebih dahulu.`);
        return;
      }
  
      setPages(prevPages => {
        const newPage = {
          pageNumber: prevPages.length + 1,
          questions: [nextNumber],
          pageName: 'Beri Nama Tes',
          isDropdownOpen: false
        };
  
        const updatedPages = [...prevPages, newPage];
        localStorage.setItem(`pages-${testId}`, JSON.stringify(updatedPages));
        return updatedPages;
      });
    } catch (error) {
      console.error('Error adding page:', error);
    }
  };

  const toggleDropdown = (pageIndex) => {
    setPages(prevPages => 
      prevPages.map((page, index) => ({
        ...page,
        isDropdownOpen: index === pageIndex ? !page.isDropdownOpen : false
      }))
    );
  };

  const handleRename = (pageIndex) => {
    setIsRenaming(pageIndex);
    setRenameValue(pages[pageIndex].pageName);
  };

  const saveRename = async (pageIndex) => {
    try {
      await fetch(`http://localhost:2000/api/multiplechoice/update-pageName`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: testId,
          pageIndex: pageIndex,
          pageName: renameValue,
        }),
      });
      setPages((prevPages) => {
        const updatedPages = prevPages.map((page, index) => {
          if (index === pageIndex) {
            return { ...page, pageName: renameValue };
          }
          return page;
        });
        localStorage.setItem(`pages-${testId}`, JSON.stringify(updatedPages));
        return updatedPages;
      });
      setIsRenaming(null);
    } catch (error) {
      console.error("Error updating pageName:", error);
    }
  };

  const deletePage = (pageIndex) => {
    if (confirm("Apakah Anda yakin ingin menghapus tes ini?")) {
      setPages((prevPages) => {
        const updatedPages = prevPages.filter((_, index) => index !== pageIndex);
        
        // Recalculate all question numbers after deletion
        const finalPages = updatedPages.reduce((acc, page, idx) => {
          if (idx === 0) return [page];
          
          const prevPageLastNumber = Math.max(...acc[idx - 1].questions);
          const numQuestions = page.questions.length;
          const newQuestions = Array.from(
            { length: numQuestions },
            (_, i) => prevPageLastNumber + i + 1
          );
          
          acc.push({
            ...page,
            questions: newQuestions
          });
          
          return acc;
        }, []);

        localStorage.setItem(`pages-${testId}`, JSON.stringify(finalPages));
        return finalPages;
      });
    }
  };

  const fetchPagesFromDB = async (testId) => {
    try {
      const response = await fetch(`http://localhost:2000/api/multiplechoice/getPages?testId=${testId}`);
      const data = await response.json();

      if (response.ok) {
        setPages(data.pages);
      } else {
        console.error('Failed to fetch pages:', data.message);
      }
    } catch (error) {
      console.error("Failed to fetch pages from DB:", error);
    }
  };

  const fetchMultipleChoiceId = async (testId, number) => {
    try {
      const response = await fetch(`http://localhost:2000/api/multiplechoice/${testId}/${number}`);
  
      if (response.status === 404) {
        console.warn(`Nomor soal ${number} belum dibuat.`);
        return null; 
      }
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.id; 
    } catch (error) {
      console.error('Error fetching multiplechoiceId:', error);
      return null; 
    }
  };  

  const handleQuestionSelect = async (questionNumber, pageIndex) => {
    if (!testId) {
      console.error("testId is null. Cannot navigate.");
      return;  
    }
    
    const multiplechoiceId = await fetchMultipleChoiceId(testId, questionNumber);
    const pageName = pages[pageIndex]?.pageName || '';
  
    if (multiplechoiceId !== "null") {
      console.log("multiplechoiceId not found. You can create a new one.");
      router.push(`/author/buatSoal/page1?testId=${testId}&multiplechoiceId=${multiplechoiceId}&nomor=${questionNumber}&pageName=${pageName}`);
    }
  
    setSelectedNumber(questionNumber);
    
    router.push(`/author/buatSoal/page1?testId=${testId}&multiplechoiceId=${multiplechoiceId}&nomor=${questionNumber}&pageName=${pageName}`);
  };    
  
  const handleSave = () => {
    if (!testId) {
      console.error("testId is null. Cannot navigate.");
      return; 
    }

    router.push(`/author/buattes/publik/syarat?testId=${testId}`);
  };

  return (
    <div className="">
      <header className="bg-deepBlue text-white p-4 sm:p-6 w-auto h-[80px]">
        <div className="container  flex items-center">
          <div className="flex space-x-4 w-full">
            <Link href="/author/dashboard">
              <img src="/images/etamtest.png" alt="EtamTest" className="h-6 sm:h-9 absolute left-16 absolute top-5" // Gunakan positioning absolute untuk posisi kiri
                style={{ maxWidth: '279px' }} />
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full p-0">
        <nav className="bg-[#FFFF] text-black p-4 sm:p-6">
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

      {Array.isArray(pages) && pages.map((page, pageIndex) => (
        <div key={page.pageNumber} className="my-4">
          <div className="container flex justify-between items-center bg-[#0B61AA] text-white p-2" style={{ maxWidth: '1376px', height: '61px' }}>
            {isRenaming === pageIndex ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="text-black p-1 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => saveRename(pageIndex)}
                  className="ml-2 bg-white text-black px-2 py-1 rounded-md"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2 className="text-lg">{page.pageName}</h2>
            )}

            <div className="relative">
              <button 
                className="text-white font-bold text-2xl mr-2"
                onClick={() => toggleDropdown(pageIndex)}
              >
                :
              </button>

              {page.isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg z-10 p-1
                  before:content-[''] before:absolute before:-top-4 before:right-5 before:border-8
                  before:border-transparent before:border-b-white"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                      onClick={() => handleRename(pageIndex)}
                      className="block px-4 py-2 text-deepBlue text-sm text-gray-700 hover:bg-deepBlue hover:text-white rounded-md"
                  >
                      Rename
                  </button>
                  <button
                      onClick={() => deletePage(pageIndex)}
                      className="block px-4 py-2 text-deepBlue text-sm text-gray-700 hover:bg-deepBlue hover:text-white rounded-md"
                  >
                      Delete page
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4"></div>
          <div className="flex flex-row flex-wrap p-4 gap-3 justify-start border" style={{ maxWidth: '100%', padding: '0 2%' }}>
            {Array.isArray(page.questions) && page.questions.map((question, questionIndex) => (
              <div
                key={`${pageIndex}-${question}`}
                className="flex flex-col items-center border border-gray-300 p-2 bg-white rounded-lg shadow-md cursor-pointer"
                style={{ width: '80px', height: '80px' }}
                onClick={() => handleQuestionSelect(question, pageIndex)} 
              >
                <span className="bg-white border rounded-full w-8 h-8 flex items-center justify-center mb-2 rounded-[15px]">
                  {question}
                </span>
              </div>
            ))}

            <div className="flex items-center">
              <button
                onClick={() => addQuestion(pageIndex)}
                className="bg-[#A6D0F7] text-black px-4 py-2 rounded-[15px] shadow-lg"
              >
                + Soal
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          onClick={addPage}
          className="bg-[#0B61AA] border border-black flex items-center space-x-2 px-4 py-2 hover:text-white font-poppins rounded-[15px] shadow-lg"
        >
          + Tambah Page
        </button>
        
        <div className="flex justify-end space-x-2 mr-4">
          <button
            onClick={handleSave} 
            className="bg-[#E8F4FF] border border-black flex items-center space-x-2 px-4 py-2 hover:text-black font-poppins rounded-[15px] shadow-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default KotakNomor;