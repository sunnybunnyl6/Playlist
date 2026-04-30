// 1. CONFIGURATION
const clientId = 'c95c5c7d6cc846f482286edc5cbd0510';
const redirectUri = window.location.origin + window.location.pathname;

// 2. CHECK FOR SPOTIFY AUTH TOKEN
const urlParams = new URLSearchParams(window.location.hash.substring(1));
let accessToken = urlParams.get('access_token');

// 3. LOGIN FUNCTION
function loginToSpotify() {
    const scope = 'streaming user-read-email user-read-private';
    const authUrl = `https://spotify.com{clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
}

// 4. MAIN PLAYBACK LOGIC
function playMedia() {
    const val = document.getElementById('urlInput').value.trim();
    const area = document.getElementById('display-area');

    if (!val) return;

    if (val.includes('list=')) {
        // This helper finds the playlist ID safely
        const urlParams = new URLSearchParams(val.split('?')[1]);
        const playlistId = urlParams.get('list');
        
        if (playlistId) {
            // CRITICAL: Notice the `backticks` and the ${} syntax
            area.innerHTML = `<iframe src="https://youtube-nocookie.com{playlistId}&autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        }
    } 
    else if (val.includes('://spotify.com')) {
        const embedUrl = val.replace("open.://spotify.com", "://spotify.com");
        area.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
    }
}


    // --- YOUTUBE PLAYLIST LOGIC ---
    if (val.includes('list=')) {
        // This line pulls the ID out of the URL correctly
        const urlObj = new URL(val);
        const playlistId = urlObj.searchParams.get('list');
        
        if (playlistId) {
            // FIXED: Using backticks (`) and ${} ensures the ID is placed correctly in the URL
            area.innerHTML = `<iframe src="https://youtube-nocookie.com{playlistId}&autoplay=1&modestbranding=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            alert("Could not find the 'list=' ID in that YouTube link.");
        }
    } 

    // --- SPOTIFY PLAYLIST LOGIC ---
    else if (val.includes('://spotify.com')) {
        if (!accessToken) {
            if (confirm("Connect Spotify to play full playlists?")) {
                loginToSpotify();
                return;
            }
        }
        const embedUrl = val.replace("open.://spotify.com", "://spotify.com");
        area.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allow="autoplay; encrypted-media; fullscreen"></iframe>`;
    }

    else {
        alert("Please paste a valid YouTube or Spotify PLAYLIST link.");
    }
}
