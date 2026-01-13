# Project TODO

## Core Game Features
- [x] Mode selection screen (Familiar/Adultos)
- [x] Player setup screen (3-8 players with names and avatars)
- [x] Secret role assignment flow (pass phone around)
- [x] Question display screen
- [x] Secret voting system (pass phone around)
- [x] Results screen with scoring logic
- [x] Mini challenge screen with random selection
- [x] End of round / play again screen

## Game State Management
- [x] Local state management (no persistence between sessions)
- [x] Store player names, avatars, roles, votes, scores in memory
- [x] Role assignment logic (1 liar, rest innocent)
- [x] Voting logic and result calculation
- [x] Score calculation (innocents +1 if correct, liar +2 if wins)
- [x] Mini challenge assignment logic

## Question Packs System
- [x] Database schema for question packs
- [x] Free pack "Para Romper el Hielo" (30-40 questions per mode)
- [x] Premium pack structure (Salseo Total, Dilemas Morales, Recuerdos de la Infancia, Historias de Viaje)
- [x] Question filtering by mode (Familiar/Adultos)
- [x] Random question selection from unlocked packs
- [x] Mini challenges database (separate lists for Familiar/Adultos)

## Stripe Integration
- [x] Stripe Checkout session creation endpoint
- [x] Payment success/cancel redirect pages
- [x] LocalStorage management for unlocked packs
- [x] Pack purchase UI in store screen
- [x] Payment flow testing

## PostHog Analytics
- [x] PostHog integration setup
- [x] Track game_started event
- [x] Track mode_selected event
- [x] Track players_selected event
- [x] Track question_shown event
- [x] Track voting_completed event
- [x] Track game_finished event
- [x] Track pack_viewed event
- [x] Track pack_purchased event

## UI/UX
- [x] Visual style design (colors, typography, theme)
- [x] Large typography for group play
- [x] Clear prominent buttons
- [x] Simple navigation without confusion
- [x] Responsive layout for mobile devices
- [x] Avatar selection component
- [x] Loading states and transitions

## Testing
- [x] Unit tests for game routers
- [x] Unit tests for Stripe integration
- [x] All tests passing


## Content Improvement
- [x] Rewrite "Para Romper el Hielo" pack with better situation-focused questions
- [x] Rewrite "Salseo Total" pack with engaging drama/gossip scenarios
- [x] Rewrite "Dilemas Morales" pack with thought-provoking ethical situations
- [x] Rewrite "Recuerdos de la Infancia" pack with nostalgic and relatable stories
- [x] Rewrite "Historias de Viaje" pack with adventure and travel situations
- [x] Create engaging mini challenges for Familiar mode
- [x] Create engaging mini challenges for Adultos mode
- [x] Remove emoji usage from UI (focus on clear typography)
- [x] Implement all improved content into seed-data.mjs script


## New Premium Packs
- [x] Create "Office Secrets" pack (30 questions - Adultos mode)
- [x] Create "Extreme Travel Anecdotes" pack (30 questions - Familiar and Adultos)
- [x] Add packs to database with Stripe pricing
- [x] Update Store page to display new packs
- [x] Test purchase flow for new packs


## Icebreaker Pack for Team Building
- [ ] Create "Icebreaker" pack (30 questions - Familiar and Adultos modes)
- [ ] Design questions for professional/corporate settings
- [ ] Add pack to database with Stripe pricing
- [ ] Test pack in Store and purchase flow
- [ ] Sync changes to GitHub


## Critical Fixes Required
- [x] Change Spanish from Spain to Latin American Spanish
- [x] Fix text overflow issues in all screens
- [x] Fix emoji/avatar display and alignment
- [x] Allow game to start without pack selection (use free pack by default)
- [x] Test all screens for proper text sizing and layout
