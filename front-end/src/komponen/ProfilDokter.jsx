import { useState, useEffect } from "react";
import axios from "axios";

const ProfilDokter = () => {
  const [profileData, setProfileData] = useState(null); // Data profil dokter
  const [isEditing, setIsEditing] = useState(false); // Mode edit

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Ambil data dokter dari localStorage
        const storedDoctor = localStorage.getItem("dokter");
        if (!storedDoctor) {
          console.warn("No doctor data found in localStorage.");
          return;
        }

        const { id } = JSON.parse(storedDoctor); // Ambil ID dokter
        const response = await axios.get(`http://localhost:8000/api/dokters/${id}`);

        if (response.status === 200) {
          setProfileData(response.data); // Set data profil
        } else {
          console.warn("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Ambil data dokter dari localStorage
      const storedDoctor = localStorage.getItem("dokter");
      if (!storedDoctor) {
        console.warn("No doctor data found in localStorage.");
        return;
      }

      const { id } = JSON.parse(storedDoctor); // Ambil ID dokter
      await axios.put(`http://localhost:8000/api/dokters/${id}`, profileData);

      setIsEditing(false); // Keluar dari mode edit
      alert("Profil berhasil diperbarui.");
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Gagal menyimpan perubahan.");
    }
  };

  if (!profileData) {
    return (
      <div className="text-center mt-6">
        <p className="text-red-500">Data dokter tidak tersedia. Pastikan Anda login sebagai dokter.</p>
      </div>
    );
  }

  return (
    <div className="ml-64 p-6 bg-blue-100 h-screen">
      <h1 className="text-3xl font-bold mb-6">Profil Dokter</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg  mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">Nama</label>
          {isEditing ? (
            <input
              type="text"
              name="nama"
              value={profileData.nama}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="mt-1 text-black">{profileData.nama}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Alamat</label>
          {isEditing ? (
            <input
              type="text"
              name="alamat"
              value={profileData.alamat}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="mt-1 text-gray-800">{profileData.alamat}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">No. HP</label>
          {isEditing ? (
            <input
              type="text"
              name="no_hp"
              value={profileData.no_hp}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="mt-1 text-gray-800">{profileData.no_hp}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Poli</label>
          <p className="mt-1 text-gray-800">
            {profileData.poli ? profileData.poli.nama_poli : "Tidak ada data poli terkait"}
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilDokter;
