<div align="center">

# Sharkie

**A responsive 2D browser game built with object-oriented JavaScript and the HTML5 Canvas API.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)
![Canvas](https://img.shields.io/badge/HTML5_Canvas-111827?style=for-the-badge)

</div>

## About

Sharkie is an underwater adventure game that runs directly in the browser without frameworks or external runtime dependencies. Players explore an animated level, collect resources, fight different enemy types, and face a final boss.

The project uses a modular, class-based architecture that separates rendering, movement, combat, collision handling, input, audio, responsive behavior, and game-state management.

## Features

- Animated 2D gameplay rendered with the HTML5 Canvas API
- Object-oriented JavaScript architecture with separated responsibilities
- Keyboard and mobile multi-touch controls
- Responsive landscape layout with fullscreen support
- Melee combat, projectiles, collectibles, and multiple enemy types
- Dynamic health, ammunition, coin, and boss status displays
- Start, settings, controls, pause, retry, and end-game screens
- Persistent audio settings and accessible keyboard navigation

## Gameplay and controls

Use the correct attack for each enemy type while collecting coins and poison ammunition.

| Enemy       | Attack        | Primary key | Alternative |
| ----------- | ------------- | ----------: | ----------: |
| Puffer fish | Tail attack   |         `J` |  `Y` or `Z` |
| Jellyfish   | Bubble attack |         `K` |         `X` |
| Final boss  | Poison bubble |         `L` |         `C` |

| Action               | Keys                             |
| -------------------- | -------------------------------- |
| Move                 | `W`, `A`, `S`, `D` or arrow keys |
| Toggle sound         | `M` or the menu control          |
| Close the pause menu | `Escape`                         |

> Poison bubbles consume collected ammunition. Touch controls are displayed automatically on supported devices in landscape mode.

## Tech stack

| Technology | Purpose                                                   |
| ---------- | --------------------------------------------------------- |
| HTML5      | Application structure, dialogs, menus, and canvas element |
| CSS3       | Responsive layout, overlays, menus, and touch controls    |
| JavaScript | Game logic, input, state management, animation, and audio |
| Canvas API | Rendering the game world, characters, enemies, and HUD    |

No package manager, framework, bundler, or build process is required.

## Architecture

The game is divided into focused components:

- **`World`**, **`WorldRenderer`**, and **`WorldEntitiesUpdater`** coordinate game state, rendering, and entity updates.
- **`Character`** composes movement, animation, combat, idle, and damage behavior.
- **`EnemyManager`** controls enemy interactions and final-boss behavior.
- **`CollectibleSystem`** handles coins and poison ammunition.
- **`Input`** and **`TouchControls`** map keyboard and pointer input to shared gameplay actions.
- **`AudioManager`** and **`TimerBag`** manage audio state and reliable cleanup between game sessions.

A fresh level instance is created after each restart so collected items and defeated enemies are reset correctly.

## Project structure

```text
.
├── assets/                    # Images, audio, icons, and game assets
├── css/                       # Layout, menus, overlays, and responsive styles
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

Clone or download the repository, open the project directory, and start a local server.

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

The project can also be started with the **Live Server** extension in Visual Studio Code. A local server is recommended because browsers may restrict asset and audio loading when `index.html` is opened directly from the file system.

## Deployment

Sharkie is a static frontend project and can be deployed with GitHub Pages, Netlify, Vercel, or another static hosting service. Keep `index.html` in the repository root as the entry point.

## Project status

The complete gameplay loop, enemy encounters, final-boss fight, responsive controls, audio system, menus, and restart flow are implemented. Sharkie is maintained as part of my software development portfolio.

## License and asset notice

This repository does not currently include an open-source license. The code and included assets may not be copied, modified, or redistributed without permission. Some assets may be subject to separate third-party usage terms and should be reviewed before commercial reuse.
