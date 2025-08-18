import React from 'react';
import ShowsContainer from '@/components/shows-container'; // <-- Kita pakai komponen utama
import { adultContentCategories } from '@/configs/adult-content'; // <-- Kita panggil kategori manual kita
import { siteConfig } from '@/configs/site';

export const revalidate = 3600;

export default function AdultPage() {
  // Ambil data kategori yang sudah kita buat
  const allShows = adultContentCategories;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Judul utama halaman */}
      <h1 className="mb-8 text-3xl font-bold">
        {siteConfig.name} - Adult Collection
      </h1>
      
      {/* Tampilkan semua kategori dan filmnya dengan komponen ShowsContainer */}
      <ShowsContainer shows={allShows} />
    </div>
  );
}
