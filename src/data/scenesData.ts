import { SceneData, QuizQuestion } from '../types';

export const TOTAL_VIDEO_DURATION = 115; // 1 minute 55 seconds (within 90-120s range)

export const SCENES: SceneData[] = [
  {
    id: 1,
    babakNumber: 1,
    title: 'Babak 1: Pengenalan',
    theme: 'Keindahan Kitaran Air Semula Jadi',
    startTime: 0,
    endTime: 14,
    duration: 14,
    narrationText: 'Kitaran air semula jadi sangat penting untuk kehidupan di Bumi. Tetapi, apakah yang akan berlaku jika aliran air terganggu?',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 6.8, text: 'Kitaran air semula jadi sangat penting untuk kehidupan di Bumi.' },
      { startOffset: 7.2, endOffset: 13.5, text: 'Tetapi, apakah yang akan berlaku jika aliran air terganggu?' },
    ],
    visualDescription: 'Bumi yang indah dengan sungai yang mengalir jernih, tasik berkilau, hutan hijau segar, tumbuhan subur dan haiwan riang. Watak titisan air bernama Titis muncul menyapa penonton dengan senyuman mesra.',
    titisEmotion: 'happy',
    bgmMood: 'peaceful',
    ambientSound: 'nature_stream',
    environmentStyle: {
      skyColor: '#60a5fa',
      groundColor: '#34d399',
      lightColor: '#fef08a',
      sunPosition: [8, 12, 6],
      fogColor: '#93c5fd',
      fogDensity: 0.012,
    },
    hotspots: [
      {
        id: 'hs-river',
        title: 'Sungai Bersih',
        description: 'Membawa air tawar ke tasik dan lautan, membekalkan minuman kepada hidupan.',
        position3D: [0, 0.4, 1.5],
      },
      {
        id: 'hs-forest',
        title: 'Hutan Tadahan Hujan',
        description: 'Akar pokok menyerap dan menapis air hujan ke dalam tanah.',
        position3D: [-3, 1.8, -2],
      },
      {
        id: 'hs-titis',
        title: 'Hai, Saya Titis!',
        description: 'Saya mewakili titisan air dalam kitaran hidrologi Bumi kita.',
        position3D: [0, 2.2, 0],
      },
    ],
    keyTerms: [
      { term: 'Kitaran Air Semula Jadi', meaning: 'Pergerakan air yang berterusan dari permukaan Bumi ke atmosfera dan kembali semula ke Bumi.' },
      { term: 'Aliran Air', meaning: 'Pergerakan air dari tempat tinggi mengalir ke tempat rendah melalui sungai dan anak sungai.' },
    ],
  },
  {
    id: 2,
    babakNumber: 2,
    title: 'Babak 2: Kemarau',
    theme: 'Ketiadaan Hujan & Kekeringan',
    startTime: 14,
    endTime: 28,
    duration: 14,
    narrationText: 'Apabila hujan berkurangan untuk tempoh yang panjang, kemarau boleh berlaku. Sungai dan tasik mungkin menyusut, tanah menjadi kering dan manusia, haiwan serta tumbuhan mengalami kekurangan air.',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 6.5, text: 'Apabila hujan berkurangan untuk tempoh yang panjang, kemarau boleh berlaku.' },
      { startOffset: 7.0, endOffset: 13.5, text: 'Sungai dan tasik menyusut, tanah merekah, hidupan kekurangan air.' },
    ],
    visualDescription: 'Matahari terik membakar di langit, tanah kering dan merekah, sungai menyusut tinggal lumpur, pokok-pokok layu kekuningan. Titis melihat keadaan ini dengan wajah sedih dan prihatin.',
    titisEmotion: 'sad',
    bgmMood: 'dry_heat',
    ambientSound: 'scorching_wind',
    environmentStyle: {
      skyColor: '#fdba74',
      groundColor: '#d97706',
      lightColor: '#ffedd5',
      sunPosition: [2, 14, 2],
      fogColor: '#fed7aa',
      fogDensity: 0.02,
    },
    hotspots: [
      {
        id: 'hs-sun',
        title: 'Pancaran Terik Matahari',
        description: 'Penyejatan berlaku dengan sangat cepat tanpa hujan yang mencukupi untuk menggantikannya.',
        position3D: [2, 7, 0],
      },
      {
        id: 'hs-cracks',
        title: 'Tanah Merekah',
        description: 'Kelembapan tanah hilang sepenuhnya sehingga zarah tanah mengecut dan merekah.',
        position3D: [1.5, 0.2, 1],
      },
      {
        id: 'hs-shrunk-river',
        title: 'Sungai Menyusut',
        description: 'Ketiadaan air hujan menyebabkan paras air sungai menjunam ke tahap kritikal.',
        position3D: [-1.2, 0.3, 0],
      },
    ],
    keyTerms: [
      { term: 'Kemarau', meaning: 'Keadaan cuaca kering tanpa hujan yang berpanjangan sehingga menyebabkan ketiadaan air.' },
      { term: 'Penyejatan (Evaporation)', meaning: 'Proses air cecair berubah menjadi wap air akibat haba matahari.' },
    ],
  },
  {
    id: 3,
    babakNumber: 3,
    title: 'Babak 3: Banjir',
    theme: 'Limpahan Air Hujan Berlebihan',
    startTime: 28,
    endTime: 42,
    duration: 14,
    narrationText: 'Hujan yang terlalu lebat dalam tempoh singkat boleh menyebabkan banjir. Banjir boleh merosakkan rumah, jalan raya dan tanaman serta membahayakan nyawa.',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 6.5, text: 'Hujan yang terlalu lebat dalam tempoh singkat boleh menyebabkan banjir.' },
      { startOffset: 7.0, endOffset: 13.5, text: 'Banjir merosakkan rumah, jalan raya, tanaman serta membahayakan nyawa.' },
    ],
    visualDescription: 'Awan mendung gelap berkumpul, titisan hujan lebat mencurah di atas kawasan perumahan. Air melimpah dari parit ke jalan raya, pelampung keselamatan terapung, air memasuki halaman rumah secara mesra kanak-kanak tanpa rasa takut.',
    titisEmotion: 'worried',
    bgmMood: 'rain_storm',
    ambientSound: 'heavy_rain',
    environmentStyle: {
      skyColor: '#475569',
      groundColor: '#64748b',
      lightColor: '#94a3b8',
      sunPosition: [0, 8, -5],
      fogColor: '#64748b',
      fogDensity: 0.025,
    },
    hotspots: [
      {
        id: 'hs-rainclouds',
        title: 'Awan Kumulonimbus',
        description: 'Awan tebal membawa titisan air yang banyak dan menghasilkan hujan lebat.',
        position3D: [0, 6, -1],
      },
      {
        id: 'hs-drainage',
        title: 'Sistem Saliran Melimpah',
        description: 'Longkang dan sungai tidak mampu menampung isipadu air yang mendadak.',
        position3D: [-1.8, 0.5, 1.2],
      },
      {
        id: 'hs-safety',
        title: 'Keselamatan Banjir',
        description: 'Jangan bermain air banjir dan sentiasa patuhi arahan keselamatan guru serta ibu bapa.',
        position3D: [1.8, 0.8, 0.5],
      },
    ],
    keyTerms: [
      { term: 'Banjir', meaning: 'Keadaan di mana air melimpahi daratan kering yang biasanya tidak diliputi air.' },
      { term: 'Kondensasi (Condensation)', meaning: 'Wap air menyejuk membentuk titisan air dan awan.' },
    ],
  },
  {
    id: 4,
    babakNumber: 4,
    title: 'Babak 4: Kekurangan Bekalan Air Bersih',
    theme: 'Krisis Air Domestik',
    startTime: 42,
    endTime: 56,
    duration: 14,
    narrationText: 'Apabila sumber air berkurangan, bekalan air bersih untuk minum, memasak, mandi dan mencuci juga boleh terjejas.',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 6.2, text: 'Apabila sumber air berkurangan...' },
      { startOffset: 6.8, endOffset: 13.5, text: 'Bekalan air bersih untuk minum, memasak, mandi dan mencuci boleh terjejas.' },
    ],
    visualDescription: 'Sebuah pili air logam besar mengeluarkan titisan terakhir sebelum terhenti. Di latar belakang, empangan mempunyai penanda paras air yang sangat rendah. Bekas dan baldi kosong tersusun menunggu air.',
    titisEmotion: 'worried',
    bgmMood: 'sombre',
    ambientSound: 'water_drip',
    environmentStyle: {
      skyColor: '#94a3b8',
      groundColor: '#b45309',
      lightColor: '#f1f5f9',
      sunPosition: [5, 10, 3],
      fogColor: '#cbd5e1',
      fogDensity: 0.015,
    },
    hotspots: [
      {
        id: 'hs-tap',
        title: 'Pili Air Kering',
        description: 'Tanpa tekanan air dari loji rawatan, paip di rumah kita tidak dapat mengeluarkan air.',
        position3D: [0, 2.8, 0],
      },
      {
        id: 'hs-dam',
        title: 'Paras Empangan Merosot',
        description: 'Empangan air berfungsi sebagai takungan utama untuk kegunaan jutaan penduduk.',
        position3D: [0, 0.8, -4],
      },
      {
        id: 'hs-bucket',
        title: 'Bekas Simpanan Air',
        description: 'Penduduk terpaksa beratur mendapatkan lori tangki air apabila bekalan terputus.',
        position3D: [1.5, 0.4, 1.2],
      },
    ],
    keyTerms: [
      { term: 'Air Terawat (Air Bersih)', meaning: 'Air yang telah ditapis dan dirawat di loji rawatan agar selamat untuk diminum.' },
      { term: 'Empangan (Dam)', meaning: 'Struktur binaan besar yang menakung air untuk kegunaan manusia dan stesen hidroelektrik.' },
    ],
  },
  {
    id: 5,
    babakNumber: 5,
    title: 'Babak 5: Tumbuhan Layu & Hasil Pertanian Menurun',
    theme: 'Ancaman Kepada Sekuriti Makanan',
    startTime: 56,
    endTime: 70,
    duration: 14,
    narrationText: 'Kekurangan air menyebabkan tumbuhan sukar membesar dan boleh mati. Hasil pertanian seperti padi, sayur-sayuran dan buah-buahan juga boleh menurun, sekali gus menjejaskan bekalan makanan.',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 6.2, text: 'Kekurangan air menyebabkan tumbuhan sukar membesar dan boleh mati.' },
      { startOffset: 6.8, endOffset: 13.5, text: 'Hasil padi, sayur dan buah menurun, sekali gus menjejaskan bekalan makanan.' },
    ],
    visualDescription: 'Kawasan ladang pertanian yang kekeringan. Pokok padi dan sayur menunduk layu dan mengering. Tanah batas merekah. Topi anyaman petani tergantung dengan bakul kosong.',
    titisEmotion: 'sad',
    bgmMood: 'wilting',
    ambientSound: 'dry_breeze',
    environmentStyle: {
      skyColor: '#e2e8f0',
      groundColor: '#78350f',
      lightColor: '#fef3c7',
      sunPosition: [6, 9, 2],
      fogColor: '#fde68a',
      fogDensity: 0.018,
    },
    hotspots: [
      {
        id: 'hs-wilted-plant',
        title: 'Tumbuhan Layu',
        description: 'Tumbuhan memerlukan air untuk proses fotosintesis dan mengekalkan kesegaran sel (turgor).',
        position3D: [1.2, 0.8, 0.8],
      },
      {
        id: 'hs-paddy-field',
        title: 'Sawah Padi Kering',
        description: 'Padi memerlukan takungan air yang mencukupi untuk mengeluarkan butir beras berkualiti.',
        position3D: [-1.5, 0.3, 0],
      },
      {
        id: 'hs-food-security',
        title: 'Bekalan Makanan Berkurang',
        description: 'Kegagalan tanaman menyebabkan harga makanan meningkat dan kekurangan bekalan nutrien.',
        position3D: [0, 0.5, 1.8],
      },
    ],
    keyTerms: [
      { term: 'Fotosintesis', meaning: 'Proses tumbuhan hijau menghasilkan makanannya sendiri dengan bantuan air, cahaya dan karbon dioksida.' },
      { term: 'Hasil Pertanian', meaning: 'Pengeluaran bahan makanan tanaman seperti beras, sayuran dan buah-buahan.' },
    ],
  },
  {
    id: 6,
    babakNumber: 6,
    title: 'Babak 6: Haiwan Kehilangan Habitat',
    theme: 'Keseimbangan Ekosistem Terancam',
    startTime: 70,
    endTime: 84,
    duration: 14,
    narrationText: 'Apabila sungai, tasik dan kolam mengering, haiwan boleh kehilangan habitat dan sumber air. Keadaan ini mengancam kelangsungan hidup haiwan serta keseimbangan ekosistem.',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 6.5, text: 'Apabila sungai, tasik dan kolam mengering, haiwan kehilangan habitat dan sumber air.' },
      { startOffset: 7.0, endOffset: 13.5, text: 'Keadaan ini mengancam kelangsungan hidup haiwan serta keseimbangan ekosistem.' },
    ],
    visualDescription: 'Sungai cetek dengan batu-batu sungai terdedah, lopak air kecil tempat ikan berenang gelisah. Haiwan darat comel seperti arnab dan rusa merayau mencari saki-baki sumber air minum.',
    titisEmotion: 'serious',
    bgmMood: 'fragile',
    ambientSound: 'shallow_stream',
    environmentStyle: {
      skyColor: '#cbd5e1',
      groundColor: '#713f12',
      lightColor: '#ffedd5',
      sunPosition: [4, 8, -3],
      fogColor: '#e2e8f0',
      fogDensity: 0.016,
    },
    hotspots: [
      {
        id: 'hs-aquatic-habitat',
        title: 'Habitat Akuatik',
        description: 'Ikan dan hidupan akuatik bernafas menggunakan insang yang memerlukan air beroksigen.',
        position3D: [0, 0.2, 0.8],
      },
      {
        id: 'hs-land-animals',
        title: 'Haiwan Daratan',
        description: 'Haiwan rimba terpaksa berhijrah jauh mencari lopak air yang masih ada.',
        position3D: [-2.2, 1.2, -1],
      },
      {
        id: 'hs-ecosystem',
        title: 'Rangkaian Makanan Terjejas',
        description: 'Jika haiwan mati atau berhijrah, rantaian makanan dan keseimbangan alam akan terganggu.',
        position3D: [2, 1, 0.5],
      },
    ],
    keyTerms: [
      { term: 'Habitat', meaning: 'Tempat semula jadi sesuatu haiwan atau tumbuhan tinggal dan membiak.' },
      { term: 'Ekosistem', meaning: 'Hubungan saling bergantungan antara hidupan dengan persekitaran bukan hidup mereka.' },
    ],
  },
  {
    id: 7,
    babakNumber: 7,
    title: 'Babak 7: Perubahan Cuaca dan Suhu',
    theme: 'Corak Cuaca & Atmosfera',
    startTime: 84,
    endTime: 98,
    duration: 14,
    narrationText: 'Gangguan dalam kitaran air boleh mempengaruhi kelembapan, suhu dan corak hujan di sesebuah kawasan. Kesannya bergantung pada keadaan persekitaran dan faktor cuaca yang lain.',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 6.8, text: 'Gangguan kitaran air mempengaruhi kelembapan, suhu dan corak hujan.' },
      { startOffset: 7.2, endOffset: 13.5, text: 'Kesannya bergantung pada keadaan persekitaran dan faktor cuaca lain.' },
    ],
    visualDescription: 'Sfera model Bumi atmosfera dengan simbol matahari terik di satu sisi dan awan hujan di sisi lain. Paparan termometer suhu dan penunjuk kelembapan udara yang bergerak seimbang.',
    titisEmotion: 'thoughtful',
    bgmMood: 'curious',
    ambientSound: 'wind_chimes',
    environmentStyle: {
      skyColor: '#38bdf8',
      groundColor: '#0284c7',
      lightColor: '#f8fafc',
      sunPosition: [0, 10, 5],
      fogColor: '#bae6fd',
      fogDensity: 0.01,
    },
    hotspots: [
      {
        id: 'hs-globe',
        title: 'Keseimbangan Atmosfera',
        description: 'Kitaran air bertindak sebagai pengatur haba gergasi bagi planet Bumi kita.',
        position3D: [0, 1.5, 0],
      },
      {
        id: 'hs-humidity',
        title: 'Kelembapan Udara',
        description: 'Kandungan wap air di udara mempengaruhi pembentukan awan dan suhu persekitaran.',
        position3D: [-2, 2.5, 0],
      },
      {
        id: 'hs-temp',
        title: 'Pengawalan Suhu',
        description: 'Ketiadaan air dan pokok menyebabkan suhu permukaan meningkat dengan ketara.',
        position3D: [2, 2.5, 0],
      },
    ],
    keyTerms: [
      { term: 'Kelembapan Udara', meaning: 'Jumlah kandungan wap air yang terdapat di dalam udara.' },
      { term: 'Pola Cuaca', meaning: 'Corak keadaan atmosfera harian seperti suhu, angin dan taburan hujan.' },
    ],
  },
  {
    id: 8,
    babakNumber: 8,
    title: 'Babak 8: Penutup dan Kesedaran',
    theme: 'Tindakan Positif & Pemuliharaan',
    startTime: 98,
    endTime: 115,
    duration: 17,
    narrationText: 'Oleh itu, marilah kita menjaga sumber air, mengelakkan pencemaran, memelihara hutan dan menggunakan air secara berhemah. Setiap tindakan kecil kita membantu melindungi alam sekitar dan kehidupan di Bumi.',
    speechSubtitles: [
      { startOffset: 0.5, endOffset: 7.0, text: 'Marilah kita menjaga sumber air, elak pencemaran, pelihara hutan dan jimatkan air.' },
      { startOffset: 7.5, endOffset: 14.0, text: 'Setiap tindakan kecil kita membantu melindungi alam sekitar dan kehidupan di Bumi.' },
      { startOffset: 14.2, endOffset: 16.8, text: 'JAGA AIR, JAGA KEHIDUPAN!' },
    ],
    visualDescription: 'Suasana cerah, ceria dan penuh harapan! Kanak-kanak menanam anak pokok, membersihkan tepi sungai, menutup pili air rapat. Sungai mengalir biru jernih dengan pelangi indah di langit. Titis tersenyum gembira sambil melompat riang!',
    titisEmotion: 'hopeful',
    bgmMood: 'celebratory',
    ambientSound: 'happy_forest',
    environmentStyle: {
      skyColor: '#38bdf8',
      groundColor: '#22c55e',
      lightColor: '#fef08a',
      sunPosition: [6, 11, 4],
      fogColor: '#a7f3d0',
      fogDensity: 0.009,
    },
    hotspots: [
      {
        id: 'hs-tree-planting',
        title: 'Menanam Pokok',
        description: 'Pokok menguatkan tebing sungai dan mengekalkan kitaran transpirasi air.',
        position3D: [-2.5, 1.2, 0.5],
      },
      {
        id: 'hs-clean-river',
        title: 'Sungai Yang Bersih',
        description: 'Jangan buang sampah ke dalam longkang dan sungai agar air kekal suci.',
        position3D: [0, 0.3, 1.5],
      },
      {
        id: 'hs-titis-joy',
        title: 'Titis Tersenyum!',
        description: 'Titis gembira kerana air di Bumi kembali bersih, jernih dan terjaga.',
        position3D: [0, 2.3, 0],
      },
    ],
    keyTerms: [
      { term: 'Pemuliharaan Air', meaning: 'Usaha melindungi, memelihara dan mengurus sumber air secara bijaksana.' },
      { term: 'Penggunaan Berhemah', meaning: 'Menggunakan air mengikut keperluan tanpa membazir (contoh: tutup pili semasa menggosok gigi).' },
    ],
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Apakah yang boleh berlaku kepada sungai dan tasik jika hujan berkurangan untuk tempoh yang panjang?',
    options: [
      'Sungai dan tasik melimpah ruah',
      'Sungai dan tasik menyusut dan tanah menjadi kering',
      'Air sungai bertukar menjadi ais',
      'Tiada apa-apa perubahan berlaku'
    ],
    correctIndex: 1,
    explanation: 'Ketiadaan hujan yang berpanjangan menyebabkan kemarau. Air sungai dan tasik akan menyusut kerana penyejatan berterusan tanpa penggantian hujan.'
  },
  {
    id: 2,
    question: 'Hujan yang terlalu lebat dalam tempoh masa yang singkat boleh mengakibatkan peristiwa apa?',
    options: [
      'Gempa bumi',
      'Salji tebal',
      'Banjir',
      'Gunung berapi meletus'
    ],
    correctIndex: 2,
    explanation: 'Isipadu air hujan yang terlalu banyak dalam masa singkat melebihi kapasiti saliran sungai dan longkang, lalu menyebabkan banjir.'
  },
  {
    id: 3,
    question: 'Mengapakah bekalan air bersih sangat diperlukan oleh manusia setiap hari?',
    options: [
      'Untuk membakar sampah',
      'Untuk minum, memasak, mandi dan mencuci',
      'Untuk mengeringkan pakaian',
      'Hanya untuk mengisi kolam renang'
    ],
    correctIndex: 1,
    explanation: 'Air bersih adalah keperluan asas hidupan untuk kesihatan tubuh badan, penyediaan makanan bersih, dan kebersihan diri.'
  },
  {
    id: 4,
    question: 'Apakah kesan kekurangan air terhadap sektor pertanian dan tanaman?',
    options: [
      'Tumbuhan tumbuh lebih laju',
      'Tumbuhan layu dan hasil pertanian menurun',
      'Buah-buahan bertambah manis',
      'Pokok mengeluarkan lebih banyak daun'
    ],
    correctIndex: 1,
    explanation: 'Tumbuhan memerlukan air untuk membuat makanan (fotosintesis). Tanpa air mencukupi, tanaman layu dan pengeluaran makanan berkurangan.'
  },
  {
    id: 5,
    question: 'Apakah slogan penting yang dipaparkan pada akhir video untuk mengajak kita menjaga alam?',
    options: [
      'JAGA AIR, JAGA KEHIDUPAN!',
      'GUNA AIR SEBANYAK MUNGKIN!',
      'BIARKAN PILI AIR MENGALIR!',
      'BUANG SAMPAH KE SUNGAI!'
    ],
    correctIndex: 0,
    explanation: 'Slogan "JAGA AIR, JAGA KEHIDUPAN!" mengingatkan kita bahawa air adalah nadi kepada setiap hidupan di muka Bumi.'
  }
];
