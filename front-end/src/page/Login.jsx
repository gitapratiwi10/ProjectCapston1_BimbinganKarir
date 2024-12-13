import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    role: "admin", // Default role
    username_or_name: "", // Untuk admin: username, untuk dokter: nama
    password_or_no_hp: "", // Untuk admin: password, untuk dokter: no_hp
  });
  const [message, setMessage] = useState(""); // Feedback untuk pengguna
  const navigate = useNavigate();

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset pesan

    try {
      // Simulasi login dengan logika role
      const response = await axios.post("http://localhost:8000/api/login", formData, {
        headers: { Accept: "application/json" },
      });

      if (response.status === 200 && response.data.user) {
        const user = response.data.user;
        const role = formData.role;

        // Simpan data pengguna di localStorage
        localStorage.setItem("user", JSON.stringify(user));
        setMessage(`Login berhasil! Selamat datang, ${user.nama || user.username}`);

        // Redirect sesuai role
        if (formData.role === "admin") {
          navigate(`/admindashboard`); 
        } else if (formData.role === "dokter") {
          localStorage.setItem("dokter", JSON.stringify(response.data.user)); // Simpan data dokter
          console.log("Data dokter disimpan:", response.data.user);
          navigate(`/dashboard-dokter/${response.data.user.id}`); // Pindah ke halaman dashboard dokter
         // Halaman dashboard dokter dengan ID dokter
        }
      } else {
        setMessage("Login gagal atau data tidak ditemukan.");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Login gagal.");
      } else {
        setMessage("Tidak dapat terhubung ke server.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        {/* Form Section */}
        <div className="lg:w-1/2 bg-white p-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Login</h2>
          {message && (
            <p
              className={`text-center mt-4 ${
                message.includes("berhasil") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="dokter">Dokter</option>
              </select>
            </div>
            <div>
              <label htmlFor="username_or_name" className="block text-sm font-medium text-gray-700">
                {formData.role === "admin" ? "Username" : "Nama"}
              </label>
              <input
                type="text"
                id="username_or_name"
                name="username_or_name"
                value={formData.username_or_name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Masukkan ${formData.role === "admin" ? "username" : "nama"} Anda`}
                required
              />
            </div>
            <div>
              <label htmlFor="password_or_no_hp" className="block text-sm font-medium text-gray-700">
                {formData.role === "admin" ? "Password" : "No HP"}
              </label>
              <input
                type={formData.role === "admin" ? "password" : "text"}
                id="password_or_no_hp"
                name="password_or_no_hp"
                value={formData.password_or_no_hp}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Masukkan ${formData.role === "admin" ? "password" : "no HP"} Anda`}
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

export default Login;
