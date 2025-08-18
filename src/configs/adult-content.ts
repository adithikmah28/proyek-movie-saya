// src/configs/adult-content.ts
import { MediaType, type Show, type CategorizedShows } from '@/types';

// --- TEMPAT LO MENDAFTARKAN SEMUA FILM ---
// Cukup daftar sekali di sini, nanti di bawah tinggal panggil ID-nya.
const allAdultMovies: Record<string, Show> = {
  // Love (2015)
  "315011": {
    id: 315011,
    title: 'Love',
    name: 'Love',
    overview: 'Murphy is an American living in Paris who enters a highly sexually and emotionally charged relationship with the unstable Electra...',
    poster_path: '/u6n8itbnTGaSN5h4P1G2A3IeP9g.jpg',
    backdrop_path: '/j4B1GfV6b252iXl9YJz4aCFD3Pi.jpg',
    vote_average: 6.1,
    release_date: '2015-11-05',
    media_type: MediaType.MOVIE,
  },
  // Selina's Gold (2022)
  "1022138": {
    id: 1022138,
    title: 'Selina\'s Gold',
    name: 'Selina\'s Gold',
    overview: 'To pay off her father\'s debt, Selina is forced to work for a ruthless man named Tiago...',
    poster_path: '/eFk62pd23b6hJ419a52FOnb5yD9.jpg',
    backdrop_path: '/xVEsBhm35ZF1k7m1534p366m543.jpg',
    vote_average: 6.9,
    release_date: '2022-09-16',
    media_type: MediaType.MOVIE,
  },
  // --- TAMBAHKAN SEMUA FILM LAINNYA DI SINI ---
};

// --- TEMPAT LO MEMBUAT KATEGORI ---
// Di sini lo bisa bikin kategori dan pilih film mana saja yang masuk.
export const adultContentCategories: CategorizedShows[] = [
  {
    title: "Western Erotic Selection",
    visible: true,
    shows: [
      allAdultMovies["315011"], // <-- Panggil film 'Love'
      // Panggil film lain dengan ID-nya...
    ].filter(Boolean) // .filter(Boolean) untuk jaga-jaga kalau ada ID yang salah
  },
  {
    title: "Asian Semi Collection",
    visible: true,
    shows: [
      allAdultMovies["1022138"], // <-- Panggil film 'Selina's Gold'
    ].filter(Boolean)
  },
  // --- BIKIN KATEGORI BARU DI SINI ---
];
