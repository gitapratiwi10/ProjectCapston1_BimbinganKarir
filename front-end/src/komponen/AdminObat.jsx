import { useState, useEffect } from "react";
import axios from "axios";

const AdminObat = () => {
  // State untuk menyimpan data obat
  const [obats, setObats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // State untuk data form
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    kemasan: "",
    harga: "",
  });

  const apiBaseUrl = "http://localhost:8000/api/obat"; // Ganti dengan URL backend Anda

  // Fetch data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchObats = async () => {
      try {
        const response = await axios.get(apiBaseUrl);
        setObats(
          response.data.map((item) => ({
            id: item.id,
            nama: item.nama_obat,
            kemasan: item.kemasan,
            harga: item.harga,
          }))
        );
      } catch (error) {
        console.error("Error fetching obats:", error);
      }
    };
    fetchObats();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false); // Mode tambah
    setFormData({ id: null, nama: "", kemasan: "", harga: "" }); // Reset form
    setIsModalOpen(true);
  };

  const openEditModal = (obat) => {
    setIsEditMode(true); // Mode edit
    setFormData(obat); // Isi form dengan data obat
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, nama: "", kemasan: "", harga: "" }); // Reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update obat
        await axios.put(`${apiBaseUrl}/${formData.id}`, {
          nama_obat: formData.nama,
          kemasan: formData.kemasan,
          harga: Number(formData.harga),
        });
      } else {
        // Tambah obat baru
        await axios.post(apiBaseUrl, {
          nama_obat: formData.nama,
          kemasan: formData.kemasan,
          harga: Number(formData.harga),
        });
      }
      // Refresh data setelah operasi
      const response = await axios.get(apiBaseUrl);
      setObats(
        response.data.map((item) => ({
          id: item.id,
          nama: item.nama_obat,
          kemasan: item.kemasan,
          harga: item.harga,
        }))
      );
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      setObats(obats.filter((obat) => obat.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <>
    <div className="ml-64">
    <div className="bg-blue-50 h-screen p-8">
      <h1 className="text-2xl font-bold mb-4"> Data Obat</h1>
      <div className="flex justify-end items-center mb-4 pt-6">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Tambah Obat
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead className="bg-blue-200">
            <tr>
            <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">Nama Obat</th>
              <th className="py-2 px-4 border-b">Kemasan</th>
              <th className="py-2 px-4 border-b">Harga</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {obats.map((obat) => (
              <tr key={obat.id} className="hover:bg-gray-100">
                <td className="text-center py-2 px-4 border-b">{obat.id}</td>
                <td className="text-center py-2 px-4 border-b">{obat.nama}</td>
                <td className="text-center py-2 px-4 border-b">{obat.kemasan}</td>
                <td className="text-center py-2 px-4 border-b">Rp {obat.harga.toLocaleString()}</td>
                <td className="text-center py-2 px-4 border-b">
                  <button
                    onClick={() => openEditModal(obat)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(obat.id)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Data Obat" : "Tambah Data Obat"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Nama Obat</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Kemasan</label>
                <input
                  type="text"
                  name="kemasan"
                  value={formData.kemasan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Harga</label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default AdminObat;
