import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import LoginUser from "./page/LoginUser"
import PageAdminDokter from './page/PadeAdminDokter';
import PageAdminObat from './page/PageAdminObat';
import PageAdminPasien from './page/PageAdminPasien';
import PageAdminPoli from './page/PageAdminPoli';
import PageAdminDashboard from "./page/PageAdminDashboard";
import LoginUser from "./page/LoginUser";
import RegisterUser from "./page/RegisterUser";
import Login from "./page/Login";
import Index from "./page/Index";
import PageDashboardPasien from "./page/PageDashboardPasien";
import PageProfilDokter from "./page/PageProfilDokter";
import PageJadwalPeriksa from "./page/PageJadwalPeriksa";
import PageDaftarPoli from "./page/PageDaftarPoli";
import PageDataPeriksaPasien from "./page/PageDataPeriksaPasien";
import PageDetailPeriksaPasien from "./page/PageDetailPeriksaPasien";
import PageRiwayatPasien from "./page/PageRiwayatPasien";
import PageDetailRiwayatPasien from "./page/PageRiwayatPasienDokter";
import PagePasienRiwayat from "./page/PagePasienRiwayat";


function App() {

  return (
    <>
      <Router>
          <Routes>
            <Route exact path="/" element={<Index/>} />
            <Route exact path="/admindashboard" element={<PageAdminDashboard/>} />
            <Route exact path="/dokter" element={<PageAdminDokter />} />
            <Route exact path="/pasien" element={<PageAdminPasien />} />
            <Route exact path="/poli" element={<PageAdminPoli />} />
            <Route exact path="/obat" element={<PageAdminObat />} />
            <Route exact path="/loginuser" element={<LoginUser />} />
            <Route exact path="/registeruser" element={<RegisterUser />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/pasien/:id/profil" element={<PageDashboardPasien />} />
            <Route exact path="/pasien/:id/Daftar-Poli" element={<PageDaftarPoli />} />
            <Route exact path="/dokter/:id/profil" element={<PageProfilDokter />} />
            <Route exact path="/dokter/:id/input-jadwal" element={<PageJadwalPeriksa/>} />
            <Route exact path="/dokter/:id/data-pasien" element={<PageDataPeriksaPasien/>} />
            <Route exact path="/dokter/:idDokter/data-pasien/periksa/:id" element={<PageDetailPeriksaPasien/>} />
            <Route exact path="/dokter/:idDokter/data-pasien/edit/:id" element={<PageDetailPeriksaPasien/>} />
            <Route exact path="/dokter/:id/riwayat-pasien" element={<PageRiwayatPasien/>} />
            <Route exact path="/dokter/:idDokter/Detail-riwayat-pasien/:id" element={<PageDetailRiwayatPasien/>} />
            <Route exact path="/detail-riwayat-pasien/:id_daftar_poli" element={<PagePasienRiwayat/>} />
          </Routes>
    </Router>
    </>
  )
}
export default App
