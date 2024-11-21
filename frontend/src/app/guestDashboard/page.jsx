"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { SlBookOpen } from "react-icons/sl";
import { IoIosLock } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

export default function GuestDashboard() {
  const [popularTests, setPopularTests] = useState([]);
  const [freeTests, setFreeTests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState([""]);
  const [loading, setLoading] = useState([true]);
  const [error, setError] = useState([null]);

  useEffect(() => {
    const fetchPopularTests = async () => {
      try {
        const response = await fetch(
          "http://localhost:2000/dashboard/popular-tests"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch popular tests");
        }
        const data = await response.json();
        setPopularTests(data);
      } catch (error) {
        console.error("Error fetching popular tests:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTests();
  }, []);

  useEffect(() => {
    const fetchFreeTests = async () => {
      try {
        const response = await fetch(
          "http://localhost:2000/dashboard/free-tests"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch free tests");
        }
        const data = await response.json();
        setFreeTests(data);
      } catch (error) {
        console.error("Error fetching free tests:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeTests();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `http://localhost:2000/dashboard/search-tests?title=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to search tests");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching tests:", error);
      setError(error.message);
    }
  };

  if (loading && !error) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const [searchcurrentIndex, searchsetCurrentIndex] = useState(0);
  const [searchitemsToShow, setSearchItemsToShow] = useState(2);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setSearchItemsToShow(4); // Tampilkan 4 item di desktop
      } else {
        setSearchItemsToShow(2); // Tampilkan 2 item di mobile
      }
    };

    // Jalankan saat component dimuat
    updateItemsToShow();

    // Tambahkan event listener untuk mendeteksi perubahan ukuran layar
    window.addEventListener("resize", updateItemsToShow);

    // Bersihkan event listener saat component dilepas
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const searchnextSlide = () => {
    if (searchcurrentIndex < searchResults.length - searchitemsToShow) {
      searchsetCurrentIndex(searchcurrentIndex + 1);
    }
  };

  const searchprevSlide = () => {
    if (searchcurrentIndex > 0) {
      searchsetCurrentIndex(searchcurrentIndex - 1);
    }
  };

  // fungsi slider section populer
  const [populercurrentIndex, populersetCurrentIndex] = useState(0);
  const [populeritemsToShow, setPopulerItemsToShow] = useState(2);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setPopulerItemsToShow(4); // Tampilkan 4 item di desktop
      } else {
        setPopulerItemsToShow(2); // Tampilkan 2 item di mobile
      }
    };

    // Jalankan saat component dimuat
    updateItemsToShow();

    // Tambahkan event listener untuk mendeteksi perubahan ukuran layar
    window.addEventListener("resize", updateItemsToShow);

    // Bersihkan event listener saat component dilepas
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const populernextSlide = () => {
    if (populercurrentIndex < popularTests.length - populeritemsToShow) {
      populersetCurrentIndex(populercurrentIndex + 1);
    }
  };

  const populerprevSlide = () => {
    if (populercurrentIndex > 0) {
      populersetCurrentIndex(populercurrentIndex - 1);
    }
  };

  // fungsi slider section gratis
  const [gratiscurrentIndex, gratissetCurrentIndex] = useState(0);
  const [gratisitemsToShow, setGratisItemsToShow] = useState(2);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setGratisItemsToShow(4); // Tampilkan 4 item di desktop
      } else {
        setGratisItemsToShow(2); // Tampilkan 2 item di mobile
      }
    };

    // Jalankan saat component dimuat
    updateItemsToShow();

    // Tambahkan event listener untuk mendeteksi perubahan ukuran layar
    window.addEventListener("resize", updateItemsToShow);

    // Bersihkan event listener saat component dilepas
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const gratisnextSlide = () => {
    if (gratiscurrentIndex < freeTests.length - gratisitemsToShow) {
      gratissetCurrentIndex(gratiscurrentIndex + 1);
    }
  };

  const gratisprevSlide = () => {
    if (gratiscurrentIndex > 0) {
      gratissetCurrentIndex(gratiscurrentIndex - 1);
    }
  };

  const menus = [
    { href: "/guestDashboard", text: "Home" },
    { href: "/auth/login", text: "Favorit" },
    { href: "/auth/login", text: "Transaksi" },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const categories = [
    { href: "/auth/login", src: "/images/pemrograman.png", alt: "pemrograman" },
    { href: "/auth/login", src: "/images/cpns.png", alt: "cpns" },
    { href: "/auth/login", src: "/images/psikotes.png", alt: "psikotes" },
    { href: "/auth/login", src: "/images/utbk.png", alt: "utbk" },
  ];

  // fungsi slider catagories
  const [catagoriescurrentIndex, catagoriessetCurrentIndex] = useState(0);
  const [catagoriesitemsToShow, setCatagoriesItemsToShow] = useState(2);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setCatagoriesItemsToShow(4); // Tampilkan 4 item di desktop
      } else {
        setCatagoriesItemsToShow(2); // Tampilkan 2 item di mobile
      }
    };

    // Jalankan saat component dimuat
    updateItemsToShow();

    // Tambahkan event listener untuk mendeteksi perubahan ukuran layar
    window.addEventListener("resize", updateItemsToShow);

    // Bersihkan event listener saat component dilepas
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const catagoriesnextSlide = () => {
    if (catagoriescurrentIndex < categories.length - catagoriesitemsToShow) {
      catagoriessetCurrentIndex(catagoriescurrentIndex + 1);
    }
  };

  const catagoriesprevSlide = () => {
    if (catagoriescurrentIndex > 0) {
      catagoriessetCurrentIndex(catagoriescurrentIndex - 1);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="fixed p-4 bg-deepBlue top-0 left-0 right-0 text-white w-full font-poppins lg:p-3 z-50">
        <div className="mx-auto flex justify-between items-center font-poppins max-w-full ">
          <div className="flex justify-between">
            {/* Ikon Menu untuk mobile */}
            <button onClick={toggleSidebar}>
              <img
                src="/images/menu-white.png"
                alt="Menu"
                className="h-[30px] lg:hidden"
              />
            </button>

            {/* Logo utama */}
            <Link href="/">
              <img
                src="/images/etamtest.png"
                alt="EtamTest"
                className="h-[30px] lg:h-10 pl-3"
              />
            </Link>
          </div>

          {/* Navigation Bar untuk desktop */}
          <nav className="md:block lg:block flex">
            <ul className="flex lg:space-x-7 md:space-x-4">
              {menus.map((menu, index) => (
                <li key={index}>
                  <Link legacyBehavior href={menu.href}>
                    <a className="hidden hover:text-orange font-bold lg:block">
                      {menu.text}
                    </a>
                  </Link>
                </li>
              ))}
              <div className="pl-2 flex">
                <li>
                  <Link href="/auth/login" legacyBehavior>
                    <a className="hover:text-orange text-xs font-poppins m-4">
                      Masuk
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/registrasi" legacyBehavior>
                    <a className="hover:bg-orange hover:text-deepBlue text-deepBlue bg-paleBlue p-1 lg:p-2 rounded-2xl text-xs font-poppins">
                      Daftar
                    </a>
                  </Link>
                </li>
              </div>
            </ul>
          </nav>
        </div>
      </header>

      {/* Sidebar ketika tampilan mobile */}
      <aside
        className={`fixed top-16 pt-6 left-0 w-64 bg-white h-full transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden z-40`}
      >
        <ul className="p-4 space-y-4 text-deepblue round-lg">
          <div className="flex flex-col items-center">
            <li>
              <img
                src="/images/profile-black.png"
                alt="profile"
                className="h-14 cursor-pointer mb-2"
              />
            </li>
            <p className="font-bold">Guest</p>
          </div>
          {menus.map((menu, index) => (
            <li key={index}>
              <Link legacyBehavior href={menu.href}>
                <a className="block hover:text-deepBlue hover:bg-paleBlue font-bold p-2">
                  {menu.text}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay untuk menutup sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Search Bar */}
      <section className="bg-gradient-custom p-20 lg:pt-40 pt-30">
        <div className="container justify-between mt-10 lg:mt-4 lg:max-w-[610px] max-w-full ">
          <form
            onSubmit={handleSearch}
            className="flex items-center p-1 rounded-2xl bg-white w-full font-poppins"
          >
            <input
              type="text"
              placeholder="Cari Tes Soal"
              className="flex-grow p-1 lg:p-2  rounded-2xl focus:outline-none focus:ring-2 focus:ring-powderBlue font-poppins max-w-[130px] lg:max-w-[610px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="p-1 lg:p-2 text-deepBlue font-bold rounded-2xl hover:bg-gray-200 font-poppins "
            >
               <FaSearch className="h-5 w-5 text-gray-600" />
            </button>
          </form>
        </div>
      </section>

      {/* Bagian search bar */}
      {searchResults.length > 0 && (
        <section className="block mx-auto p-5 font-poppins relative">
          <div className="mx-auto mt-5 font-bold font-poppins text-deepBlue">
            Hasil Pencarian
            {/* Container untuk kategori, menambahkan grid layout yang konsisten */}
            <div className=" mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {searchResults
                .slice(
                  searchcurrentIndex,
                  searchcurrentIndex + searchitemsToShow
                )
                .map((test) => (
                  <div
                    key={test.testId}
                    className="bg-abumuda shadow-lg relative group"
                  >
                    <div className="flex justify-between items-center ">
                      <div className="flex items-center space-x-2 font-bold text-deepBlue">
                        <div className="flex items-center space-x-2 font-bold text-deepBlue p-2">
                          <FaEye />
                          <span className="text-[0.6rem] lg:text-sm font-poppins">{test.accessCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-2 lg:mt-4 relative z-20">
                      <div className="text-8xl">
                          <SlBookOpen />
                      </div>
                    </div>

                    <div className="flex justify-center mt-2 lg:mt-4 text-deepBlue relative z-20">
                      <h3 className="text-center text-[0.8rem] lg:text-lg font-bold mt-0 lg:mt-2 font-poppins">
                        {test.category}
                      </h3>
                    </div>

                    <div className="bg-deepBlue text-white p-1 lg:p-2  mt-4 relative z-20 ">
                      <div className="flex items-center space-x-2 justify-between">
                        <h3 className="text-left text-[0.625rem] lg:text-base font-bold mt-2">
                          {test.title}
                        </h3>
                      </div>

                      <p className="text-left text-[0.5rem] lg:text-sm leading-relaxed">
                        Prediksi kemiripan {test.similarity}%
                      </p>
                      <p className="text-[0.4rem] lg:text-xs leading-relaxed">
                        Dibuat Oleh:
                      </p>

                      <div className="flex justify-between space-x-2 leading-relaxed mt-1">
                        <div className="flex text-left space-x-1 lg:space-x-4">
                        {formData.profileImage ? (
                          <img
                            src={formData.profileImage}
                            alt="Profil"
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <IoPersonCircle className="h-16 w-16 text-white-500" />
                        )}
                          <span className="text-[0.375rem] lg:text-sm font-semibold">
                            {test.author.name}
                          </span>
                        </div>
                        <span className="text-[0.375rem] lg:text-sm font-semibold">
                            {Number(test.price) === 0 ? 'Gratis' : (
                                <IoIosLock className="h-2 lg:h-4 inline-block text-current object-contain text-white" alt="Berbayar" />
                            )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {/* Tombol panah kiri */}
            <button
              onClick={searchprevSlide}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
                searchcurrentIndex === 0 ? "hidden" : ""
              }`}
            >
              &#10094;
            </button>
            {/* Tombol panah kanan */}
            <button
              onClick={searchnextSlide}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
                searchcurrentIndex >= searchResults.length - searchitemsToShow
                  ? "hidden"
                  : ""
              }`}
            >
              &#10095;
            </button>
          </div>
        </section>
      )}

      {/* Bagian Katagori */}
      <section className="block  mx-auto p-3 text-deepBlue">
        <div className="font-bold mt-5 font-poppins text-deepBlue">
          Kategori
          <div className="relative ">
            {/* Container untuk kategori, hanya 2 kategori yang akan ditampilkan */}
            <div className="flex overflow-hidden w-full">
              {categories
                .slice(
                  catagoriescurrentIndex,
                  catagoriescurrentIndex + catagoriesitemsToShow
                )
                .map((category, index) => (
                  <Link key={index} href={category.href} legacyBehavior>
                    <a className="hover:text-gray-300 mx-2">
                      <img
                        src={category.src}
                        alt={category.alt}
                        className="h-300 lg:h-[320px] object-contain"
                      />
                    </a>
                  </Link>
                ))}
            </div>

            {/* Tombol panah kiri */}
            <button
              onClick={catagoriesprevSlide}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
                catagoriescurrentIndex === 0 ? "hidden" : ""
              }`}
            >
              &#10094; {/* Simbol panah kiri */}
            </button>
            {/* Tombol panah kanan */}
            <button
              onClick={catagoriesnextSlide}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
                catagoriescurrentIndex >=
                categories.length - catagoriesitemsToShow
                  ? "hidden"
                  : ""
              }`}
            >
              &#10095; {/* Simbol panah kanan */}
            </button>
          </div>
        </div>
      </section>

      {/* Bagian Paling Populer */}
      <section className="mx-auto p-5 font-poppins relative">
        <div className="mx-auto mt-5 font-bold font-poppins text-deepBlue">
          Paling Populer
          {/* Container untuk kategori, menambahkan grid layout yang konsisten */}
          <div className=" mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTests
              .slice(
                populercurrentIndex,
                populercurrentIndex + populeritemsToShow
              )
              .map((test) => (
                <div
                  key={test.testId}
                  className="bg-abumuda shadow-lg relative group"
                >
                  <div className="flex justify-between items-center z-10 p-2">
                    <div className="flex items-center space-x-2 font-bold text-deepBlue">
                        <FaEye />
                      <span className="text-[0.6rem] lg:text-sm font-poppins">
                        {test.accessCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center mt-2 lg:mt-4 ">
                    <div className="text-8xl">
                      <SlBookOpen />
                    </div>
                  </div>

                  <div className="flex justify-center mt-2 lg:mt-4 text-deepBlue ">
                    <h3 className="text-center text-[0.8rem] lg:text-lg font-bold mt-0 lg:mt-2 font-poppins">
                      {test.category}
                    </h3>
                  </div>

                  <div className="bg-deepBlue text-white p-1 lg:p-2  mt-4 relative z-20 ">
                    <div className="flex items-center space-x-2 justify-between">
                      <h3 className="text-left text-[0.625rem] lg:text-base font-bold mt-2">
                        {test.title}
                      </h3>
                    </div>

                    <p className="text-left text-[0.5rem] lg:text-sm leading-relaxed">
                      Prediksi kemiripan {test.similarity}%
                    </p>
                    <p className="text-[0.4rem] lg:text-xs leading-relaxed">
                      Dibuat Oleh:
                    </p>

                    <div className="flex justify-between space-x-2 leading-relaxed mt-1">
                      <div className="flex text-left space-x-1 lg:space-x-4">
                        {test.author.authorPhoto ? (
                          <img
                            src={test.author.authorPhoto}
                            alt={test.category}
                            className="h-3 lg:h-6 object-contain"
                          />
                        ) : (
                          <IoPersonCircle className="h-3 lg:h-6 text-white" />
                        )}
                        <span className="text-[0.375rem] lg:text-sm font-semibold">
                          {test.author.name}
                        </span>
                      </div>
                      <span className="text-[0.375rem] lg:text-sm font-semibold">
                        {Number(test.price) === 0 ? 'Gratis' : (
                            <IoIosLock className="h-2 lg:h-4 inline-block text-current object-contain text-white" alt="Berbayar" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* Tombol panah kiri */}
          <button
            onClick={populerprevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
              populercurrentIndex === 0 ? "hidden" : ""
            }`}
          >
            &#10094;
          </button>
          {/* Tombol panah kanan */}
          <button
            onClick={populernextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
              populercurrentIndex >= popularTests.length - populeritemsToShow
                ? "hidden"
                : ""
            }`}
          >
            &#10095;
          </button>
        </div>
      </section>

      {/* Bagian gratis */}
      <section className="block mx-auto p-5 font-poppins relative">
        <div className="mx-auto mt-5 font-bold font-poppins text-deepBlue">
          Gratis
          {/* Container untuk kategori, menambahkan grid layout yang konsisten */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {freeTests
              .slice(gratiscurrentIndex, gratiscurrentIndex + gratisitemsToShow)
              .map((test) => (
                <div
                  key={test.testId}
                  className="bg-abumuda shadow-lg relative group"
                >
                  <div className="flex justify-between items-center z-10">
                    <div className="flex items-center space-x-2 font-bold text-deepBlue p-2">
                      <FaEye />
                      <span className="text-[0.6rem] lg:text-sm font-poppins">{test.accessCount}</span>
                    </div>
                  </div>

                  <div className="flex justify-center mt-2 lg:mt-4 relative z-20 ">
                    <div className="text-8xl">
                      <SlBookOpen />
                    </div>
                  </div>

                  <div className="flex justify-center mt-2 lg:mt-4 text-deepBlue relative z-20 ">
                    <h3 className="text-center text-[0.8rem] lg:text-lg font-bold mt-0 lg:mt-2 font-poppins">
                      {test.category}
                    </h3>
                  </div>

                  <div className="bg-deepBlue text-white p-1 lg:p-2  mt-4 relative z-20 ">
                    <div className="flex items-center space-x-2 justify-between">
                      <h3 className="text-left text-[0.625rem] lg:text-base font-bold mt-2">
                        {test.title}
                      </h3>
                    </div>

                    <p className="text-left text-[0.5rem] lg:text-sm leading-relaxed">
                      Prediksi kemiripan {test.similarity}%
                    </p>
                    <p className="text-[0.4rem] lg:text-xs leading-relaxed">
                      Dibuat Oleh:
                    </p>

                    <div className="flex justify-between space-x-2 leading-relaxed mt-1">
                      <div className="flex text-left space-x-1 lg:space-x-4">
                          {test.author.authorPhoto ? (
                            <img
                              src={test.author.authorPhoto}
                              alt={test.category}
                              className="h-3 lg:h-6 object-contain"
                            />
                          ) : (
                            <IoPersonCircle className="h-3 lg:h-6 text-white" />
                          )}
                      </div>
                      <span className="text-[0.375rem] lg:text-sm font-semibold">
                        {Number(test.price) === 0 ? 'Gratis' : (
                            <IoIosLock className="h-2 lg:h-4 inline-block text-current object-contain text-white" alt="Berbayar" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* Tombol panah kiri */}
          <button
            onClick={gratisprevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
              gratiscurrentIndex === 0 ? "hidden" : ""
            }`}
          >
            &#10094;
          </button>
          {/* Tombol panah kanan */}
          <button
            onClick={gratisnextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-200 ${
              gratiscurrentIndex >= freeTests.length - gratisitemsToShow
                ? "hidden"
                : ""
            }`}
          >
            &#10095;
          </button>
        </div>
      </section>
    </>
  );
}
