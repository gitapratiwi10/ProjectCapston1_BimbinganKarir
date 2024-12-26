import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

const RiwayatPasien = () => {
  const [patients, setPatients] = useState([]);
  const [dokter, setDokter] = useState(null);
  const [error, setError] = useState("");

  const loadDokterData = () => {
    const storedDokter = localStorage.getItem("dokter");
    if (storedDokter) {
      try {
        const parsedDokter = JSON.parse(storedDokter);
        if (!parsedDokter.id) throw new Error("ID dokter tidak ditemukan.");
        setDokter(parsedDokter);
        console.log("Dokter berhasil dimuat:", parsedDokter);
      } catch (error) {
        setError("Data dokter tidak valid. Silakan login ulang.");
      }
    } else {
      setError("Data dokter tidak ditemukan. Silakan login ulang.");
    }
  };

  const fetchPatients = async () => {
    if (!dokter) return;

    try {
      console.log("Mengambil data pasien dengan dokter ID:", dokter.id);
      const response = await axios.get(`/patients/history/${dokter.id}`);
      setPatients(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching patient data:", err.response || err.message);
      const errorMessage = err.response?.data?.error || "Gagal memuat riwayat pasien.";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    loadDokterData();
  }, []);

  useEffect(() => {
    if (dokter) fetchPatients();
  }, [dokter]);

  const handleViewDetails = (patientId) => {
    window.location.href = `/dokter/${dokter.id}/Detail-riwayat-pasien/${patientId}`;
  };

  return (
    <div className="ml-64 p-4">
      <h1 className="text-2xl font-bold mb-8 mt-8">Riwayat Pasien</h1>

      {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}


      {/* Wrapper untuk membuat tabel responsif */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center text-sm">
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Nama Pasien</th>
              <th className="py-2 px-4 border hidden md:table-cell">Alamat</th>
              <th className="py-2 px-4 border hidden md:table-cell">No. KTP</th>
              <th className="py-2 px-4 border">No. HP</th>
              <th className="py-2 px-4 border hidden md:table-cell">No. RM</th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-100 text-sm text-center">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{record.pasien.nama}</td>
                  <td className="py-2 px-4 border hidden md:table-cell">{record.pasien.alamat || "N/A"}</td>
                  <td className="py-2 px-4 border hidden md:table-cell">{record.pasien.no_ktp || "N/A"}</td>
                  <td className="py-2 px-4 border">{record.pasien.no_hp || "N/A"}</td>
                  <td className="py-2 px-4 border hidden md:table-cell">{record.pasien.no_rm || "N/A"}</td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleViewDetails(record.pasien.id)}
                    >
                      Detail Riwayat
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Tidak ada data pasien
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatPasien;
