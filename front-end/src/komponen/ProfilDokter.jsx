import { useState, useEffect } from "react";
import axios from "axios";
import { PencilSquareIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";



const ProfilDokter = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedDoctor = localStorage.getItem("dokter");
        if (!storedDoctor) {
          console.warn("No doctor data found in localStorage.");
          return;
        }

        const { id } = JSON.parse(storedDoctor);
        const response = await axios.get(`http://localhost:8000/api/dokters/${id}`);

        if (response.status === 200) {
          setProfileData(response.data);
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
      const storedDoctor = localStorage.getItem("dokter");
      if (!storedDoctor) {
        console.warn("No doctor data found in localStorage.");
        return;
      }

      const { id } = JSON.parse(storedDoctor);
      await axios.put(`http://localhost:8000/api/dokters/${id}`, profileData);

      setIsEditing(false);
      alert("Profil berhasil diperbarui.");
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Gagal menyimpan perubahan.");
    }
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red">Data dokter tidak tersedia. Pastikan Anda login sebagai dokter.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-60 bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold">
              {profileData.nama?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profileData.nama}</h1>
              <p className="text-sm text-gray-200">Dokter di Poli {profileData.poli?.nama_poli || "Poli Tidak Diketahui"}</p>
            </div>
          </div>
          {/* Main Profile Details */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nama</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nama"
                  value={profileData.nama}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg font-semibold text-gray-800">{profileData.nama}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Alamat</label>
              {isEditing ? (
                <input
                  type="text"
                  name="alamat"
                  value={profileData.alamat}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg font-semibold text-gray-800">{profileData.alamat}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">No. HP</label>
              {isEditing ? (
                <input
                  type="text"
                  name="no_hp"
                  value={profileData.no_hp}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-lg font-semibold text-gray-800">{profileData.no_hp}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Poli</label>
              <p className="mt-1 text-lg font-semibold text-gray-800">
                {profileData.poli?.nama_poli || "Tidak ada data poli terkait"}
              </p>
            </div>
          </div>
          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 flex items-center space-x-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  <XMarkIcon className="w-5 h-5" />
                  <span>Batal</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 flex items-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Simpan</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 flex items-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PencilSquareIcon className="w-5 h-5" />
                <span>Edit Profil</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilDokter;
