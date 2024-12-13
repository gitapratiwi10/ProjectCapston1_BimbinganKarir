
function NavbarUser() {
  return (
    <>
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="text-2xl font-bold">NatureMedika</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#home" className="hover:text-blue-200">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-blue-200">
                About
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-100 mr-2">
            <a href="/loginuser"> Login</a>
          </button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-md shadow hover:bg-blue-800">
            <a href="/registeruser">Register</a>
          </button>
        </div>
      </div>
    </header>
    </>
  )
}

export default NavbarUser