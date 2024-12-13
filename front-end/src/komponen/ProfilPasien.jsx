import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilPasien = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("pasien");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const response = await axios.get(
            `http://localhost:8000/api/pasien/${user.id}`
          );
          setUserData(response.data);
        } else {
          navigate("/login"); // Redirect to login if no user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <>
    <div className="flex ml-64">
    <div className="bg-blue-50 h-screen p-8 w-full">
      <h1 className="text-3xl font-bold mb-4">Profil</h1>
      {userData ? (
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-2">
            <strong>Nama:</strong> {userData.nama}
          </p>
          <p className="mb-2">
            <strong>No KTP:</strong> {userData.no_ktp}
          </p>
          <p className="mb-2">
            <strong>No HP:</strong> {userData.no_hp}
          </p>
          <p className="mb-2">
            <strong>No RM:</strong> {userData.no_rm}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
    </>
  )
}

export default ProfilPasien