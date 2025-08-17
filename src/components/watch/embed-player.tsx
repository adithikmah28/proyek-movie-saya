'use client';
import React from 'react';
import Loading from '../ui/loading';
import { useRouter } from 'next/navigation';
import { MediaType, type IEpisode, type ISeason, type Show } from '@/types';
import MovieService from '@/services/MovieService';
import { type AxiosResponse } from 'axios';
import Season from '../season';

interface EmbedPlayerProps {
  url: string; // url ini sekarang HANYA untuk Movie
  movieId?: string;
  mediaType?: MediaType;
}

function EmbedPlayer(props: EmbedPlayerProps) {
  const router = useRouter();
  const [seasons, setSeasons] = React.useState<ISeason[] | null>(null);
  const loadingRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Effect ini HANYA untuk MOVIE
  React.useEffect(() => {
    if (props.mediaType === MediaType.MOVIE && iframeRef.current) {
      iframeRef.current.src = props.url;
      const { current } = iframeRef;
      const iframe: HTMLIFrameElement | null = current;
      iframe?.addEventListener('load', handleIframeLoaded);
      return () => {
        iframe?.removeEventListener('load', handleIframeLoaded);
      };
    }
  }, [props.mediaType, props.url]);

  // Effect ini sekarang untuk ANIME dan TV SERIES
  React.useEffect(() => {
    if (
      !props.movieId ||
      (props.mediaType !== MediaType.ANIME && props.mediaType !== MediaType.TV)
    ) {
      return;
    }
    void handleShow(props.movieId, props.mediaType);
  }, [props.movieId, props.mediaType]);

  // --- INI FUNGSI BARU, KHUSUS UNTUK GANTI EPISODE TV SERIES ---
  const handleChangeTVEpisode = (episode: IEpisode): void => {
    const tvId = props.movieId?.replace('t-', ''); // Ambil ID dari props
    const seasonNumber = episode.season_number;
    const episodeNumber = episode.episode_number;

    // Membuat URL VidFast yang lengkap untuk TV
    const vidfastUrl = `https://vidfast.pro/tv/${tvId}/${seasonNumber}/${episodeNumber}`;
    handleSetIframeUrl(vidfastUrl);
  };

  // Fungsi lama kita ganti nama jadi khusus untuk ANIME
  const handleChangeAnimeEpisode = (episode: IEpisode): void => {
    const { show_id: id, episode_number: eps } = episode;
    handleSetIframeUrl(`https://vidsrc.cc/v2/embed/anime/tmdb${id}/${eps}/sub`);
  };

  // Fungsi ini kita ubah namanya jadi handleShow, dan sekarang bisa untuk ANIME & TV
  const handleShow = async (movieId: string, mediaType: MediaType) => {
    const id = Number(movieId.replace('t-', ''));
    const response: AxiosResponse<Show> = await MovieService.findTvSeries(id);
    const { data } = response;
    if (!data?.seasons?.length) return;

    const seasons = data.seasons.filter((s) => s.season_number);
    const promises = seasons.map((s) =>
      MovieService.getSeasons(id, s.season_number),
    );

    const seasonWithEpisodes = await Promise.all(promises);
    setSeasons(seasonWithEpisodes.map((res) => res.data));

    // MEMBUAT URL AWAL (saat player pertama kali loading)
    if (mediaType === MediaType.ANIME) {
      handleSetIframeUrl(
        `https://vidsrc.cc/v2/embed/anime/tmdb${id}/1/sub?autoPlay=false`,
      );
    } else if (mediaType === MediaType.TV) {
      // Untuk TV, kita buat URL VidFast untuk episode pertama (S1, E1)
      handleSetIframeUrl(`https://vidfast.pro/tv/${id}/1/1`);
    }
  };

  const handleSetIframeUrl = (url: string): void => {
    if (!iframeRef.current) return;
    iframeRef.current.src = url;
    const { current } = iframeRef;
    const iframe: HTMLIFrameElement | null = current;
    iframe.addEventListener('load', handleIframeLoaded);
    if (loadingRef.current) loadingRef.current.style.display = 'flex';
  };

  const handleIframeLoaded = () => {
    if (!iframeRef.current) return;
    const iframe: HTMLIFrameElement = iframeRef.current;
    if (iframe) {
      iframe.style.opacity = '1';
      iframe.removeEventListener('load', handleIframeLoaded);
      if (loadingRef.current) loadingRef.current.style.display = 'none';
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: '#000',
      }}>
      {seasons && (
        <Season
          seasons={seasons ?? []}
          // --- INI BAGIAN PALING PENTING ---
          // Kita kasih fungsi yang tepat berdasarkan tipe media
          onChangeEpisode={
            props.mediaType === MediaType.ANIME
              ? handleChangeAnimeEpisode
              : handleChangeTVEpisode
          }
        />
      )}
      {/* Sisa kode di bawah sini tidak berubah... */}
      <div className="header-top absolute left-0 right-0 top-8 z-[2] flex h-fit w-fit items-center justify-between gap-x-5 px-4 md:h-20 md:gap-x-8 md:px-10 lg:h-24">
        <div className="flex flex-1 items-center gap-x-5 md:gap-x-8">
          <svg
            className="h-10 w-10 flex-shrink-0 cursor-pointer transition hover:scale-125"
            stroke="#fff"
            fill="#fff"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="16px"
            width="16px"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => router.back()}>
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
          </svg>
        </div>
      </div>
      <div
        ref={loadingRef}
        className="absolute z-[1] flex h-full w-full items-center justify-center">
        <Loading />
      </div>
      <iframe
        width="100%"
        height="100%"
        allowFullScreen
        ref={iframeRef}
        style={{ opacity: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default EmbedPlayer;
