function PoliUser() {
    const poliList = [
        { name: "Poli Umum", description: "Layanan kesehatan dasar dan konsultasi umum." },
        { name: "Poli Anak", description: "Perawatan khusus untuk anak-anak dan bayi." },
        { name: "Poli Gigi", description: "Layanan kesehatan gigi dan mulut." },
        { name: "Poli Mata", description: "Perawatan dan pemeriksaan kesehatan mata." },
        { name: "Poli Bedah", description: "Konsultasi dan tindakan operasi." },
        { name: "Poli Kulit", description: "Layanan khusus untuk kesehatan kulit." },
    ];

    // Mapping background images based on poli name
    const backgroundImages = {
        "Poli Umum": "url('/src/assets/umum.jpg')",
        "Poli Anak": "url('/src/assets/anak.jpg')",
        "Poli Gigi": "url('/src/assets/gigi.jpg')",
        "Poli Mata": "url('/src/assets/mata.jpg')",
        "Poli Bedah": "url('/src/assets/bedah.jpg')",
        "Poli Kulit": "url('/src/assets/kulit.jpg')",
    };

    return (
        <section id="poli" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Macam-Macam Poli</h2>
                <div className="flex overflow-x-auto space-x-4 scrollbar-hidden">
                    {poliList.map((poli, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-1/2 max-w-lg shadow-lg rounded-lg overflow-hidden p-8 border hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
                            style={{ 
                                backgroundImage: backgroundImages[poli.name], 
                                backgroundSize: 'cover', 
                                backgroundPosition: 'center', 
                                height: '250px' 
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-semibold text-white mb-4">{poli.name}</h3>
                                <p className="text-gray-200 text-lg">{poli.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PoliUser;
