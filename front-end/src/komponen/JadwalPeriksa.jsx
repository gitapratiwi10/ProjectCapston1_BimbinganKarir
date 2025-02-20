import { useEffect, useState } from "react";
import axios from "axios";
import { faEdit} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

axios.defaults.baseURL = "http://localhost:8000/api";

const JadwalPeriksa = () => {
  const [jadwal, setJadwal] = useState([]);
  const [dokter, setDokter] = useState(null);
  const [form, setForm] = useState({
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
    status: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });

 

  const showPopup = (message, type) => {
    setPopup({ message, type, visible: true });

    const timeoutId = setTimeout(() => {
      setPopup((prev) => ({ ...prev, visible: false }));
    }, 3000);

    return () => clearTimeout(timeoutId);
  };

  const loadDokterData = () => {
    const storedDokter = localStorage.getItem("dokter");
    if (storedDokter) {
      const parsedDokter = JSON.parse(storedDokter);
      setDokter(parsedDokter);
      console.log("Dokter berhasil dimuat:", parsedDokter);
    } else {
      showPopup("Data dokter tidak ditemukan. Silakan login ulang.", "error");
    }
  };

  const fetchJadwal = async () => {
    if (!dokter) return;
    try {
      const response = await axios.get("/jadwal-periksa", {
        params: { id_dokter: dokter.id },
      });
      setJadwal(response.data || []);
      showPopup("Berhasil memuat jadwal periksa", "success");
    } catch (err) {
      showPopup("Gagal memuat jadwal periksa.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({ hari: "", jam_mulai: "", jam_selesai: "", status: "" });
    setSelectedJadwal(null);
  };

  const handleAddJadwal = async (e) => {
    e.preventDefault();
    const isHariConflict = jadwal.some(
      (item) => item.hari.toLowerCase() === form.hari.toLowerCase()
    );
    if (isHariConflict) {
      showPopup("Hari ini sudah memiliki jadwal. Pilih hari lain.", "error");
      setIsAdding(false); // Tutup form meskipun error
      return;
    }
    if (form.jam_mulai >= form.jam_selesai) {
      showPopup("Jam selesai harus lebih besar dari jam mulai.", "error");
      setIsAdding(false); // Tutup form meskipun error
      return;
    }
    try {
      await axios.post("/jadwal-periksa", {
        ...form,
        id_dokter: dokter.id,
      });
      await fetchJadwal(); 
      resetForm();
      setIsAdding(false); 
      showPopup("Jadwal berhasil ditambahkan!", "success");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Kesalahan saat menambahkan jadwal.";
      showPopup(errorMessage, "error");
    } finally {
      resetForm();
      setIsAdding(false); // Tutup form
    }
  };

  const handleEditButtonClick = (item) => {
    console.log("Data jadwal yang diedit:", item);
    setSelectedJadwal(item);
    setForm({
      hari: item.hari,
      jam_mulai: item.jam_mulai,
      jam_selesai: item.jam_selesai,
      status: item.status, // Menyesuaikan status
    });
    setIsAdding(false);
  };

  const handleEditJadwal = async (e) => {
    e.preventDefault();
    if (!selectedJadwal) return;

    if (form.jam_mulai >= form.jam_selesai) {
      showPopup("Jam selesai harus lebih besar dari jam mulai.", "error");
      setIsAdding(false);
      return;
    }

    try {
      const updatedFields = Object.keys(form).reduce((acc, key) => {
        if (form[key] !== selectedJadwal[key]) {
          acc[key] = form[key];
        }
        return acc;
      }, {});

      if (Object.keys(updatedFields).length === 0) {
        showPopup("Tidak ada perubahan data.", "error");
        setIsAdding(false);
        return;
      }

      updatedFields.id_dokter = dokter.id;

      console.log("Mengirim data edit:", updatedFields);

      await axios.put(`/jadwal-periksa/${selectedJadwal.id}`, updatedFields);

      await fetchJadwal(); 
      resetForm(); 
      setIsAdding(false);
      showPopup("Jadwal berhasil diperbarui!", "success");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Kesalahan saat memperbarui jadwal.";
      showPopup(errorMessage, "error");
    } finally {
      resetForm();
      setIsAdding(false); // Tutup form
      setSelectedJadwal(null);
    }
  };

  useEffect(() => {
    loadDokterData();
  }, []);

  useEffect(() => {
    if (dokter) fetchJadwal();
  }, [dokter]);


  
  return (
    <>
    <div className="ml-64">
      <h1 className="text-3xl font-bold mb-4 pt-6 pl-6">Jadwal Periksa</h1>

      {/* Popup Notification */}
    {popup.visible && (
      <div
        className={`fixed right-4 top-4 px-6 py-4 text-lg font-semibold rounded text-white shadow-lg z-50 transition-all duration-300 ${
          popup.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {console.log("Rendering popup with message:", popup.message)}
        {popup.message}
      </div>
    )}
    <div className=" pl-6">
      <button
        onClick={() => {
          setIsAdding(true);
          resetForm();
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ">
        Tambah Jadwal
      </button>
      </div>
      <div></div>
      {(isAdding || selectedJadwal) && (
        <form onSubmit={isAdding ? handleAddJadwal : handleEditJadwal} className="bg-gray-100 p-6 my-4 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Nama Dokter</label>
              <input
                type="text"
                value={dokter?.nama || ""}
                className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Hari</label>
              <select
                type="text"
                name="hari"
                value={form.hari}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                    Pilih Hari
                  </option>
                <option value="senin">Senin</option>
                <option value="selasa">Selasa</option>
                <option value="rabu">Rabu</option>
                <option value="kamis">Kamis</option>
                <option value="jumat">Jumat</option>
                <option value="sabtu">Sabtu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Jam Mulai</label>
              <input
                type="time"
                name="jam_mulai"
                value={form.jam_mulai}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Jam Selesai</label>
              <input
                type="time"
                name="jam_selesai"
                value={form.jam_selesai}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                    Pilih Status
                  </option>
                <option value="aktif">aktif</option>
                <option value="tidak aktif">tidak aktif</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              {isAdding ? "Simpan Jadwal" : "Perbarui Jadwal"}
            </button>
            <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAdding(false);
              setSelectedJadwal(null);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Batal
          </button>
          </div>
        </form>
      )}
      <div className="py-2 px-6">
      <table className="w-full mt-4 border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Nama Dokter</th>
            <th className="border px-4 py-2">Hari</th>
            <th className="border px-4 py-2">Jam Mulai</th>
            <th className="border px-4 py-2">Jam Selesai</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jadwal.length > 0 ? (
            jadwal.map((item, index) => (
              <tr key={item.id}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2">{dokter?.nama}</td>
                <td className="border px-4 py-2">{item.hari}</td>
                <td className="border px-4 py-2">{item.jam_mulai}</td>
                <td className="border px-4 py-2">{item.jam_selesai}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditButtonClick(item)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border px-4 py-2 text-center">Tidak ada jadwal.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
    </>
  );
};

export default JadwalPeriksa;
