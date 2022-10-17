import { createOrbit } from './orbit.js';
import { aqerp } from './util.js';

function App() {
  const app = document.getElementById('app');

  if (!(app instanceof HTMLElement)) {
    throw new TypeError(`Expected app to be HTMLElement. Got: ${typeof app}`);
  }

  const planetOrbit = document.createElement('div');
  planetOrbit.className = 'planet-orbit';

  app.appendChild(planetOrbit);

  const minAngle = 90;
  const maxAngle = 190;

  const moonData = {
    // Starting angle
    angleDegrees: minAngle,
    title: '5 years',
    subtitle: 'on the market'
  }

  const { changeAngle } = createOrbit({
    width: 736,
    height: 736,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: moonData,
    renderToElement: planetOrbit
  });

  const maxSpeed = 5;
  
  // Get the quadratic interpolant (linear speed)
  const interp = aqerp(minAngle, maxAngle, maxSpeed);

  // Animate the moon by changing angle
  const interval = setInterval(() => {
    // Interpolate if not done
    const { angle, done } = interp();

    if (done) {
      clearInterval(interval);
      return;
    }

    changeAngle(angle);
  }, 100);
}

export default App;
