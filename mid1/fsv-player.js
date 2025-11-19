document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lazy-player").forEach(wrapper => {
    wrapper.addEventListener("click", async () => {
      // جلوگیری از لود دوباره
      if (wrapper.classList.contains("loaded")) return;
      wrapper.classList.add("loaded");

      const videoName = wrapper.dataset.videoName;
      const videoId = wrapper.dataset.videoId;
      const aparatCode = wrapper.dataset.aparatCode;

      wrapper.innerHTML = "<div style='padding:20px;text-align:center;color:#fff;'>در حال آماده‌سازی ویدیو...</div>";

      try {
        if (videoName && videoId) {
          // 🔹 OvenPlayer
          const formData = new FormData();
          formData.append("action", "get_oven_token");
          formData.append("video_name", videoName);
          formData.append("video_id", videoId);

          const res = await fetch(fsv_ajax.url, { method: "POST", body: formData });
          const data = await res.json();

          if (!data.success) throw new Error("Token failed");

          const token = data.data; // رشته توکن
          wrapper.innerHTML = `<div id="${wrapper.id}_player" style="width:100%;"></div>`;

          OvenPlayer.create(`${wrapper.id}_player`, {
            sources: [
              { label: "1080p", type: "hls", file: `https://stream.tamland.ir/done/${videoName}/1080_${videoName}_1.m3u8?auth=${token}` },
              { label: "720p", type: "hls", file: `https://stream.tamland.ir/done/${videoName}/720_${videoName}_1.m3u8?auth=${token}` },
              { label: "480p", type: "hls", file: `https://stream.tamland.ir/done/${videoName}/480_${videoName}_1.m3u8?auth=${token}` },
              { label: "360p", type: "hls", file: `https://stream.tamland.ir/done/${videoName}/360_${videoName}_1.m3u8?auth=${token}` }
            ],
            autoStart: true,
            mute: false
          });

        } else if (aparatCode) {
          // 🔹 iframe آپارات
          wrapper.innerHTML = `
            <div class="iframe-player" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:800px;margin:auto;">
              <iframe src="https://www.aparat.com/video/video/embed/videohash/${aparatCode}/vt/frame"
                      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
                      frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        } else {
          wrapper.innerHTML = "<p style='text-align:center;color:#fff;'>ویدیو موجود نیست</p>";
        }

      } catch (err) {
        wrapper.classList.remove("loaded"); // در صورت خطا اجازه کلیک مجدد بده
        wrapper.innerHTML = "<p style='color:#fff;text-align:center;'>خطا در دریافت ویدیو</p>";
        console.error(err);
      }
    });
  });
});
