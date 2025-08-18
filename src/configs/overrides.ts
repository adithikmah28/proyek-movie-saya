// src/configs/overrides.ts

/**
 * Ini adalah "Buku Catatan" untuk link manual.
 * Setiap kali ada film yang rusak di VidFast, daftarkan di sini.
 *
 * Format:
 * "TMDB_ID_FILM": "URL_LENGKAP_DARI_ABYSS.TO"
 */
export const movieOverrides: Record<string, string> = {
  // Contoh untuk film Pocong (2006)
  '591415': 'https://short.icu/rdwCFKuwX',

  // Contoh lain, misal film Warkop DKI Reborn
  '396493': 'https://abyss.to/movie/396493',

  // Tambahkan film-film lainnya di sini nanti...
};
