import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import MovieService from '@/services/MovieService';
import { MediaType } from '@/types';

export const revalidate = 3600;

export default async function Page({ params }: { params: { slug: string } }) {
  // 1. Ambil ID dari URL (ini masih dalam bentuk string/teks)
  const idString = params.slug.split('-').pop();

  // 2. Pengaman jika ID tidak ditemukan di URL
  if (!idString) {
    return <div>Error: Movie ID not found in URL.</div>;
  }

  // 3. UBAH ID DARI TEKS MENJADI ANGKA (wajib untuk fungsi findMovie)
  const id = Number(idString);

  try {
    // 4. Panggil fungsi yang BENAR: 'findMovie' (bukan 'find')
    const response = await MovieService.findMovie(id);
    const imdbId = response.data.imdb_id;

    // 5. Cek lagi kalau IMDb ID-nya ada
    if (!imdbId) {
      return <div>Error: IMDb ID not found for this movie.</div>;
    }

    // 6. Buat URL VidFast dengan IMDb ID
    const vidfastUrl = `https://vidfast.pro/movie/${imdbId}`;

    // 7. Tampilkan player-nya
    return (
      <EmbedPlayer
        url={vidfastUrl}
        movieId={idString}
        mediaType={MediaType.MOVIE}
      />
    );
  } catch (error) {
    console.error('Failed to fetch movie details with findMovie:', error);
    return <div>Error loading movie. Please try again later.</div>;
  }
}
