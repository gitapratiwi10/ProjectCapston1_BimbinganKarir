import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8000/api";

const DaftarPoliPasien = () => {
  const [pasien, setPasien] = useState(null);
  const [poliList, setPoliList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [riwayatPoli, setRiwayatPoli] = useState([]);
  const [selectedPoli, setSelectedPoli] = useState("");
  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [loading, setLoading] = useState(false);
  //const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  // Load data pasien dari localStorage
  const loadPasienData = () => {
    try {
      const storedPasien = localStorage.getItem("pasien");
      if (storedPasien) {
        const parsedPasien = JSON.parse(storedPasien);
        setPasien(parsedPasien);
        fetchRiwayatPoli(parsedPasien.id);
      } else {
        setPopupMessage("Data pasien tidak ditemukan. Silakan login ulang.");
        setShowErrorPopup(true);
      }
    } catch (e) {
      console.error("Error loading pasien data:", e.message);
      setPopupMessage("Gagal memuat data pasien.");
      setShowErrorPopup(true);
    }
  };

  // Ambil daftar poli
  const fetchPoliList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/polis");
      setPoliList(response.data);
    } catch (e) {
      console.error("Error fetching poli list:", e.message);
      setPopupMessage("Gagal memuat daftar poli.");
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Ambil riwayat poli
  const fetchRiwayatPoli = async (idPasien) => {
    try {
      setLoading(true);
      const response = await axios.get(`/riwayat-poli/${idPasien}`);
      setRiwayatPoli(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.error("Error fetching riwayat poli:", e.message);
      setError("Gagal memuat riwayat poli.");
    } finally {
      setLoading(false);
    }
  };

  // Ambil jadwal berdasarkan poli
  const fetchJadwalList = async (idPoli) => {
    try {
      setLoading(true);
      const response = await axios.get(`/jadwalperiksa/poli/${idPoli}`);
      setJadwalList(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.error("Error fetching jadwal list:", e.message);
      setPopupMessage("Gagal memuat jadwal periksa.");
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Submit form pendaftaran poli
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPoli || !selectedJadwal || !keluhan) {
      setPopupMessage("Harap isi semua kolom yang diperlukan.");
      setShowErrorPopup(true);
      return;
    }

    try {
      const payload = {
        id_pasien: pasien?.id,
        id_jadwal: selectedJadwal,
        keluhan,
      };
      await axios.post("/daftar-poli", payload);
      setShowSuccessPopup("Pendaftaran poli berhasil!");
      setShowSuccessPopup(true);
      fetchRiwayatPoli(pasien.id);
      resetForm();
      setShowPopup(false);
    } catch (e) {
      console.error("Error submitting pendaftaran poli:", e.message);
      setShowErrorPopup("Gagal mendaftarkan poli. Silakan coba lagi.");
      setShowErrorPopup(true);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedPoli("");
    setSelectedJadwal("");
    setKeluhan("");
  };

  // Detail riwayat
  const handleDetail = (id) => {
    const detail = riwayatPoli.find((item) => item.id === id);
    if (detail && detail.Status === "Sudah Diperiksa") {
      navigate(`/detail-riwayat-pasien/${id}`);
    } else {
      alert("Pasien belum diperiksa.");
    }
  };

  useEffect(() => {
    loadPasienData();
    fetchPoliList();
  }, []);

  useEffect(() => {
    if (selectedPoli) fetchJadwalList(selectedPoli);
  }, [selectedPoli]);

  return (
    <>
    <div className="ml-60 space-y-6">
      <div className="p-6 rounded h-full">
        <h2 className="text-xl font-bold mb-4">Riwayat Daftar Poli</h2>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
        >
          Daftar Poli
        </button>

        {loading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : (
          <div className="bg-blue-100">
          <table className="table-auto w-full mt-4">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border border-gray-300 px-4 py-2">No</th>
                <th className="border border-gray-300 px-4 py-2">Poli</th>
                <th className="border border-gray-300 px-4 py-2">Dokter</th>
                <th className="border border-gray-300 px-4 py-2">Hari</th>
                <th className="border border-gray-300 px-4 py-2">Mulai</th>
                <th className="border border-gray-300 px-4 py-2">Selesai</th>
                <th className="border border-gray-300 px-4 py-2">Antrian</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {riwayatPoli.length > 0 ? (
                riwayatPoli.map((item, index) => (
                  <tr key={item.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.Poli}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.Dokter}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.Hari}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.Mulai}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.Selesai}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.Antrian}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.Status}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDetail(item.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Detail Riwayat
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    Tidak ada data riwayat poli.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded shadow-lg w-1/3 h-full">
            <h2 className="text-xl font-bold mb-4">Daftar Poli</h2>
            {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold">No RM</label>
              <p className="mt-2 text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {pasien.no_rm}
              </p>
            </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Pilih Poli</label>
                <select
                  value={selectedPoli}
                  onChange={(e) => setSelectedPoli(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Pilih Poli --</option>
                  {poliList.map((poli) => (
                    <option key={poli.id} value={poli.id}>
                      {poli.nama_poli}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Pilih Jadwal</label>
                <select
                  value={selectedJadwal}
                  onChange={(e) => setSelectedJadwal(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Pilih Jadwal --</option>
                  {jadwalList.map((jadwal) => (
                    <option key={jadwal.id} value={jadwal.id}>
                      {jadwal.hari} ({jadwal.jam_mulai} - {jadwal.jam_selesai})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Keluhan</label>
                <textarea
                  value={keluhan}
                  onChange={(e) => setKeluhan(e.target.value)}
                  rows="4"
                  className="w-full p-2 border rounded"
                  placeholder="Tuliskan keluhan Anda"
                ></textarea>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Daftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showSuccessPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-green-500 text-white p-6 rounded shadow-lg w-1/3 text-center">
            <p className="mb-4">Pendaftaran poli berhasil!{popupMessage}</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-white text-green-500 px-4 py-2 rounded hover:bg-gray-100"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-red-500 text-white p-6 rounded shadow-lg w-1/3 text-center">
            <p className="mb-4">Gagal mendaftarkan poli. Silakan coba lagi.{popupMessage}</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
            >
              OK
            </button>
          </div>
        </div>
      )}


    </div>
    </>
  );
};

export default DaftarPoliPasien;
