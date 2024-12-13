import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

const AdminDashboard = () => {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [poliCount, setPoliCount] = useState(0); // Tambahan untuk poliklinik

  useEffect(() => {
    // Fungsi untuk mengambil data dari backend
    const fetchData = async () => {
      try {
        // Ambil jumlah dokter
        const doctorsResponse = await fetch("http://localhost:8000/api/dokter/jumlah");
        const doctorsData = await doctorsResponse.json();

        // Ambil jumlah pasien
        const patientsResponse = await fetch("http://localhost:8000/api/pasiens/jumlah");
        const patientsData = await patientsResponse.json();

        // Ambil jumlah poliklinik
        const poliesResponse = await fetch("http://localhost:8000/api/poli/jumlah");
        const poliesData = await poliesResponse.json();

        // Set data ke state
        setDoctorCount(doctorsData.count);
        setPatientCount(patientsData.count);
        setPoliCount(poliesData.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div className="flex ml-64 ">
      <div className="flex-1 h-screen p-10 bg-blue-50 ">
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
        <div className="flex justify-around mt-4 pt-16 gap-10">

          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-1/3 text-center">
            <h2 className="text-lg font-semibold">Jumlah Dokter</h2>
            <p className="text-3xl font-bold">{doctorCount}</p>
          </div>

          {/* Card Jumlah Pasien */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-1/3 text-center">
            <h2 className="text-lg font-semibold">Jumlah Pasien</h2>
            <p className="text-3xl font-bold">{patientCount}</p>
          </div>

          {/* Card Jumlah Poliklinik */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-1/3 text-center">
            <h2 className="text-lg font-semibold">Jumlah Poliklinik</h2>
            <p className="text-3xl font-bold">{poliCount}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
