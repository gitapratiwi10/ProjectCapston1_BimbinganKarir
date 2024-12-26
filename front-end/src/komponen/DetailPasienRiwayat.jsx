import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8000/api";

const DetailPasienRiwayat = () => {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const { id_daftar_poli } = useParams();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const pasien = JSON.parse(localStorage.getItem("pasien"));
        if (!pasien || !pasien.id) {
          setError("Anda belum login. Silakan login terlebih dahulu.");
          return;
        }

        if (!id_daftar_poli) {
          setError("ID daftar poli tidak ditemukan di URL.");
          return;
        }

        const response = await axios.get(`/detail-riwayat-pasien/${id_daftar_poli}`, {
          params: { id_pasien: pasien.id },
        });

        setDetail(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Terjadi kesalahan saat mengambil data."
        );
      }
    };

    fetchDetail();
  }, [id_daftar_poli]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!detail) {
    return <div className="text-center p-4">Memuat data...</div>;
  }

  const {
    nama,
    keluhan,
    tgl_periksa,
    catatan,
    obat,
    biaya_total,
    poli,
    dokter,
    hari,
    jam_mulai,
    jam_selesai,
    no_antrian,
  } = detail;

  return (
    <div className="p-4 ml-96">
      <div className="max-w-3xl w-full bg-blue-50 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Detail Riwayat Pasien</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailField label="Nama Pasien" value={nama} />
          <DetailField label="Keluhan" value={keluhan} />
          <DetailField label="Nama Poli" value={poli || "N/A"} />
          <DetailField label="Nama Dokter" value={dokter || "N/A"} />
          <DetailField label="Hari" value={hari || "N/A"} />
          <DetailField label="Jam Mulai" value={jam_mulai || "N/A"} />
          <DetailField label="Jam Selesai" value={jam_selesai || "N/A"} />
          <DetailField label="No. Antrian" value={no_antrian || "N/A"} />
          <DetailField
            label="Tanggal Periksa"
            value={tgl_periksa ? new Date(tgl_periksa).toLocaleString() : "Tanggal tidak tersedia"}
          />
          <DetailField label="Catatan" value={catatan || "Tidak ada catatan"} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Obat yang Diberikan:</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {obat && obat.length > 0 ? (
              obat.map((item, index) => (
                <li key={index}>
                  <span className="font-semibold">{item.nama_obat}</span> - Rp{" "}
                  {item.harga.toLocaleString()}
                </li>
              ))
            ) : (
              <li>Tidak ada obat</li>
            )}
          </ul>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-lg font-bold text-gray-800">
            Biaya Total: Rp {biaya_total?.toLocaleString() || "N/A"}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable react/prop-types */
const DetailField = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-sm font-bold text-gray-600">{label}:</p>
    <p className="text-lg text-gray-800">{value || "Tidak tersedia"}</p>
  </div>
);
/* eslint-enable react/prop-types */

export default DetailPasienRiwayat;
