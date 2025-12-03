# Aks Clip - Project TODO

## Core Features

### Landing Page & Branding
- [x] Update website name to "Aks Clip" in all places
- [x] Remove GitHub link from navigation
- [x] Preserve existing landing page design
- [x] Integrate landing page with full-stack app

### User Authentication & Tier System
- [x] Set up user authentication with Manus OAuth
- [x] Create user tier system (Lite vs Pro)
- [x] Implement tier tracking in database
- [x] Create tier management UI

### Video Input & Upload
- [x] Build video upload interface
- [x] Support YouTube link input
- [x] Support local video file upload
- [x] Validate video format and size

### AI Processing Modules
- [x] Implement AI Persona Artis analyzer
- [x] Implement Theme Scene Detector
- [x] Implement Market Sentiment Analyzer
- [x] Integrate with LLM for AI analysis

### Clip Selection & Generation
- [x] AI-powered scene detection and selection
- [x] Viral clip ranking algorithm
- [x] Generate viral titles automatically
- [x] Generate viral descriptions automatically

### Subtitle System (Pro Feature)
- [ ] Implement automatic transcription (speech-to-text)
- [ ] Generate SRT subtitle files
- [ ] Embed subtitles into video
- [ ] Make subtitle feature Pro-only toggle

### Preview & Download
- [x] Create clip preview interface
- [x] Display viral title and description
- [x] Implement regenerate clip button
- [ ] Implement regenerate title button
- [ ] Implement regenerate description button
- [x] Video download functionality (UI ready)

### Lite Tier Features
- [x] Limit to 15 clips per day
- [x] Display banner ads (non-closeable)
- [ ] Show screen-video ads after clip generation
- [x] Disable subtitle feature
- [x] Allow clip preview and download

### Pro Tier Features
- [x] Unlimited clip generation
- [x] Remove screen-video ads
- [x] Keep banner ads but make closeable
- [ ] Enable subtitle feature (on/off toggle)
- [ ] Prioritize render speed
- [ ] Higher quality output clips

### Ads & Monetization
- [x] Implement banner ad system
- [ ] Implement screen-video ad system
- [x] Make ads tier-dependent
- [x] Create ad dismissal logic for Pro users

### Database Schema
- [x] Create users table with tier field
- [x] Create clips table for storing generated clips
- [x] Create user preferences table
- [x] Create usage tracking table (for daily limits)

### Testing
- [x] Write vitest tests for tier logic
- [x] Write vitest tests for API endpoints
- [x] Write vitest tests for clip generation
- [x] Test Lite vs Pro feature restrictions

## Bugs & Issues
(To be updated as issues are discovered)

## Notes
- Landing page is already built and should not be modified except for GitHub removal and name change
- AI modules are simulated for MVP (can be replaced with real APIs later)
- Video processing uses backend LLM for analysis
