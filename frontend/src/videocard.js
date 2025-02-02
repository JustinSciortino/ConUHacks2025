export default function VideoCard({ videoInfo }) {
    // If there's no data, don't render anything.
    if (!videoInfo) return null;
  
    return (
      <div className="max-w-2xl mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
        <div className="flex gap-4 items-center">
          <img
            src={videoInfo.thumbnail_url}
            alt="Thumbnail"
            className="w-40 h-24 object-cover"
          />
          <div>
            <h2 className="font-bold text-lg">{videoInfo.video_title}</h2>
            <div className="flex items-center gap-2">
              <img
                src={videoInfo.channel_profile_image}
                alt="Channel"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-gray-600">{videoInfo.channel_name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }