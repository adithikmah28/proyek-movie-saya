import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';

export const revalidate = 3600;

export default function Page({ params }: { params: { slug: string } }) {
  // Mengambil ID dari slug URL, contoh: 'fast-x-12345' -> '12345'
  const id = params.slug.split('-').pop();

  // Membuat URL VidFast untuk MOVIE
  const vidfastUrl = `https://vidfast.pro/movie/${id}`;

  // Mengirim URL yang sudah jadi ke komponen player
  return <EmbedPlayer url={vidfastUrl} />;
}
