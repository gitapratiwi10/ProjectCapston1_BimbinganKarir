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
            <Route exact path="/dashboardpasien/:id" element={<PageDashboardPasien />} />
            <Route exact path="/dashboard-dokter/:id" element={<PageProfilDokter />} />
          </Routes>
    </Router>
    </>
  )
}
export default App
