import { useState, useEffect } from "react";
import axios from "axios";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const AdminPoli = () => {
  // State untuk menyimpan data poliklinik
  const [polikliniks, setPolikliniks] = useState([]);

  // State untuk modal tambah/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // State untuk data form
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    keterangan: "",
  });

  const apiBaseUrl = "http://localhost:8000/api/polis"; // Ganti sesuai konfigurasi backend Anda

  // Fetch data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchPolikliniks = async () => {
      try {
        const response = await axios.get(apiBaseUrl);
        setPolikliniks(
          response.data.map((item) => ({
            id: item.id,
            nama: item.nama_poli,
            keterangan: item.keterangan,
          }))
        );
      } catch (error) {
        console.error("Error fetching polikliniks:", error);
      }
    };
    fetchPolikliniks();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false); // Mode tambah
    setFormData({ id: null, nama: "", keterangan: "" }); // Reset form
    setIsModalOpen(true);
  };

  const openEditModal = (poliklinik) => {
    setIsEditMode(true); // Mode edit
    setFormData(poliklinik); // Isi form dengan data poliklinik
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, nama: "", keterangan: "" }); // Reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update poli
        await axios.put(`${apiBaseUrl}/${formData.id}`, {
          nama_poli: formData.nama,
          keterangan: formData.keterangan,
        });
      } else {
        // Tambah poli baru
        await axios.post(apiBaseUrl, {
          nama_poli: formData.nama,
          keterangan: formData.keterangan,
        });
      }
      // Refresh data setelah operasi
      const response = await axios.get(apiBaseUrl);
      setPolikliniks(
        response.data.map((item) => ({
          id: item.id,
          nama: item.nama_poli,
          keterangan: item.keterangan,
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
      setPolikliniks(polikliniks.filter((poliklinik) => poliklinik.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <>
    <div className="ml-64">
    <div className="bg-blue-50 h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Data Poliklinik</h1>
      <div className="flex justify-end items-center mb-4 pt-6">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Tambah Poliklinik
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead className="bg-blue-200">
            <tr>
            <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">Nama</th>
              <th className="py-2 px-4 border-b">Keterangan</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {polikliniks.map((poliklinik) => (
              <tr key={poliklinik.id} className="hover:bg-gray-100">
                <td className="text-center py-2 px-4 border-b">{poliklinik.id}</td>
                <td className="text-center py-2 px-4 border-b">{poliklinik.nama}</td>
                <td className="text-center py-2 px-4 border-b">{poliklinik.keterangan}</td>
                <td className="text-center py-2 px-4 border-b">
                  <button
                    onClick={() => openEditModal(poliklinik)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(poliklinik.id)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} />
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
              {isEditMode ? "Edit Data Poliklinik" : "Tambah Data Poliklinik"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-left">Nama</label>
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
                <label className="block font-semibold mb-1 text-left">Keterangan</label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                ></textarea>
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

export default AdminPoli;
