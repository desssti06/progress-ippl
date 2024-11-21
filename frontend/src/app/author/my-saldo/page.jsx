'use client'
import Head from "next/head";
import { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";

export default function DashboardAuthor() {
  const [asideHeight, setAsideHeight] = useState('1000px'); 
  const [showHistory, setShowHistory] = useState(false);
  const [showNotification, setShowNotification] = useState(false); 
  const [showProcessNotification, setShowProcessNotification] = useState(false); 
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const recipientName = "Abellia Putri Dwi Masita"; 
  const recipientAccount = "1328811353"; 
  const serviceFee = 1000; 

  const banks = ['BNI', 'BRI', 'BCA', 'MANDIRI', 'BANK LAINNYA'];

  const handleAddNewTest = () => {
    alert("Fungsi untuk menambahkan tes baru belum diimplementasikan."); 
  };

  const increaseAsideHeight = () => {
    setAsideHeight('1200px'); // Contoh perubahan tinggi menjadi 1200px
  };

  const handleBankSelect = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleWithdrawClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleSubmit = () => {
    setShowNotification(true);
    setIsClicked(true);
  };

  const textStyle = {
    color: isClicked ? 'black' : '#d5cccc'
  };

  // Close initial notification
  const handleOutsideClick = () => {
    setShowNotification(false);
    setShowProcessNotification(false); 
    setIsOpen(false);

    setSelectedBank('');
    setAccountNumber('');
    setWithdrawAmount('');

    setTimeout(() => {
      setShowProcessNotification(false);
      setIsClicked(false); 
    },);
  };

  const handleProcessClick = () => {
    setShowNotification(false); 
    setShowProcessNotification(true); 
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const totalAmount = Number(withdrawAmount) + serviceFee;

  return (
    <>
        <Head>
            <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
            rel="stylesheet"
            />
        </Head>
        <div className="flex h-screen font-poppins">
            <aside className="bg-[#78AED6] w-64 p-10 flex flex-col items-start" style={{ height: asideHeight }}>
            <div className="text-white mb-5">
                <img src="/images/etamtest.png" alt="Logo" className="h-auto w-36" />
            </div>
            <div className="flex justify-center w-full mb-5">
                <button
                className="bg-[#0B61AA] text-white py-2 px-5 rounded-[10px]"
                onClick={handleAddNewTest} // Tambahkan fungsi ketika tombol diklik
                >
                + NEW
                </button>
            </div>
            <button
                className="bg-green-500 text-white py-2 px-4 rounded mt-4"
                onClick={increaseAsideHeight} // Fungsi untuk meningkatkan tinggi <aside>
            >
            </button>
            <nav>
                <ul className="space-y-3">
                <li className="text-white cursor-pointer bg-[#0B61AA] bg-opacity-50 rounded-lg py-2 px-4 min-w-[200px]">
                    Home
                </li>
                <li className="text-white cursor-pointer py-2 px-4">Analisis Soal</li>
                <li className="text-white cursor-pointer py-2 px-4">MySaldo</li>
                <li className="text-white cursor-pointer py-2 px-4">FAQ</li>
                </ul>
            </nav>
        </aside>
        <main className="relative main-content flex-grow bg-white">
            <header className="header bg-[#0b61aa] top-0 text-white p-4 flex justify-end items-center">
                <span className="text-[26px] font-bold pr-6 mr-2"> Hai, Abeliaaa!</span>
                <div className='w-[35px] h-[35px] flex justify-center items-center'>
                    <IoPersonCircle className="text-current text-[190px]" alt="profile" />
                </div>
            </header>

            <div className='mt-4 mb-4 px-8'>
                <div className='flex items-center mb-4'>
                <IoWalletOutline className="w-10 h-10 mr-3 text-current text-white" alt="Icon"/>
                <span className='text-black text-[48px] font-normal'>Saldo Saya</span>
                </div>
                <section className="saldo-section bg-[#f1f1f1] rounded-lg p-5 shadow-md w-full">
                <div className="saldo-container flex items-center justify-between mb-5 px-8">
                    <div className="saldo-amount text-[48px] md:text-[45px] sm:text-[24px] font-normal whitespace-nowrap text-[#0B61AA]">
                    {/* Memformat Saldo dengan titik pemisah ribuan */}
                    Rp {Number(1000000).toLocaleString('id-ID')}.00,-
                    </div>
                    <button
                    onClick={handleWithdrawClick}
                    className="withdraw-button bg-[#0B61AA] text-white py-2 px-12 rounded-[15px] font-bold text-[16px] shadow-md ml-5 hover:bg-[#2C9BD1] sm:mt-4 sm:text-[14px]">
                    Tarik Dana
                    </button>
                </div>
                </section>
                {isOpen && (
                    <section className="bg-[#f1f1f1] rounded-lg p-5 mt-5 shadow-lg w-full">
                        <h3 className="border-b-2 border-gray-300 mb-5 pb-5 text-3xl">Detail Penarikan</h3>
                        <div className="flex flex-col gap-4 border-b-2 border-gray-300 mb-5 pb-5">
                            {/* Nama Bank */}
                            <div className="flex items-center justify-between">
                                <label className="w-1/3 mr-2 text-xl">Nama Bank</label>
                                <div className='flex items-center'>
                                <select
                                    value={selectedBank}
                                    onChange={handleBankSelect}
                                    className=" w-[100%] max-w-[250px] p-2 rounded-[10px] text-base pl-4 border border-black"
                                >
                                    <option value="" className='text-sm p-1'>Pilih Nama Bank</option>
                                    {banks.map((bank, index) => (
                                    <option key={index} value={bank} className='text-sm p-5 w-[50px]'>
                                        {bank}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            </div>

                            {/* Nomor Rekening */}
                            <div className="flex items-center">
                                <label className="w-1/3 mr-2 text-xl">Nomor Rekening</label>
                                <input
                                type="text"
                                placeholder="Masukkan nomor rekening"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className={`w-[413px] p-2 rounded-[15px] ml-auto text-xl border border-black italic placeholder ${
                                    accountNumber ? 'text-left' : 'text-center'
                                }`}
                                />
                            </div>

                            {/* Nominal Penarikan */}
                            <div className="flex items-start">
                                <label className="w-1/3 mr-2 text-xl">Nominal Penarikan</label>
                                    <div className='flex flex-col ml-auto'>
                                    <input
                                        type="text"
                                        placeholder="Masukkan nominal penarikan"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className={`border border-black w-[413px] p-2 rounded-[15px] ml-auto text-xl italic placeholder ${
                                        withdrawAmount ? 'text-left' : 'text-center'
                                        }`}
                                    />
                                    <span className='mt-1 ml-2 text-sm font font-light text-base'>Example : 1500 </span>
                                    </div>
                            </div>
                            <h4 className="border-b-2 border-gray-300 pb-2 mb-4 text-3xl">Rincian Penarikan</h4>
                            <div className ="border-b-2 border-gray-300 pb-5 mb-5">
                                <div className="flex justify-between mt-2">
                                <p className='text-xl'>Nominal Penarikan:</p>
                                <p className="font-bold text-[#d5cccc] text-xl" style={textStyle}>
                                    Rp. {withdrawAmount ? Number(withdrawAmount).toLocaleString('id-ID') : '0,00'}
                                </p>
                                </div>

                                <div className="flex justify-between mt-2 text-xl">
                                <p>Biaya Layanan:</p>
                                <p className="font-bold text-[#d5cccc]" style={textStyle}>Rp. {serviceFee.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 border-b-2 border-gray-300 pb-2 text-xl">
                                <p className="font-semibold">Total Penarikan:</p >
                                <p className="font-bold text-xl text-[#d5cccc]" style={textStyle}>
                                Rp. {totalAmount.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-[#0B61AA] w-[131px] h-[50px] text-xl text-white px-4 py-2 rounded-[10px]" onClick={handleSubmit}>
                                Tarik
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                    {/* Form Penarikan */}
                    <section className="transaction-section bg-[#f1f1f1] rounded-lg p-5 mt-5 shadow-md w-full">
                    <div
                        className="transaction-history text-lg text-black flex items-center cursor-pointer"
                        onClick={toggleHistory}
                    >
                        <span
                        className={`mr-4 text-4xl text-black transform transition-transform duration-300 ${showHistory ? 'rotate-90' : 'rotate-0'}`}
                        >
                        ›
                        </span>
                        <span className='text-3xl'>Riwayat Transaksi</span>
                    </div>
                    </section>

                    {/* Riwayat Transaksi */}
                    {showHistory && (
                        <div className="history-content relative mt-2 transition-all duration-300">
                        <div className="relative mt-5">
                            <table className="min-w-[500] lg:min-w-[969px] mx-8 border-collapse border border-gray-200 text-left rounded-lg bg-white shadow-lg">
                            <thead className='text-[20px]'>
                                <tr className="bg-[#0b61aa] text-white text-center">
                                <th className="p-4 rounded-tl-lg">Tanggal</th>
                                <th className="p-4">Metode Penarikan</th>
                                <th className="p-4">Invoice ID</th>
                                <th className="p-4 rounded-tr-lg">Total</th>
                                </tr>
                            </thead>
                            <tbody className='text-[20px]'>
                                <tr className="border-b">
                                <td className="p-4">20 November 2024</td>
                                <td className="p-4">BNI</td>
                                <td className="p-4">T0004</td>
                                <td className="p-4">IDR 250.000</td>
                                </tr>
                                <tr className="border-b">
                                <td className="p-4">12 Oktober 2024</td>
                                <td className="p-4">BNI</td>
                                <td className="p-4">T0003</td>
                                <td className="p-4">IDR 500.000</td>
                                </tr>
                                <tr className="border-b">
                                <td className="p-4">01 Oktober 2024</td>
                                <td className="p-4">Dana</td>
                                <td className="p-4">T0002</td>
                                <td className="p-4">IDR 100.000</td>
                                </tr>
                                <tr>
                                <td className="p-4">12 September 2024</td>
                                <td className="p-4">Dana</td>
                                <td className="p-4">T0001</td>
                                <td className="p-4">IDR 150.000</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        </div>
                    )}
                </div> 
                {/* Notifikasi validasi */}
                {showNotification && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={handleOutsideClick}>
                        <div
                        className="bg-[#78AED6] rounded-lg p-4 text-center w-[496px] relative pb-2"
                        onClick={(e) => e.stopPropagation()}
                        >
                        <h3 className="font-bold mb-2 text-3xl">Validasi</h3>
                        <hr className="border-t-1 border-black mb-4" />
                        <div className="text-left mb-2 text-xl">
                            <p className="flex justify-between mb-4">
                                <span>Rekening Tujuan:</span>
                                <strong className='font-normal'>{recipientAccount}</strong>
                            </p>
                            <p className="flex justify-between mb-4">
                                <span>Nama Penerima:</ span>
                                <strong className='font-normal'>{recipientName}</strong>
                            </p>
                            <hr className="border-t-1 border-black mb-4" />
                            <p className="flex justify-between mb-4">
                                <span>Nominal:</span>
                                <strong className='font-normal'>Rp {withdrawAmount ? Number(withdrawAmount).toLocaleString('id-ID') : '0,00'}</strong>
                            </p>
                            <p className="flex justify-between mb-4">
                                <span>Biaya Layanan:</span>
                                <strong className='font-normal'>Rp {serviceFee.toLocaleString('id-ID')}</strong>
                            </p>
                            <p className="flex justify-between mb-4">
                                <span>Total:</span>
                                <strong className='font-normal'>Rp {totalAmount.toLocaleString('id-ID')}</strong>
                            </p>
                        </div>
                        <div className="flex items-center mb-28">
                            <label className="block text-sm mr-2 text-xl">Kata Sandi</label>
                            <input
                                type="password"
                                placeholder="Masukkan kata sandi"
                                className="bg-transparent border-b border-black focus:outline-none focus:border-b-2 focus:border-black flex-grow text-black-500 placeholder-black placeholder-opacity-50 ml-36"
                            />
                        </div>
                        <button className="bg-[#0B61AA] text-[22px] text-black px-4 py-2 rounded-[15px] mt-3 w-[292px] h-[37px] mb-8 text-center font-medium-bold" style={{lineHeight:'1'}} onClick={handleProcessClick}>
                            Selanjutnya
                        </button>
                        </div>
                    </div>
                )}
                {/* Notifikasi Sedang Diproses */}
                {showProcessNotification && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={handleOutsideClick}>
                        <div className="bg-[#78aed6] rounded-lg p-4 text-center w-[280px] relative pb-2" onClick={(e) => e.stopPropagation()}>
                            <IoIosCheckmarkCircle className="w-20 h-20 mb-4 mt-4 mx-auto text-current text-black" alt="Success Icon" />
                            <h3 className="text-xl font-bold mb-4">Permintaan Anda <br /> Sedang Diproses</h3>
                            <p className="text-justify text-sm mb-10 px-4">
                                • Proses penarikan saldo biasanya memakan waktu 1-3 hari kerja.<br />
                                • Anda akan menerima notifikasi melalui email ketika saldo berhasil ditransfer ke rekening bank Anda.
                            </p>
                        </div>
                    </div>
                )}
        </main>
      </div>
    </>
  );
}

