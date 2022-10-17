import { createOrbit } from './orbit.js';
import { aqerp } from './util.js';

import { orbitsPartialData, maxSpeed } from './config.js';

function App() {
  const app = document.getElementById('app');

  if (!(app instanceof HTMLElement)) {
    throw new TypeError(`Expected app to be HTMLElement. Got: ${typeof app}`);
  }

  // Create containers for each orbit
  const orbitsData = orbitsPartialData.map(orbit => {
    const planetOrbit = document.createElement('div');
    planetOrbit.className = 'planet-orbit';
    app.appendChild(planetOrbit);

    return { ...orbit, renderToElement: planetOrbit };
  })

  // create an orbits with interpolants
  const orbits = orbitsData.map(orbit => {
    const { data: { angleDegrees, maxAngle } } = orbit;

    return {
      orbitData: orbit,
      handle: createOrbit(orbit),
      interpolant: aqerp(angleDegrees, maxAngle, maxSpeed),
    };
  });

  const maxWidth = orbits.reduce((acc, { orbitData }) => {
    const { width } = orbitData;

    if (width > acc) {
      return width;
    }

    return acc;
  }, 0);

  const maxHeight = orbits.reduce((acc, { orbitData }) => {
    const { height } = orbitData;

    if (height > acc) {
      return height;
    }

    return acc;
  }, 0);

  orbits.forEach(({ orbitData }) => {
    const { width, height, renderToElement } = orbitData;

    if (maxWidth <= 0) {
      throw new TypeError('Expected maxWidth to be positive');
    }

    if (maxHeight <= 0) {
      throw new TypeError('Expected maxHeight to be positive');
    }

    const style = {
      top: `${(maxWidth - width) / 2}px`,
      left: `${(maxHeight - height) / 2}px`,
    }

    Object.assign(renderToElement.style, style);
  });

  // Animate all moons within single interval
  const interval = setInterval(() => {
    const finished = [];

    orbits.forEach(orbit => {
      const { interpolant: interp, handle: { changeAngle } } = orbit;

      // Interpolate if not done
      const { angle, done } = interp();

      if (done) {
        finished.push({ angle, done });
        return;
      }

      changeAngle(angle);
    });
    
    // When all done strategy
    if (finished.every(({ done }) => done === true) && finished.length === orbits.length) {
      clearInterval(interval);
    }
  }, 100);
}

export default App;