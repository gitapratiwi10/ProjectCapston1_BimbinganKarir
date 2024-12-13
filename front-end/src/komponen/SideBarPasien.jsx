import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaRegFileAlt, FaSignOutAlt } from "react-icons/fa";

const SideBarPasien = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Profil", path: "/profil", icon: <FaUser /> },
    { name: "Rekam Medis", path: "/rekam-medis", icon: <FaRegFileAlt /> },
  ];

  return (
    <div className="h-screen bg-blue-800 text-white w-64 flex flex-col fixed left-0 top-0">
      <div className="py-4 text-center font-bold text-lg border-b border-blue-600">
        Pasien Panel
      </div>
      <nav className="mt-4 flex flex-col flex-grow">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center py-3 px-4 text-base font-medium transition-colors ${
                isActive
                  ? "bg-blue-400 text-black"
                  : "hover:bg-blue-500 hover:text-black"
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-blue-600 mt-auto">
        <NavLink
          to="/"
          className="flex items-center py-3 px-4 text-base font-medium transition-colors hover:bg-blue-500 hover:text-black"
        >
          <span className="mr-3 text-lg">
            <FaSignOutAlt />
          </span>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default SideBarPasien;