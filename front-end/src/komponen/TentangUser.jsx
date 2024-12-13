function TentangUser() {
    return (
      <>
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-20 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-center">
              <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">About Us</h2>
              <p className="text-gray-700 max-w-2xl">
                Selamat datang di Nature Medika, poliklinik yang hadir dengan komitmen untuk memberikan pelayanan kesehatan terbaik bagi Anda dan keluarga. Kami menyediakan berbagai layanan medis dengan fasilitas modern dan tenaga medis yang berkompeten. Di Nature Medika, kami percaya bahwa kesehatan adalah aset yang sangat berharga, sehingga kami berupaya memberikan perawatan yang tidak hanya efektif, tetapi juga ramah dan nyaman bagi setiap pasien.
                <br />
                <br />
                Dengan mengutamakan pendekatan holistik, Nature Medika berfokus pada pencegahan, diagnosis, serta perawatan yang menyeluruh. Kami selalu berinovasi untuk menawarkan solusi kesehatan yang sesuai dengan kebutuhan Anda, didukung oleh teknologi terbaru dan layanan yang terpercaya. Kami siap mendampingi Anda dalam menjaga kualitas hidup yang lebih sehat dan seimbang.
              </p>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
              <img
                src="/src/assets/rs5.png"
                alt="Nature Medika"
                className="rounded-lg shadow-lg w-full max-w-md"
              />
            </div>
          </div>
        </section>
      </>
    );
  }
  
  export default TentangUser;