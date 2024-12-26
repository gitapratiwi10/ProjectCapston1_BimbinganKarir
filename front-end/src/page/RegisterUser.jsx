import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    alamat: "",
    no_ktp: "",
    no_hp: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/register", formData);

      if (response.status === 201) {
        setMessage("Registrasi berhasil!");
        setSuccessData(response.data.pasien);
        setShowPopup(true);
      } else if (response.status === 409) { // Conflict status for duplicate KTP
        setMessage("Nomor KTP sudah terdaftar. Mohon gunakan nomor KTP lain.");
        setShowPopup(true);
      } else {
        setMessage(response.data.message || "Registrasi gagal.");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage(
        error.response?.data?.message || "Terjadi kesalahan saat mengirim formulir."
      );
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (successData) {
      navigate("/loginuser"); // Redirect to login page on success
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        {/* Form Section */}
        <div className="lg:w-1/2 bg-white  p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Registrasi</h2>
          <form onSubmit={handleSubmit} className="space-y-6 h-full">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama Anda"
                required
              />
            </div>
            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <input
                type="text"
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan alamat Anda"
                required
              />
            </div>
            <div>
              <label htmlFor="no_ktp" className="block text-sm font-medium text-gray-700">
                No KTP
              </label>
              <input
                type="text"
                id="no_ktp"
                name="no_ktp"
                value={formData.no_ktp}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nomor KTP Anda"
                required
              />
            </div>
            <div>
              <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700">
                No HP
              </label>
              <input
                type="text"
                id="no_hp"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nomor HP Anda"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan password Anda"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transform transition duration-300 hover:scale-105"
            >
              Daftar
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Sudah Mempunyai Akun?{' '}
            <a
              href="/loginuser"
              className="text-blue-600 font-medium hover:underline"
            >
              Klik di sini untuk Login
            </a>
          </p>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 hidden lg:flex items-center">
          <img
            src="/src/assets/rs8.png"
            alt="Rumah Sakit"
            className="min-h-full"
          />
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            {successData ? (
              <>
                <h3 className="text-lg font-bold text-green-600">Registrasi Berhasil!</h3>
                <p className="mt-2">Anda Berhasil Registrasi dengan nomor RM:</p>
                <p className="mt-1 text-blue-700 font-semibold">{successData.no_rm}</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-red-600">Registrasi Gagal!</h3>
                <p className="mt-2">{message}</p>
              </>
            )}
            <button
              onClick={handlePopupClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
