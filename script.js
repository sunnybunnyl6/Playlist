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

    function extractYoutubeId(url) {
        // This regex handles standard, short, mobile, and embed links
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    function playMedia() {
        const val = document.getElementById('urlInput').value.trim();
        const area = document.getElementById('display-area');

        if (val.includes('youtube.com') || val.includes('youtu.be')) {
            const id = extractYoutubeId(val);
            if (id) {
                // Use youtube-nocookie and modestbranding for that "distraction-free" look
                area.innerHTML = `<iframe src="https://youtube-nocookie.com{id}?autoplay=1&modestbranding=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            } else {
                alert("Could not find a valid YouTube Video ID. Try another link!");
            }
        } 
        else if (val.includes('spotify.com')) {
            if (!accessToken) {
                if (confirm("Spotify requires a quick login to play through your app. Login now?")) {
                    loginToSpotify();
                }
                return;
            }
            const embedUrl = val.replace("://spotify.com", "://spotify.com/embed");
            area.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" allow="encrypted-media"></iframe>`;
        }
    }
</script>
