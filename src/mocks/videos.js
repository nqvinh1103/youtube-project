export function getMockVideos() {
  const videoIds = [
    "rAwjNLLTadk",
    "dQw4w9WgXcQ",
    "M7lc1UVf-VE",
    "9bZkp7q19f0",
    "W1R6QHURgfs",
    "l482T0yNkeo",
    "5n0mSDAZr1w",
    "ktvTqknDobU",
    "fRh_vgS2dFE",
    "RgKAFK5djSk",
    "60ItHLz5WEA",
    "hT_nvWreIhg",
    "kJQP7kiw5Fk",
    "YQHsXMglC9A",
    "pRpeEdMmmQ0",
    "e-ORhEE9VVg",
    "OPf0YbXqDm0",
    "09R8_2nJtjg",
    "CevxZvSJLk8",
    "hLQl3WQQoQ0",
    "uelHwf8o7_U",
    "iS1g8G_njx8",
    "oRdxUFDoQe0",
    "6Ejga4kJUts",
    "kOkQ4T5WO9E",
    "JGwWNGJdvx8",
    "09R8_2nJtjg",
    "RgKAFK5djSk",
    "CevxZvSJLk8",
    "ktvTqknDobU",
    "pRpeEdMmmQ0",
    "e-ORhEE9VVg",
    "OPf0YbXqDm0",
    "kJQP7kiw5Fk",
    "YQHsXMglC9A",
    "rAwjNLLTadk",
    "dQw4w9WgXcQ",
    "M7lc1UVf-VE",
    "9bZkp7q19f0",
    "3JZ_D3ELwOQ",
    "l482T0yNkeo",
    "2Vv-BfVoq4g",
    "ktvTqknDobU",
    "fRh_vgS2dFE",
    "RgKAFK5djSk",
    "60ItHLz5WEA",
    "hT_nvWreIhg",
    "kJQP7kiw5Fk",
    "YQHsXMglC9A",
    "pRpeEdMmmQ0",
  ];

  const videos = Array.from({ length: 50 }, (_, i) => {
    const id = videoIds[i % videoIds.length];
    const mins = ((i % 15) + 1).toString().padStart(2, "0");
    const secs = ((i * 7) % 60).toString().padStart(2, "0");

    const video = {
      thumbnailPic: `https://i.ytimg.com/vi/${id}/hq720.jpg`,
      thumbnailTime: `${mins}:${secs}`,
      profilePic: `https://i.pravatar.cc/68?img=${(i % 70) + 1}`,
      videoTitle: `Video Title ${i + 1}`,
      channelName: `Channel ${i + 1}`,
    };

    return {
      id,
      ...video,
      title: video.videoTitle,
      views: `${(200 + i * 31).toLocaleString()} lượt xem`,
      publishedAt: `${(i % 8) + 1} tuần trước`,
      description: "Heloooooooooooooooooooooooooooooooooooo",
      avatarUrl: video.profilePic,
      thumbnailUrl: video.thumbnailPic,
      duration: video.thumbnailTime,
    };
  });

  return videos;
}
