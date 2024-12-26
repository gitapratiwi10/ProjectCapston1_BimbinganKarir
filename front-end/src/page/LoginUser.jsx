import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

const LoginUser = () => {
  const [formData, setFormData] = useState({
    no_ktp: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { no_ktp, password } = formData;

    if (!/^\d+$/.test(no_ktp)) {
      setMessage("Nomor KTP harus berupa angka.");
      return false;
    }

    if (password.length < 8) {
      setMessage("Password harus memiliki minimal 8 karakter.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8000/api/loginuser", formData);

      if (response.status === 200) {
        setUserData(response.data.pasien);
        localStorage.setItem("pasien", JSON.stringify(response.data.pasien));
        setMessage(`Login berhasil! Selamat datang, ${response.data.pasien.nama}`);
        navigate(`/pasien/${response.data.pasien.id}/profil`);
      } else {
        setMessage(response.data.message || "Login gagal.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(
        error.response?.data?.message || "Terjadi kesalahan saat mencoba login."
      );
    }
  };

  return (
    <div className="flex h-screen">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        {/* Form Section */}
        <div className="lg:w-1/2 bg-white p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Login</h2>
          <div className="mt-4 text-center">
          <p className="text-gray-600 mb-4">Pilih login sebagai:</p>
          <div className="flex justify-center space-x-4">
            <button
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-600 transform transition duration-300 hover:scale-105"
            >
              <UserIcon className="h-5 w-5" />
              <span>User</span>
            </button>
            <button
              className="flex items-center space-x-2 px-6 py-2 bg-blue-200 text-black rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-200 transform transition duration-300 hover:scale-105"
            >
              <ShieldCheckIcon className="h-5 w-5" />
              <span> <a href="/login">Admin</a></span>
            </button>
          </div>
        </div>
          {message && (
            <p
              className={`text-center mt-4 ${
                message.includes("berhasil") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          {userData && (
            <div className="text-center mt-4 bg-green-100 border border-green-500 p-4 rounded">
              <p>
                <strong>Nama:</strong> {userData.nama}
              </p>
              <p>
                <strong>Nomor Rekam Medis:</strong> {userData.no_rm}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              Masuk
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Belum registrasi?{' '}
            <a
              href="/registeruser"
              className="text-blue-600 font-medium hover:underline"
            >
              Klik di sini untuk daftar
            </a>
          </p>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 hidden lg:flex items-center">
          <img
            src="/src/assets/rs8.png"
            alt="Rumah Sakit"
            className="h-screen w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
