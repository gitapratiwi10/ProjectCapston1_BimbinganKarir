import { useState, useEffect } from "react";
import axios from "axios";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const AdminDokter = () => {
  const [dokters, setDokters] = useState([]);
  const [polis, setPolis] = useState([]); // State untuk menyimpan data poli
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    alamat: "",
    no_hp: "",
    id_poli: "",
  });

  // Fungsi untuk mengambil data dokter
  const fetchDokters = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/dokters");
      setDokters(response.data);
    } catch (error) {
      console.error("Error fetching dokters:", error);
    }
  };

  // Fungsi untuk mengambil data poli
  const fetchPolis = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/polis");
      setPolis(response.data);
    } catch (error) {
      console.error("Error fetching polis:", error);
    }
  };

  useEffect(() => {
    fetchDokters();
    fetchPolis();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: null, nama: "", alamat: "", no_hp: "", id_poli: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (dokter) => {
    setIsEditMode(true);
    setEditId(dokter.id);
    setFormData({
      nama: dokter.nama,
      alamat: dokter.alamat,
      no_hp: dokter.no_hp,
      id_poli: dokter.id_poli,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8000/api/dokters/${editId}`, formData);
      } else {
        await axios.post("http://localhost:8000/api/dokters", formData);
      }
      fetchDokters();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving dokter:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/dokters/${id}`);
      fetchDokters();
    } catch (error) {
      console.error("Error deleting dokter:", error);
    }
  };

  return (
    <>
      <div className="ml-64">
        <div className="bg-blue-50 h-screen p-8">
          <h1 className="text-2xl font-bold mb-4">Data Dokter</h1>
          <div className="flex justify-end items-center mb-4 pt-6">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              Tambah Dokter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded">
              <thead className="bg-blue-200">
                <tr>
                  <th className="py-2 px-4 border-b">No</th>
                  <th className="py-2 px-4 border-b">Nama</th>
                  <th className="py-2 px-4 border-b">Alamat</th>
                  <th className="py-2 px-4 border-b">No HP</th>
                  <th className="py-2 px-4 border-b">Poli</th>
                  <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dokters.map((dokter) => (
                  <tr key={dokter.id} className="hover:bg-gray-100">
                    <td className="text-center py-2 px-4 border-b">{dokter.id}</td>
                    <td className="text-center py-2 px-4 border-b">{dokter.nama}</td>
                    <td className="text-center py-2 px-4 border-b">{dokter.alamat}</td>
                    <td className="text-center py-2 px-4 border-b">{dokter.no_hp}</td>
                    <td className="text-center py-2 px-4 border-b">
                      {polis.find((poli) => poli.id === dokter.id_poli)?.nama_poli || "N/A"}
                    </td>
                    <td className="text-center py-2 px-4 border-b">
                      <button
                        onClick={() => openEditModal(dokter)}
                        className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 mr-2"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(dokter.id)}
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
                  {isEditMode ? "Edit Data Dokter" : "Tambah Data Dokter"}
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
                    <label className="block font-semibold mb-1 text-left">Alamat</label>
                    <input
                      type="text"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1 text-left">No HP</label>
                    <input
                      type="text"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1 text-left">Poli</label>
                    <select
                      name="id_poli"
                      value={formData.id_poli}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    >
                      <option value="" disabled>
                        Pilih Poli
                      </option>
                      {polis.map((poli) => (
                        <option key={poli.id} value={poli.id}>
                          {poli.nama_poli}
                        </option>
                      ))}
                    </select>
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

export default AdminDokter;
