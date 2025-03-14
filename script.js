const repoURLs = [
    'https://api.github.com/repos/tempgit6969/123-server-1/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-2/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-3/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-4/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-5/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-6/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-7/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-8/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-9/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-10/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-11/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-12/contents/',
    'https://api.github.com/repos/tempgit6969/123-server-13/contents/'
];

async function fetchMedia() {
    try {
        const responses = await Promise.all(
            repoURLs.map(async url => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(response.statusText);
                    return await response.json();
                } catch (error) {
                    console.error(`Error fetching ${url}:`, error);
                    return null; // Return null for failed requests
                }
            })
        );

        const allData = responses.filter(data => data !== null).flat();

        const videoGalleryContent = document.querySelector(".video-gallery .contents");
        const imageGalleryContent = document.querySelector(".image-gallery .contents");

        const videoFiles = allData
            .filter(file => file.name.endsWith('.mp4'))
            .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

        const imageFiles = allData
            .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.heic'))
            .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

        videoFiles.forEach(file => {
            const shareButton = shareButtonFunction(file);
            const videocard = document.createElement("div");
            videocard.setAttribute("class", "video-card");
            videoGalleryContent.appendChild(videocard);

            const video = document.createElement('video');
            video.setAttribute("class", "video-player");
            video.controls = true;
            video.preload = "metadata"; // Only loads metadata initially
            video.src = file.download_url;

            videocard.appendChild(video);
            videocard.appendChild(shareButton);

            video.addEventListener('play', () => {
                if (!video.getAttribute("data-loaded")) {
                    video.setAttribute("data-loaded", "true");
                    video.src = file.download_url; // Load full video when played
                }
            });
        });

        imageFiles.forEach(file => {
            const shareButton = shareButtonFunction(file);
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
            imagecard.appendChild(shareButton);
        });

        const videos = document.querySelectorAll('.video-player');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                videos.forEach(v => {
                    if (v !== video) v.pause();
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error fetching media:', error);
    }
}

fetchMedia();

function shareButtonFunction(file) {
    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share Link';

    shareButton.onclick = async () => {
        var urlInfo = extractGitHubInfo(file.download_url);
        const link = `https://${urlInfo.username}.github.io/${urlInfo.repo}/${file.name}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check this out!',
                    text: 'Here is a link for you from ১ ২ ৩:',
                    url: link
                });
                console.log('Shared successfully');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(link);
            alert('Sharing not supported, link copied to clipboard!');
        }
    };
    return shareButton;
}

function extractGitHubInfo(url) {
    const match = url.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
        const username = match[1];
        const repo = match[2];
        return { username, repo };
    }
    return null;
}
