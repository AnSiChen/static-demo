# Galacticlip Static Demo

A static browser representation of the original **Galacticlip** .NET MAUI application.

The original project remains unchanged. This folder exists only to preserve the application's UI, screen flow, and representative interactions without requiring a .NET MAUI runtime or NASA API backend.

## Represented screens

- Home — NASA media feed, user header, bookmark toggle
- Search — two-column media search layout
- Bookmarks — bookmark search, media list, removal
- Settings — profile, theme, language, font, size, background, clear bookmarks
- Media Detail — image, description, personal note, close flow

Representative state is stored in browser `localStorage` so settings, bookmarks and personal notes can survive navigation while the demo is open.

## Asset files intentionally omitted from the supplied project archive

Drop the original files into the following locations to restore the exact visual assets:

### `assets/images/`

- `profile1.png`
- `profile2.png`
- `profile3.png`
- `default_background.png`
- `galaxy_background.png`
- `space_background.png`

The static NASA media dataset also references these optional demonstration images:

- `nasa_orion_nebula.jpg`
- `nasa_earth_orbit.jpg`
- `nasa_lunar_surface.jpg`
- `nasa_saturn_rings.jpg`
- `nasa_mars_rover.jpg`
- `nasa_hubble_galaxy.jpg`
- `nasa_spacewalk.jpg`
- `nasa_rocket_launch.jpg`
- `nasa_jupiter_clouds.jpg`
- `nasa_deep_space.jpg`

If these are absent, the UI deliberately shows a styled NASA-media placeholder rather than a broken-image icon.

### `assets/fonts/`

- `Roboto-Regular.ttf`
- `PlayfairDisplay-VariableFont_wght.ttf`
- `DotoVariableFont.ttf`

The CSS already references them and falls back to system fonts until they are restored.

## Run locally

From the parent `static-demo` repository:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/galacticlip/
```
