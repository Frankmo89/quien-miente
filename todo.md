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
