'use client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getMobileDetect,
  getYear,
  getNameFromShow,
  getSlug,
} from '@/lib/utils';
import MovieService from '@/services/MovieService';
import { useModalStore } from '@/stores/modal';
import {
  type KeyWord,
  MediaType,
  type Genre,
  type ShowWithGenreAndVideo,
  type VideoResult,
} from '@/types';
import * as React from 'react';
import Youtube from 'react-youtube';
import CustomImage from './custom-image';
import { useRouter } from 'next/navigation';

type YouTubePlayer = {
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  seekTo: (value: number) => void;
  container: HTMLDivElement;
  internalPlayer: YouTubePlayer;
};
type YouTubeEvent = { target: YouTubePlayer };

const userAgent =
  typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
const { isMobile } = getMobileDetect(userAgent);
const defaultOptions: Record<string, object> = {
  playerVars: {
    rel: 0,
    mute: isMobile() ? 1 : 0,
    loop: 1,
    autoplay: 1,
    controls: 0,
    showinfo: 0,
    disablekb: 1,
    enablejsapi: 1,
    playsinline: 1,
    cc_load_policy: 0,
    modestbranding: 3,
  },
};

const ShowModal = () => {
  const modalStore = useModalStore();
  const router = useRouter();
  const IS_MOBILE: boolean = isMobile();

  const [trailer, setTrailer] = React.useState('');
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [isAnime, setIsAnime] = React.useState<boolean>(false);
  const [isMuted, setIsMuted] = React.useState<boolean>(
    modalStore.firstLoad || IS_MOBILE,
  );

  const youtubeRef = React.useRef(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    setIsAnime(false);

    const handleGetData = async () => {
      if (!modalStore.show) return;
      const { id, media_type } = modalStore.show;
      const type = media_type === MediaType.TV ? 'tv' : 'movie';

      const data = await MovieService.findMovieByIdAndType(id, type);
      const keywords: KeyWord[] =
        data?.keywords?.results || data?.keywords?.keywords || [];

      if (keywords.length) {
        setIsAnime(!!keywords.find((k: KeyWord) => k.name === 'anime'));
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
      if (data.videos?.results?.length) {
        const result = data.videos.results.find(
          (item: VideoResult) => item.type === 'Trailer',
        );
        if (result?.key) setTrailer(result.key);
      }
    };

    if (modalStore.open) {
      void handleGetData();
    }
  }, [modalStore.open, modalStore.show]);

  const handleCloseModal = () => {
    modalStore.reset();
    if (!modalStore.show || modalStore.firstLoad) {
      window.history.pushState(null, '', '/home');
    } else {
      window.history.back();
    }
  };

  const handlePlayWithAdFromModal = () => {
    if (!modalStore.show) return;

    const adsterraDirectLink = 'https://LINK_DIRECTLINK_ADSTERRA_LO'; // <-- GANTI INI

    const { show } = modalStore;
    let targetWatchUrl = '#';
    const type = isAnime
      ? 'anime'
      : show.media_type === MediaType.MOVIE
      ? 'movie'
      : 'tv';
    let id_segment = `${show.id}`;

    if (isAnime) {
      const prefix = show.media_type === MediaType.MOVIE ? 'm' : 't';
      id_segment = `${prefix}-${id_segment}`;
    }

    targetWatchUrl = `/watch/${type}/${id_segment}`;

    window.open(adsterraDirectLink, '_blank');
    router.push(targetWatchUrl);
  };

  const onEnd = (event: YouTubeEvent) => event.target.seekTo(0);
  const onPlay = () => {
    if (imageRef.current) imageRef.current.style.opacity = '0';
  };
  const onReady = (event: YouTubeEvent) => event.target.playVideo();
  const handleChangeMute = () => {
    const videoRef = youtubeRef.current as YouTubePlayer | null;
    if (!videoRef) return;
    isMuted ? videoRef.internalPlayer.unMute() : videoRef.internalPlayer.mute();
    setIsMuted(!isMuted);
  };

  if (!modalStore.open || !modalStore.show) return null;

  return (
    <Dialog open={modalStore.open} onOpenChange={handleCloseModal}>
      <DialogContent className="w-full overflow-hidden rounded-md bg-zinc-900 p-0 text-left align-middle shadow-xl dark:bg-zinc-900 sm:max-w-3xl lg:max-w-4xl">
        <div className="video-wrapper relative aspect-video">
          <CustomImage
            fill
            priority
            ref={imageRef}
            alt={modalStore.show.title ?? 'poster'}
            className="-z-40 z-[1] h-auto w-full object-cover"
            src={`https://image.tmdb.org/t/p/original${
              modalStore.show.backdrop_path ?? modalStore.show.poster_path
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw, 33vw"
          />
          {trailer && (
            <Youtube
              opts={{
                ...defaultOptions,
                playerVars: {
                  ...defaultOptions.playerVars,
                  mute: isMuted ? 1 : 0,
                },
              }}
              onEnd={onEnd}
              onPlay={onPlay}
              ref={youtubeRef}
              onReady={onReady}
              videoId={trailer}
              id="video-trailer"
              title={
                modalStore.show.title ?? modalStore.show.name ?? 'video-trailer'
              }
              className="relative aspect-video w-full"
              style={{ width: '100%', height: '100%' }}
            />
          )}
          <div className="absolute bottom-6 z-20 flex w-full items-center justify-between gap-2 px-10">
            <div className="flex items-center gap-2.5">
              <Button
                aria-label="Play show"
                className="group h-auto rounded py-1.5"
                onClick={handlePlayWithAdFromModal}>
                <Icons.play
                  className="mr-1.5 h-6 w-6 fill-current"
                  aria-hidden="true"
                />
                Play
              </Button>
            </div>
            <Button
              aria-label={`${isMuted ? 'Unmute' : 'Mute'} video`}
              variant="ghost"
              className="h-auto rounded-full bg-neutral-800 p-1.5 opacity-50 ring-1 ring-slate-400 hover:bg-neutral-800 hover:opacity-100 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
              onClick={handleChangeMute}>
              {isMuted ? (
                <Icons.volumeMute className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Icons.volume className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-2.5 px-10 pb-10">
          <DialogTitle className="text-lg font-medium leading-6 text-slate-50 sm:text-xl">
            {modalStore.show.title ?? modalStore.show.name}
          </DialogTitle>
          <div className="flex items-center space-x-2 text-sm sm:text-base">
            <p className="font-semibold text-green-400">
              {Math.round((Number(modalStore.show.vote_average) / 10) * 100) ??
                '-'}
              % Match
            </p>
            <p>
              {getYear(
                modalStore.show.release_date ??
                  modalStore.show.first_air_date ??
                  '',
              )}
            </p>
            {modalStore.show.original_language && (
              <span className="grid h-4 w-7 place-items-center text-xs font-bold text-neutral-400 ring-1 ring-neutral-400">
                {modalStore.show.original_language.toUpperCase()}
              </span>
            )}
          </div>
          <DialogDescription className="line-clamp-3 text-xs text-slate-50 dark:text-slate-50 sm:text-sm">
            {modalStore.show.overview ?? '-'}
          </DialogDescription>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-400">Genres:</span>
            {genres.map((genre) => genre.name).join(', ')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowModal;
