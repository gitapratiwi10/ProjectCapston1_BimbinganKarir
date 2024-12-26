import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilPasien = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedPasien = localStorage.getItem("pasien");
        if (!storedPasien) {
          toast.error("Tidak ada data pasien. Silakan login.");
          navigate("/login");
          return;
        }

        const { id } = JSON.parse(storedPasien);
        const response = await axios.get(`http://localhost:8000/api/pasien/${id}`);

        if (response.status === 200) {
          setProfileData(response.data);
        } else {
          toast.warn("Gagal memuat profil pasien.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Terjadi kesalahan saat memuat data.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const storedPasien = localStorage.getItem("pasien");
      if (!storedPasien) {
        toast.error("Tidak ada data pasien untuk disimpan.");
        return;
      }

      const { id } = JSON.parse(storedPasien);
      const response = await axios.put(`http://localhost:8000/api/pasien/${id}`, profileData);

      if (response.status === 200) {
        toast.success("Profil berhasil diperbarui!");
        setIsEditing(false);
      } else {
        toast.warn("Gagal menyimpan perubahan.");
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const storedPasien = localStorage.getItem("pasien");
    if (storedPasien) {
      const { id } = JSON.parse(storedPasien);
      axios.get(`http://localhost:8000/api/pasien/${id}`).then((response) => {
        if (response.status === 200) {
          setProfileData(response.data);
        }
      });
    }
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="ml-60 bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center bg-blue-500 text-white py-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold">
            {profileData.nama?.[0]?.toUpperCase()}
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">Profil Pasien</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nama</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nama"
                  value={profileData.nama}
                  onChange={handleInputChange}
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-2 text-gray-800">{profileData.nama}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">No KTP</label>
              {isEditing ? (
                <input
                  type="text"
                  name="no_ktp"
                  value={profileData.no_ktp}
                  onChange={handleInputChange}
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-2 text-gray-800">{profileData.no_ktp}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">No HP</label>
              {isEditing ? (
                <input
                  type="text"
                  name="no_hp"
                  value={profileData.no_hp}
                  onChange={handleInputChange}
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-2 text-gray-800">{profileData.no_hp}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">No RM</label>
              <p className="mt-2 text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {profileData.no_rm}
              </p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Simpan
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Profil
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProfilPasien;
