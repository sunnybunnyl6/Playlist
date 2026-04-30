<script>
    const clientId = 'c95c5c7d6cc846f482286edc5cbd0510';
    const redirectUri = window.location.origin + window.location.pathname;

    // Check for Spotify token in URL
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    let accessToken = urlParams.get('access_token');

    function loginToSpotify() {
        const scope = 'streaming user-read-email user-read-private';
        const authUrl = `https://spotify.com{clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    }

   function extractYoutubePlaylistId(url) {
    // Looks for the 'list=' parameter in the URL
    const reg = /[&?]list=([a-zA-Z0-9_-]+)/i;
    const match = reg.exec(url);
    return (match && match[1]) ? match[1] : null;
}

function playMedia() {
    const val = document.getElementById('urlInput').value.trim();
    const area = document.getElementById('display-area');

    if (val.includes('list=')) { // Detects a YouTube Playlist
        const playlistId = extractYoutubePlaylistId(val);
        if (playlistId) {
            // Uses 'videoseries' path to embed the entire playlist
            area.innerHTML = `<iframe src="https://youtube-nocookie.com{playlistId}&autoplay=1&modestbranding=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            alert("Could not find a valid YouTube Playlist ID.");
        }
    } 
    else if (val.includes('://spotify.com')) { // Detects a Spotify Playlist
        // Transforms standard link to embed format: /playlist/ID -> /embed/playlist/ID
        const embedUrl = val.replace("open.://spotify.com", "://spotify.com");
        area.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
    }
    else {
        alert("Please paste a valid YouTube or Spotify PLAYLIST link.");
    }
}
