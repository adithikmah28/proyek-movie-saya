import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import { MediaType } from '@/types';

export const revalidate = 3600;

export default function Page({ params }: { params: { slug: string } }) {
  // 1. Mengambil ID dari URL, contoh: 'the-flash-12345' -> '12345'
  const id = params.slug.split('-').pop()!;

  // 2. Memanggil komponen player
  // - 'url' kita kosongkan, karena nanti player yang akan membuatnya
  // - 'movieId' kita isi dengan ID serial TV-nya
  // - 'mediaType' kita kasih tau kalau ini adalah serial TV
  return <EmbedPlayer url="" movieId={id} mediaType={MediaType.TV} />;
}
