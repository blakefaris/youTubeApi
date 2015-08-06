# YouTubeApi
Single-page web application which uses the YouTube Data API to provide a user interface for search and video details.

## Running
  - Replace [YOUR_OAUTH_CLIENT_ID] with your actual Google OAuth client ID.
    - [YOUR_OAUTH_CLIENT_ID] is located in authService.js
    - The client ID is obtained from the Google Developers Console at https://console.developers.google.com
  - Run a simple Python HTTP server from the root of the project
    - ```$ python -m SimpleHTTPServer 8080 ```

## Features

### Search
- Search by keyword
- Filter by location
- Sort by date, rating and relevance

### Video Details
- Video player
- Meta information like comments, likes, dislikes, channel
- Ability to add/remove from favorites (see below)

### Playlist Videos
- The list of videos the user has saved in their playlists
