import { getPositionOnEllipse, parseGradientString } from './util.js';

/**
 * Contains a data for moon which is placed on the orbit circle.
 * @typedef {Object} moonData
 * @property { angleDegrees } angleDegrees Position on the circle in degrees.
 * @property { title } title The title, is colored with accent color.
 * @property { subtitle } subtitle The subtitle, is colored with default color.
 */

/**
 * Contains data to render orbit circle.
 * @typedef {Object} createOrbitConfiguration
 * @property { number } width The width of circle in px
 * @property { number } height The height of circle in px
 * @property { string } gradientString The contents of radialGradient() function in CSS. Example: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%'
 * @property { number } borderWidth Thickness of orbit line
 * @property { moonData } data Contains a data for moon which is placed on the orbit circle.
 * @property { HTMLElement } renderToElement The element to which result is rendered
 */

/**
 * Contains different methods for changing parameters of orbit
 * @typedef {Object} orbitHandle
 * @property {(newAngleDegrees: number) => void} changeAngle Changes the position of moon on the orbit circle.
 */

/**
 * Creates SVG element with orbit circle and a moon with labels.
 * @param { createOrbitConfiguration } orbitConfiguration Contains data to render orbit circle.
 * @returns {orbitHandle} A handle to manipulate the rendered orbit (for animation purposes).
 */
export function createOrbit({
  width,
  height,
  gradientString,
  borderWidth,
  data: { angleDegrees, title, subtitle },
  renderToElement
}) {
  const ns = "http://www.w3.org/2000/svg";

  if (typeof width !== "number") {
    throw new TypeError(`Expected width to be number. Got: ${typeof width}`);
  }

  if (typeof height !== "number") {
    throw new TypeError(`Expected height to be number. Got: ${typeof height}`);
  }

  if (typeof borderWidth !== "number") {
    throw new TypeError(`Expected borderWidth to be number. Got: ${typeof borderWidth}`);
  }

  if (!(typeof title === "string" || title instanceof String)) {
    throw new TypeError(`Expected title to be a string. Got ${typeof title}`);
  }

  if (!(typeof subtitle === "string" || subtitle instanceof String)) {
    throw new TypeError(`Expected subtitle to be a string. Got ${typeof subtitle}`);
  }

  if (!(renderToElement instanceof HTMLElement)) {
    throw new TypeError(`Expected renderToElement to be HTMLElement. Got ${renderToElement.constructor.name}`);
  }

  // Orbit
  
  const svgEl = document.createElementNS(ns, 'svg');
  svgEl.setAttribute('width', `${width}`);
  svgEl.setAttribute('height', `${height}`);
  svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const defs = document.createElementNS(ns, 'defs');
  svgEl.appendChild(defs);

  const parsedGradient = parseGradientString(gradientString);
  const { scaleX, scaleY, posX: cx, posY: cy, stops } = parsedGradient;

  const gradientTransform = `scale(${scaleX} ${scaleY}) translate(${(1 - scaleX) / 2} ${(1 - scaleY) / 2})`

  const gradientId = 'orbit-gradient'
  const radialGraident = document.createElementNS(ns, 'radialGradient');
  radialGraident.setAttribute('id', gradientId);
  radialGraident.setAttribute('cx', cx);
  radialGraident.setAttribute('cy', cy);
  radialGraident.setAttribute('gradientTransform', gradientTransform);

  defs.appendChild(radialGraident);

  stops.forEach(stop => {
    const { offset, stopColor } = stop;

    const stopEl = document.createElementNS(ns, 'stop');
    stopEl.setAttribute('offset', offset);
    stopEl.setAttribute('stop-color', stopColor);

    radialGraident.appendChild(stopEl);
  });

  const maskId = 'orbit-mask';
  const mask = document.createElementNS(ns, 'mask');
  mask.setAttribute('x', '0');
  mask.setAttribute('y', '0');
  mask.setAttribute('width', `${width}`);
  mask.setAttribute('height', `${height}`);
  mask.setAttribute('id', maskId);

  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', `${width}`);
  rect.setAttribute('height',  `${height}`);
  rect.setAttribute('fill',  '#000');

  const ellipseMask = document.createElementNS(ns, 'ellipse');
  ellipseMask.setAttribute('rx', `${width / 2}`);
  ellipseMask.setAttribute('ry',  `${height / 2}`);
  ellipseMask.setAttribute('cx',  `${width / 2}`);
  ellipseMask.setAttribute('cy',  `${height / 2}`);
  ellipseMask.setAttribute('stroke',  '#FFF');
  ellipseMask.setAttribute('stroke-width',  `${borderWidth}`);

  mask.append(rect, ellipseMask);
  defs.append(mask);

  const ellipse = document.createElementNS(ns, 'ellipse');
  ellipse.setAttribute('mask', `url(#${maskId})`);
  ellipse.setAttribute('fill', `url(#${gradientId})`);
  ellipse.setAttribute('rx', `${width / 2}`);
  ellipse.setAttribute('ry', `${height / 2}`);
  ellipse.setAttribute('cx', `${width / 2}`);
  ellipse.setAttribute('cy', `${height / 2}`);

  svgEl.appendChild(ellipse);

  // Moon and text

  const moonPosition = getPositionOnEllipse(width, height, angleDegrees);

  const moon = document.createElement('div');
  Object.assign(moon, {
    className: 'orbit-moon'
  });
  const moonRadius = 10;

  Object.assign(moon.style, {
    width: `${moonRadius * 2}px`,
    height: `${moonRadius * 2}px`,
    
  });

  const moonContainer = document.createElement('div');
  Object.assign(moonContainer, {
    className: 'orbit-moon-container',
  });
  Object.assign(moonContainer.style, {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    position: 'absolute',
  });

  moonContainer.appendChild(moon);

  const description = document.createElement('div');
  Object.assign(description, {
    className: 'orbit-moon-description'
  });
  Object.assign(description.style, {
    display: 'flex',
    flexDirection: 'column',
  });

  const titleLabel = document.createElement('label');
  Object.assign(titleLabel, {
    className: 'description-title',
  });
  const subTitleLabel = document.createElement('label');
  Object.assign(subTitleLabel, {
    className: 'description-subtitle',
  });

  titleLabel.appendChild(document.createTextNode(title));
  subTitleLabel.appendChild(document.createTextNode(subtitle));
  description.append(titleLabel, subTitleLabel);
  moonContainer.appendChild(description);

  renderToElement.append(svgEl, moonContainer);

  const { height: containerHeight } = moonContainer.getBoundingClientRect();

  const { offsetTop: top, offsetLeft: left } = renderToElement;

  Object.assign(moonContainer.style, {
    left: `${moonPosition.x - moonRadius + left}px`,
    top: `${moonPosition.y - containerHeight / 2 + top}px`,
  });

  return {
    /**
     * Changes the position of moon on the orbit circle.
     * @param {number} newAngleDegrees The new position on the orbit circle in degrees.
     * @returns {void}
     */
    changeAngle(newAngleDegrees) {
      const moonPosition = getPositionOnEllipse(width, height, newAngleDegrees);
      const { offsetTop: top, offsetLeft: left } = renderToElement;

      Object.assign(moonContainer.style, {
        left: `${moonPosition.x - moonRadius + left}px`,
        top: `${moonPosition.y - containerHeight / 2 + top}px`,
      });
    }
  }
}