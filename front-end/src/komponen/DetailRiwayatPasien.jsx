import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

axios.defaults.baseURL = "http://localhost:8000/api";

const DetailRiwayatPasien = () => {
  const { idDokter, id } = useParams(); // Tangkap parameter idDokter dan id
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !idDokter) {
      setError("ID dokter atau ID pasien tidak valid.");
      return;
    }

    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/patients/${id}/detail`, {
          params: { id_dokter: idDokter },
        });
        setDetail(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Gagal memuat detail pasien.";
        setError(errorMessage);
      }
    };

    fetchDetail();
  }, [id, idDokter]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("patient-detail");

    // Sembunyikan tombol sementara
    const buttons = element.querySelectorAll("button");
    buttons.forEach((btn) => (btn.style.display = "none"));

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("riwayat_pasien.pdf");
    } finally {
      // Tampilkan kembali tombol
      buttons.forEach((btn) => (btn.style.display = ""));
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-400 to-pink-500 text-white text-center p-6">
        {error}
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-screen text-black text-center p-6">
        <p>Memuat data...</p>
      </div>
    );
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
    <div className="ml-72 p-4">
      <div className="max-w-4xl w-full bg-blue-50 rounded-lg shadow-lg p-8" id="patient-detail">
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
          <div>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mr-4"
            >
              Kembali
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable react/prop-types */
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-sm font-bold text-gray-600">{label}:</p>
    <p className="text-lg text-gray-800">{value || "Tidak tersedia"}</p>
  </div>
);
/* eslint-enable react/prop-types */

export default DetailRiwayatPasien;
