# Paddle Configurator - Code Structure

## Overview
This application allows you to load and configure a 3D paddle model with a clean control panel interface.

## File Organization

### Components

#### `src/App.jsx`
- Main application component
- Sets up the layout with control panel (left) and 3D canvas (right)
- Manages the overall state using the `usePaddleMeshes` hook
- Configures lighting for the 3D scene

#### `src/components/PaddleModel.jsx`
- Handles loading the paddle.glb model from `/public/paddleModel/paddle.glb`
- Applies visibility and color settings to individual meshes
- Sets up the camera position for optimal viewing
- Uses `@react-three/drei`'s `useGLTF` for efficient model loading

#### `src/components/ControlPanel.jsx`
- UI component for the left sidebar
- Displays all meshes from the paddle model
- Provides controls for each mesh:
  - Toggle visibility (green = visible, gray = hidden)
  - Color picker with preset colors
  - Custom color input
  - Expandable/collapsible sections for each mesh

### Hooks

#### `src/hooks/usePaddleMeshes.js`
- Custom hook that manages paddle mesh state
- Extracts all mesh names from the loaded GLB model
- Initializes default settings (visible = true, original colors)
- Provides `updateMeshSettings` function for modifying mesh properties

## Key Features

1. **Organized Code Structure**: Separated concerns into components and hooks
2. **Interactive 3D Viewer**: 
   - OrbitControls for rotating, zooming, panning
   - Multiple light sources for better visibility
3. **Mesh Control Panel**:
   - Real-time visibility toggling
   - Color customization with presets and custom picker
   - Expandable UI to reduce clutter
4. **Responsive Layout**: Side-by-side layout with scrollable control panel

## Technologies Used

- React 18
- Three.js (3D rendering)
- @react-three/fiber (React renderer for Three.js)
- @react-three/drei (helpers for Three.js)
- Tailwind CSS (styling)
- Vite (build tool)

## Running the Application

```bash
yarn install
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Model Location

The paddle model should be placed at: `public/paddleModel/paddle.glb`

