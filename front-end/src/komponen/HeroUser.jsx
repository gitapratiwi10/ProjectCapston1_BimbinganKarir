

function HeroUser() {
  return (
    <>
    <section
  id="home"
  className="bg-blue-50 py-20 text-center bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/src/assets/rs5.png')",
    backgroundSize: "cover", // Pastikan gambar memenuhi elemen
    backgroundAttachment: "fixed", 
  }}
>
  <div className="container mx-auto px-6 bg-white bg-opacity-70 py-10">
    <p className="text-lg text-gray-700 mb-6">
    Selamat datang di Nature Medika, poliklinik yang hadir dengan komitmen untuk memberikan pelayanan kesehatan terbaik bagi Anda dan keluarga.
    </p>
    <button className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700">
      Learn More
    </button>
  </div>
</section>

    </>
  )
}

export default HeroUser