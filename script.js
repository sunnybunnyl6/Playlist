const clientId = 'c95c5c7d6cc846f482286edc5cbd0510';
const redirectUri = window.location.origin + window.location.pathname; // Automatically detects your GitHub URL

// 1. Check if we just returned from Spotify login
const urlParams = new URLSearchParams(window.location.hash.substring(1));
let accessToken = urlParams.get('access_token');

function loginToSpotify() {
    const scope = 'streaming user-read-email user-read-private';
    const authUrl = `https://spotify.com{clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
}

function playMedia() {
    const val = document.getElementById('urlInput').value;
    const area = document.getElementById('display-area');

    if (val.includes('spotify.com')) {
        if (!accessToken) {
            if (confirm("Spotify requires login to play. Login now?")) {
                loginToSpotify();
            }
            return;
        }
        // Convert link to embed format
        const embedUrl = val.replace("://spotify.com", "://spotify.com/embed");
        area.innerHTML = `<iframe src="${embedUrl}" allow="encrypted-media"></iframe>`;
    } 
    else if (val.includes('youtube.com') || val.includes('youtu.be')) {
        const id = extractYoutubeId(val);
        area.innerHTML = `<iframe src="https://youtube-nocookie.com{id}?autoplay=1&modestbranding=1" allow="autoplay"></iframe>`;
    }
}

function extractYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
