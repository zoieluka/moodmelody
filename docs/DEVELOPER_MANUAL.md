
# Developer Manual for Mood Melody

## Installation & Setup Guide

This document is for future developers working on the MoodMelody web application. It includes installation instructions, how to run the app, API details, known issues, and a roadmap for future development. I hope this help better understand my project!

## Project Structure & Reference Overview

moodmelody/
├── api/                       # Serverless API routes (through by Vercel)
│   ├── getMoods.js            # Fetches mood history from Supabase
│   └── saveMood.js            # Saves new mood entry to Supabase
├── about.html                 # About page describing the project
├── history.html               # Displays saved mood + tag history from Supabase
├── index.html                 # Input page for user mood
├── playlist.html              # Displays curated songs from Last.fm based on emotion
├── package.json               # An (optional) package for dependency tracking if backend grows
├── README.md                  # Project overview
└── docs/
    └── DEVELOPER_MANUAL.md    # Technical documentation 


## Prerequisites

Before starting, download or setup the following:

- [Node.js and npm](https://nodejs.org/en/)
- [VS Code](https://code.visualstudio.com/)
- [Python 3](https://www.python.org/)
- A GitHub account (for version control)
- A Vercel account (for cloud hosting)
- A Supabase project with a `moods` table created
- A RapidAPI account for Twinword
- A Last.fm account with an API key

---

## Clone the Project

```bash
git clone https://github.com/zoieluka/moodmelody.git
cd moodmelody
```

---

## Install Dependencies

While the app is primarily static, it requires the following package for API interaction:

```bash
npm install
```

**From `package.json`:**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.3"
  }
}
```

---

## Required API Keys

Set up the following keys to run the application successfully:

### 1. Twinword API Key (via RapidAPI)
- Go to [RapidAPI - Twinword](https://rapidapi.com/twinword/api/sentiment-analysis)
- Add the key to `index.html`:
```js
const twinwordApiKey = "your-twinword-api-key";
```

### 2. Last.fm API Key
- Create an app at https://www.last.fm/api/account/create
- Add the key in `playlist.html`:
```js
const lastFmApiKey = "your-lastfm-api-key";
```

### 3. Supabase API Key
- From your Supabase project settings
- Add to `.env` (or in Vercel’s dashboard)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

---

## Running the Application

### Locally with Python Server

```bash
python3 -m http.server
```

Visit `http://localhost:8000` in your browser.

### With VS Code Live Server

1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select **"Open with Live Server"**

---

## Deploying with Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Link your GitHub repo
3. During setup, add the following environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
4. Deploy the site

Your `/api/` directory will automatically function as Vercel serverless endpoints.

---

# Testing Instructions & API Documentation

This section explains how to manually test MoodMelody and documents all backend API endpoints and external APIs in use. Future developers should follow these steps to validate functionality, debug errors, and understand API behaviors.

---

## Manual Testing Guide

### 1. Test the Mood Input & Genre Selection
- Open `index.html`
- Input a sentence like "I'm stressed but hopeful"
- Select a genre like "lofi"
- Click **Generate Playlist**
- You should be redirected to `playlist.html`

### 2. Test Twinword API Integration
- In DevTools > Network tab, confirm a request to:
  ```
  https://twinword-sentiment-analysis.p.rapidapi.com/analyze/
  ```
- The response should include a field like:
  ```json
  { "type": "neutral" }
  ```

### 3. Test `/api/saveMood` POST Call
- After submitting the form, check Network tab:
  ```
  POST /api/saveMood
  ```
- The body should include moodText and genre
- Response should contain a `success: true` field

### 4. Test Playlist Loading (iTunes)
- Confirm that `playlist.html` shows a Swiper slider with 10 tracks
- Each slide should contain artwork, track name, artist, and links to Spotify & Apple Music

### 5. Test Mood History Page
- Visit `history.html`
- It should fetch and display recent mood logs
- Each entry shows mood_text, genre, and timestamp

---

##  Backend API Reference (Vercel)

### 1. `POST /api/saveMood`

- **Purpose**: Saves a new mood + genre entry to Supabase.
- **Used By**: `index.html`
- **Request**:
  ```json
  {
    "moodText": "I feel energized",
    "genre": "rock"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "mood_text": "I feel energized",
      "genre": "rock",
      "created_at": "2025-05-18T17:30:00Z"
    }
  }
  ```

---

### 2. `GET /api/getMoods`

- **Purpose**: Retrieves the latest 10 moods from Supabase.
- **Used By**: `history.html`
- **Response**:
  ```json
  [
    {
      "mood_text": "Calm and focused",
      "genre": "lofi",
      "created_at": "2025-05-18T17:30:00Z"
    }
  ]
  ```

---

## External APIs Used

### 1. **Twinword Sentiment Analysis API**
- **Endpoint**: `https://twinword-sentiment-analysis.p.rapidapi.com/analyze/`
- **Method**: `POST`
- **Used In**: `index.html`
- **Purpose**: Analyzes mood sentiment as `positive`, `neutral`, or `negative`
- **Required**: RapidAPI subscription + key
- **Header Example**:
  ```http
  X-RapidAPI-Key: your-key
  ```

---

### 2. **Last.fm API**
- **Endpoint Template**:
  ```
  https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag={mood}&api_key={lastFmApiKey}&format=json
  ```
- **Method**: `GET`
- **Used In**: `playlist.html`
- **Purpose**: Fetches top tracks by tag (mood)
- **Required**: Free Last.fm API key
- **Response Example**:
  ```json
  {
    "tracks": {
      "track": [
        { "name": "Chillwave", "artist": { "name": "Dream Koala" }, ... }
      ]
    }
  }
  ```

---

### 3. **Apple iTunes API**
- **Endpoint Template**:
  ```
  https://itunes.apple.com/search?term={mood}+{genre}&media=music&limit=20
  ```
- **Method**: `GET`
- **Used In**: `playlist.html`
- **Purpose**: Fetches matching music results
- **Authentication**: No key required
- **Limitations**: May return duplicates; limited artist coverage

---

# Known Bugs & Limitations

### 1. **Twinword API Limitation**
- Some ambiguous or very short mood inputs return a “Could not detect emotion” message.
- Sentiment results may not always match real-world expectations, especially for sarcastic or complex phrases.

### 2. **Genre Selection is User-Controlled**
- Users can select any genre manually, which may conflict with mood-tagged playlists.
- No automatic validation that the genre fits the mood 

### 3. **No Authentication or User Accounts**
- All moods saved are anonymous.
- Users cannot retrieve personalized history or manage their own data.

# Roadmap for Future Development

### Authentication and Profiles
- Implement Supabase Auth to allow user accounts
- Enable storing mood history per user and filtering by session

### Spotify Playlist Export
- Use Spotify OAuth and API to export a generated playlist directly to user accounts

### Voice Input/Dectection Support
- Use Web Speech API to let users describe their mood verbally

### Mood Analytics Dashboard
- Add a dashboard for visualizing mood trends over time
- Implement mood frequency, genre usage stats, etc.

**Zoie Luka**  
GitHub: [@zoieluka](https://github.com/zoieluka)  
Role: Full-stack developer, UX designer, & project lead. Basically a one Women show!!
