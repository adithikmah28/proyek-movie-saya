// src/configs/adult-content.ts
import { MediaType, type Show, type CategorizedShows } from '@/types';

// Kita definisikan tipe baru untuk konten custom kita
interface CustomContent extends Partial<Show> {
  id: string | number; // ID bisa berupa angka (TMDB) atau string (kode custom)
  isCustom: true; // Penanda bahwa ini konten manual
  embedUrl: string; // URL embed langsung untuk video-nya
  title: string;
  poster_path: string;
  media_type: MediaType.MOVIE; // Anggap semua sebagai movie
}

// Tipe gabungan untuk mendukung kedua jenis konten
type AdultShow = Show | CustomContent;

// --- TEMPAT LO MENDAFTARKAN SEMUA KONTEN ---
const allAdultContent: Record<string, AdultShow> = {
  // --- KONTEN BIASA (DARI TMDB) ---
  "315011": {
    id: 315011,
    title: 'Love',
    name: 'Love',
    overview: 'Murphy is an American living in Paris...',
    poster_path: '/u6n8itbnTGaSN5h4P1G2A3IeP9g.jpg',
    media_type: MediaType.MOVIE,
  },

  // --- KONTEN CUSTOM (JAPAN TUBE) ---
  "jav001": {
    id: "jav001", // ID custom berupa string
    isCustom: true,
    embedUrl: "https://situs-embed.com/video/KODE_VIDEO_JEPANG_1", // <-- GANTI DENGAN URL EMBED ASLI
    title: "Judul Video Keren Part 1",
    poster_path: "/link-ke-poster-mu.jpg", // <-- Poster bisa dari mana saja (misal: imgur)
    media_type: MediaType.MOVIE,
  },
  "jav002": {
    id: "jav002",
    isCustom: true,
    embedUrl: "https://situs-embed.com/video/KODE_VIDEO_JEPANG_2",
    title: "Judul Video Keren Part 2",
    poster_path: "/link-ke-poster-lain.jpg",
    media_type: MediaType.MOVIE,
  },
};

// --- TEMPAT LO MEMBUAT KATEGORI ---
export const adultContentCategories: CategorizedShows[] = [
  {
    title: "Erotic Movies",
    visible: true,
    shows: [
      allAdultContent["315011"], // Panggil film 'Love'
    ].filter(Boolean) as Show[]
  },
  {
    title: "Japan Tube Collection",
    visible: true,
    shows: [
      allAdultContent["jav001"], // Panggil video custom pertama
      allAdultContent["jav002"], // Panggil video custom kedua
    ].filter(Boolean) as Show[]
  },
];
