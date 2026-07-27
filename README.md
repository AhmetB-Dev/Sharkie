<div align="center">

# Sharkie

**A responsive 2D browser game built with object-oriented JavaScript and the HTML5 Canvas API.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)
![Canvas](https://img.shields.io/badge/HTML5_Canvas-111827?style=for-the-badge)

</div>

## About the project

Sharkie is a browser-based underwater adventure game developed without frameworks or external runtime dependencies. The player controls a small shark, explores an animated level, collects coins and poison bottles, defeats different enemy types, and faces a final boss.

The main focus of this project is a maintainable, class-based game architecture. Rendering, movement, combat, collision handling, audio, input, responsive behavior, and game-state management are divided into dedicated components.

## Key features

- Animated 2D gameplay rendered on an HTML5 canvas
- Object-oriented JavaScript architecture with separated responsibilities
- Keyboard and mobile multi-touch controls
- Responsive game stage with landscape-orientation support
- Player movement, melee combat, projectiles, and an ultimate attack
- Multiple enemy types with individual behavior and damage mechanics
- Collectible coins and poison ammunition
- Dynamic health, coin, ammunition, and boss status bars
- Start screen, controls panel, settings, pause menu, retry flow, and end screens
- Background music and sound effects with persistent mute state
- Fullscreen support
- Keyboard-accessible menu controls with semantic HTML and ARIA attributes

## Gameplay

Your goal is to move through the underwater world, collect resources, use the correct attack against each enemy type, and defeat the final boss.

| Enemy       | Required attack | Primary key | Alternative key |
| ----------- | --------------- | ----------: | --------------: |
| Puffer fish | Tail attack     |         `J` |      `Y` or `Z` |
| Jellyfish   | Bubble attack   |         `K` |             `X` |
| Final boss  | Poison bubble   |         `L` |             `C` |

### Movement and general controls

| Action               | Keys                    |
| -------------------- | ----------------------- |
| Move left            | `A` or `Arrow Left`     |
| Move right           | `D` or `Arrow Right`    |
| Move up              | `W` or `Arrow Up`       |
| Move down            | `S` or `Arrow Down`     |
| Toggle sound         | `M` or the menu control |
| Close the pause menu | `Escape`                |

> The poison-bubble attack consumes collected poison ammunition. On supported touch devices, mobile controls are displayed automatically in landscape mode.

## Technology stack

| Technology              | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| HTML5                   | Application structure, menus, dialogs, and canvas element        |
| CSS3                    | Layout, responsive behavior, overlays, menus, and touch controls |
| JavaScript              | Game logic, input, state management, animations, and audio       |
| Canvas API              | Rendering the game world, characters, enemies, and HUD           |
| `requestAnimationFrame` | Browser-synchronized rendering loop                              |
| `HTMLAudioElement`      | Background music and sound effects                               |

The project does not require npm, a bundler, a framework, or a build process.

## Architecture

The game is organized around small classes with focused responsibilities:

- **`World`** coordinates the current level and all major gameplay systems.
- **`WorldRenderer`** renders world objects, status bars, and overlays.
- **`WorldEntitiesUpdater`** updates moving and interactive entities.
- **`Character`** composes movement, animation, combat, idle, and damage behavior.
- **`EnemyManager`** manages enemy interactions and final-boss behavior.
- **`CollectibleSystem`** handles coins and ammunition pickups.
- **`Input`** maps keyboard events to shared gameplay flags.
- **`TouchControls`** maps pointer input to the same flags used by the keyboard.
- **`AudioManager`** controls music, sound effects, and mute persistence.
- **`TimerBag`** centralizes timer cleanup when a game session ends.

A fresh level instance is created for each restart so that removed enemies and collected items are not reused accidentally.

## Project structure

```text
.
├── assets/
│   └── assets_sharkie/        # Images, audio, icons, and game assets
├── css/                       # Base, menu, pause, loading, and responsive styles
├── js/
│   └── game.js                # Application startup and global game flow
├── level/
│   └── level1.js              # Level configuration and entity placement
├── models/
│   ├── character/             # Player movement, combat, animation, and damage
│   ├── enemy/                 # Enemy classes and enemy management
│   ├── world/                 # Rendering, HUD, pickups, updates, and end flow
│   └── *.class.js             # Shared game objects and supporting systems
├── index.html                 # Main application document
└── README.md
```

## Run locally

### 1. Get the project

Download or clone the repository and open a terminal in the project root.

### 2. Start a local server

Using Python:

```bash
python -m http.server 5500
```

Alternatively, open the project with the **Live Server** extension in Visual Studio Code.

### 3. Open the game

```text
http://localhost:5500
```

A local server is recommended because browsers may restrict asset and audio loading when `index.html` is opened directly from the file system.

## Responsive behavior

The game uses a base canvas resolution of `720 × 480` pixels and scales the game stage according to the available viewport.

- Desktop users can play with the keyboard.
- Supported touch devices receive on-screen controls.
- Portrait mode on smaller devices displays an orientation notice.
- Opening the pause menu or orientation notice pauses active gameplay.
- Multi-touch input allows movement and attacks at the same time.

## What I practiced

This project strengthened my understanding of:

- Object-oriented programming in JavaScript
- Separation of concerns and class composition
- Canvas rendering and sprite animation
- Collision detection and game-state transitions
- Keyboard, pointer, and multi-touch input
- Resource and timer cleanup during restarts
- Responsive UI design for desktop and mobile devices
- Accessible menus and dialog interactions

## Deployment

Sharkie is a static frontend project and can be deployed using:

- GitHub Pages
- Netlify
- Vercel
- Any static web-hosting service

For GitHub Pages, publish the repository root and keep `index.html` as the entry point.

## Project status

The main gameplay loop, enemy encounters, final-boss fight, responsive controls, sound system, menus, and restart flow are implemented. The project is maintained as a portfolio and learning project.

## License and asset notice

This repository does not currently provide an open-source software license. The code and included assets may not be copied, modified, or redistributed without permission. Some game assets may be subject to separate third-party terms; their usage rights should be verified before commercial reuse.
