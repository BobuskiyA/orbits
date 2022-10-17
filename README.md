# planet-orbits

A project implementing planetary orbits with description.

## Project structure

*Note: `<div id="app"></div>` is injected automatically.*

```JavaScript
planet-orbits
|   index.html // Site template. Uses bundled script
|   orbit.svg // Reference SVG
|   package-lock.json
|   package.json // WebPack scripts (npm run build, npm run serve)
|   README.md // This file
|   style.css // Apply the styles here
|   
+---dist
|       main.js // The bundled script
|
\---src
        app.js // Application logic
        index.js // Start the application
        orbit.js // createOrbit() function
        util.js // Utility functions, used by orbit.js
```

## How to start

1. Install the dependencies

    ```bash
    npm install
    ```

2. Run the project

    - you could just open `index.html`
    - or use Webpack Dev Server for auto rebuilding while saving:

        ```bash
        npm run serve
        ```

3. Build the project after code update:

    ```bash
    npm run build
    ```

    Commit the `dist/` directory to reflect new changes on Github Pages.
