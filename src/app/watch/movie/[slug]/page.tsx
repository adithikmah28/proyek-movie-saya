import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import MovieService from '@/services/MovieService';
import { MediaType } from '@/types';
import { movieOverrides } from '@/configs/overrides'; // <-- 1. Kita panggil "Buku Catatan"

export const revalidate = 3600;

export default async function Page({ params }: { params: { slug: string } }) {
  const idString = params.slug.split('-').pop();

  if (!idString) {
    return <div>Error: Movie ID not found in URL.</div>;
  }

  // --- LOGIKA PRIORITAS DIMULAI DI SINI ---

  // 2. Cek apakah ID film ini ada di dalam "Buku Catatan" kita?
  if (movieOverrides[idString]) {
    // JIKA ADA:
    console.log(
      `[OVERRIDE] ID ${idString} ditemukan di catatan. Menggunakan link Abyss.to.`,
    );
    const manualUrl = movieOverrides[idString];

    // Langsung tampilkan player dengan link dari Abyss.to dan berhenti.
    return (
      <EmbedPlayer
        url={manualUrl}
        movieId={idString}
        mediaType={MediaType.MOVIE}
      />
    );
  }

  // 3. JIKA TIDAK ADA di catatan, baru jalankan logika VidFast seperti biasa.
  console.log(
    `[DEFAULT] ID ${idString} tidak ada di catatan. Mencoba VidFast...`,
  );
  const id = Number(idString);
  try {
    const response = await MovieService.findMovie(id);
    const imdbId = response.data.imdb_id;

    if (!imdbId) {
      return <div>Error: IMDb ID not found for this movie.</div>;
    }

    const vidfastUrl = `https://vidfast.pro/movie/${imdbId}`;
    return (
      <EmbedPlayer
        url={vidfastUrl}
        movieId={idString}
        mediaType={MediaType.MOVIE}
      />
    );
  } catch (error) {
    console.error('Failed to fetch movie details for VidFast:', error);
    return <div>Error loading movie from VidFast.</div>;
  }
}
