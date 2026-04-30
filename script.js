// 1. CONFIGURATION
const clientId = 'c95c5c7d6cc846f482286edc5cbd0510';
// Automatically sets the redirect to your current URL (GitHub Pages or Localhost)
const redirectUri = window.location.origin + window.location.pathname;

// 2. CHECK FOR SPOTIFY AUTH TOKEN
// This looks at the URL for #access_token=... after you log in
const urlParams = new URLSearchParams(window.location.hash.substring(1));
let accessToken = urlParams.get('access_token');

// 3. LOGIN FUNCTION
function loginToSpotify() {
    const scope = 'streaming user-read-email user-read-private';
    const authUrl = `https://spotify.com{clientId}&status=true&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
}

// 4. MAIN PLAYBACK LOGIC
function playMedia() {
    const val = document.getElementById('urlInput').value.trim();
    const area = document.getElementById('display-area');

    if (!val) {
        alert("Please paste a link first!");
        return;
    }

    // --- YOUTUBE PLAYLIST LOGIC ---
    if (val.includes('list=')) {
        try {
            const urlObj = new URL(val);
            const playlistId = urlObj.searchParams.get('list');
            
            if (playlistId) {
                // Fixed URL structure for YouTube Playlists
                area.innerHTML = `
                    <iframe 
                        src="https://youtube-nocookie.com{playlistId}&autoplay=1&modestbranding=1&rel=0" 
                        allow="autoplay; encrypted-media" 
                        allowfullscreen>
                    </iframe>`;
            } else {
                throw new Error();
            }
        } catch (e) {
            alert("Could not extract a valid YouTube Playlist ID.");
        }
    } 

    // --- SPOTIFY PLAYLIST LOGIC ---
    else if (val.includes('://spotify.com')) {
        // Check if user is authenticated for the best experience
        if (!accessToken) {
            if (confirm("To play full Spotify playlists, you need to connect your account. Login now?")) {
                loginToSpotify();
                return;
            }
        }
        
        // Transform standard link to the required Embed format
        const embedUrl = val.replace("open.://spotify.com", "://spotify.com");
        area.innerHTML = `
            <iframe 
                src="${embedUrl}" 
                width="100%" 
                height="100%" 
                frameborder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
            </iframe>`;
    }

    // --- FALLBACK ---
    else {
        alert("Please paste a valid YouTube or Spotify PLAYLIST link.");
    }
}

// 5. OPTIONAL: Handle Spotify "Access Denied" or Errors
if (window.location.search.includes('error')) {
    console.error("Spotify Authentication Error");
}
