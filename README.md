# planet-orbits

A project implementing planetary orbits with description.

## Project structure

```JavaScript
planet-orbits     
|   index.html // Site template (<div id="app"></div> is injected automatically)
|   orbit.svg // Reference SVG
|   package-lock.json
|   package.json // Start scripts (npm run start)
|   README.md
|   style.css // Apply the styles here
|   
\---src
        app.js // Application logic
        index.js // Start the application
        orbit.js // createOrbit() function
        util.js // Utility functions, used by orbit.js
```

## How to start

1. Install dependencies

    ```bash
    npm install
    ```

2. Run the project

    ```bash
    npm run start
    ```
