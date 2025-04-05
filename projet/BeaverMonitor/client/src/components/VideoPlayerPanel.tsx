
import { useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause } from "lucide-react";

interface VideoSource {
  title: string;
  src: string;
  type: string;
}

export default function VideoPlayerPanel() {
  const [playing, setPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const videoSources: VideoSource[] = [
    { title: "Video 1", src: "https://www.youtube.com/watch?v=lUTAH97Q0P8", type: "video" },
    { title: "Video 2", src: "https://www.youtube.com/watch?v=JmsRbyCahbo", type: "video" },
    { title: "Video 3", src: "https://www.youtube.com/watch?v=9TXMW8C46Es", type: "video" },
    { title: "Video 4", src: "https://www.youtube.com/watch?v=dY6MckzSCIc", type: "video" },
  ];

  const handleError = (error: any) => {
    console.error("Video error:", error);
    setPlaying(false);
    setError("Video failed to load. Please try again.");
  };

  const handleEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoSources.length);
  };

  const togglePlay = () => {
    setError(null);
    setPlaying(!playing);
  };

  return (
    <div className="bg-[#1e1e1e] w-full h-full rounded-lg overflow-hidden border border-[#333333] relative">
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-red-500/80 text-white p-2 rounded-md">
          {error}
        </div>
      )}

      <div className="relative h-full w-full">
        <ReactPlayer
          url={videoSources[currentVideoIndex].src}
          playing={playing}
          volume={0.2}
          width="590px"
          height="390px"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            objectPosition: "center center",
          }}
          config={{
            file: {
              forceVideo: true,
              attributes: {
                controlsList: "nodownload",
                crossOrigin: "anonymous",
              },
            },
            youtube: {
              playerVars: {
                modestbranding: 1,
                showinfo: 0,
                rel: 0,
              },
            },
          }}
          onError={handleError}
          onEnded={handleEnded}
          controls={false}
          playsinline
          loop={false}
        />

        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!playing && (
            <div className="bg-primary/80 rounded-full p-3 opacity-80 hover:opacity-100 transition-opacity">
              <Play className="w-6 h-6 text-white" />
            </div>
          )}
          {playing && (
            <div className="bg-primary/80 rounded-full p-3 opacity-0 hover:opacity-100 transition-opacity">
              <Pause className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
