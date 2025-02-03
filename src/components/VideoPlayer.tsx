import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  videoKey: string;
  light?: boolean;
}

export default function VideoPlayer({ videoKey, light = false }: VideoPlayerProps) {
  return (
    <div className="aspect-video w-full flex justify-center mt-8">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoKey}`}
        width="80%"
        height="80%"
        controls
        light={light}
        playing={!light}
      />
    </div>
  );
}