const repoURL = 'https://api.github.com/repos/gitporn69/instaserver/contents/'; // Replace with your GitHub repo details

async function fetchMedia() {
    try {
        const response = await fetch(repoURL);
        const data = await response.json();

        const videoGalleryContent = document.querySelector(".video-gallery .contents");
        const imageGalleryContent = document.querySelector(".image-gallery .contents");

        data.forEach(file => {
            if (file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.heic')) {
                // Create and append an image element
                const imagecard = document.createElement("div");
                imagecard.setAttribute("class", "image-card");
                imageGalleryContent.appendChild(imagecard);

                const img = document.createElement('img');
                const a = document.createElement('a');
                a.href = file.download_url;
                img.src = file.download_url;
                img.alt = file.name;
                imagecard.appendChild(a);
                a.appendChild(img);
            } else if (file.name.endsWith('.mp4')) {
                // Create and append a video element
                const videocard = document.createElement("div");
                videocard.setAttribute("class", "video-card");
                videoGalleryContent.appendChild(videocard);

                const video = document.createElement('video');
                video.setAttribute("class", "video-player");
                video.controls = true;
                video.src = file.download_url;
                videocard.appendChild(video);


            }
        });

        // Get all video elements on the page
        const videos = document.querySelectorAll('.video-player');

        // Iterate over each video element
        videos.forEach(video => {
            video.addEventListener('play', () => {
                // Pause all other videos when one is played
                videos.forEach(v => {
                    if (v !== video) {
                        v.pause();
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error fetching media:', error);
    }
}

fetchMedia();
