import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faEdit} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

axios.defaults.baseURL = "http://localhost:8000/api";

const DataPeriksaPasien = () => {
  const [dataPeriksa, setDataPeriksa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterTanggal, setFilterTanggal] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  // Ambil data dokter dari localStorage dan fetch data periksa
  const loadDokterData = () => {
    try {
      const storedDokter = localStorage.getItem("dokter");
      
      if (storedDokter) {
        const parsedDokter = JSON.parse(storedDokter);
        fetchDataPeriksa(parsedDokter.id, filterTanggal); // Langsung fetch data menggunakan ID dokter
      } else {
        setError("Data dokter tidak ditemukan. Silakan login ulang.");
      }
    } catch (e) {
      console.error("Error loading dokter data:", e.message);
      setError("Gagal memuat data dokter.");
    }
  };

  // Fetch data periksa pasien berdasarkan ID dokter
  const fetchDataPeriksa = async (idDokter, tanggal) => {
    try {
      setLoading(true); // Tampilkan spinner
      const response = await axios.get(`/data-periksa/${idDokter}?tanggal=${tanggal}`);
      if (Array.isArray(response.data)) {
        setDataPeriksa(response.data); // Pastikan respons adalah array
      } else {
        throw new Error("Format data tidak valid.");
      }
    } catch (e) {
      console.error("Error fetching data periksa pasien:", e.message);
      setError(e.response?.data?.message || "Gagal memuat data periksa pasien.");
    } finally {
      setLoading(false); // Nonaktifkan spinner
    }
  };

  const handleTanggalChange = (event) => {
    const selectedTanggal = event.target.value;
    setFilterTanggal(selectedTanggal); // Perbarui tanggal filter
    const storedDokter = localStorage.getItem("dokter");
    if (storedDokter) {
      const parsedDokter = JSON.parse(storedDokter);
      fetchDataPeriksa(parsedDokter.id, selectedTanggal); // Fetch data berdasarkan tanggal baru
    } else {
      setError("Dokter tidak valid. Silakan login ulang.");
    }
  };

  
  // Tangani tombol Periksa
  const handlePeriksa = (id) => {
    const storedDokter = localStorage.getItem("dokter");
    if (storedDokter) {
      const parsedDokter = JSON.parse(storedDokter);
      navigate(`/dokter/${parsedDokter.id}/data-pasien/periksa/${id}`);
    } else {
      setError("Dokter tidak valid. Silakan login ulang.");
    }
  };

  // Tangani tombol Edit
  const handleEdit = (id) => {
    const storedDokter = localStorage.getItem("dokter");
    if (storedDokter) {
      const parsedDokter = JSON.parse(storedDokter);
      navigate(`/dokter/${parsedDokter.id}/data-pasien/edit/${id}`);
    } else {
      setError("Dokter tidak valid. Silakan login ulang.");
    }
  };

  // Fetch data awal saat komponen dimuat
  useEffect(() => {
    loadDokterData();
  }, []);

  const normalizeStatus = (status) => {
    if (status === "Belum DiPeriksa") return "Belum Diperiksa";
    if (status === "Sudah DiPeriksa") return "Sudah Diperiksa";
    return status;
  };

  return (
    <div className="ml-60 p-6 ">
      <div className="bg-white p-6">
        <h1 className="text-2xl font-bold mb-4">Data Periksa Pasien</h1>

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}


        <div className="absolute top-4 right-0 p-4">
          <input
            type="date"
            value={filterTanggal}
            onChange={handleTanggalChange}
            className="border border-gray-300 p-2 rounded"
          />
        </div>  

        {loading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : (

          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2 text-center">No. Antrian</th>
                <th className="border border-gray-300 px-4 py-2">Nama Pasien</th>
                <th className="border border-gray-300 px-4 py-2">Keluhan</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataPeriksa) && dataPeriksa.length > 0 ? (
                dataPeriksa.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.no_antrian || "Tidak Ada"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.nama_pasien || "Tidak Ada"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.keluhan || "Tidak Ada"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {normalizeStatus(item.status) === "Belum Diperiksa" ? (
                        <button
                          onClick={() => handlePeriksa(item.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Periksa
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Tidak ada data pasien.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataPeriksaPasien;
