function calcMidpoint(p1 = {}, p2 = {}) {
  const {
    x: x1 = 0,
    y: y1 = 0
  } = p1;
  const {
    x: x2 = 0,
    y: y2 = 0
  } = p2;

  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  };
}

function calcTranslation(p1 = {}, p2 = {}) {
  const {
    x: x1 = 0,
    y: y1 = 0
  } = p1;
  const {
    x: x2 = 0,
    y: y2 = 0
  } = p2;

  return {
    x: x2 - x1,
    y: y2 - y1
  };
}

function calcDistance(p1 = {}, p2 = {}) {
  const {
    x: x1 = 0,
    y: y1 = 0
  } = p1;
  const {
    x: x2 = 0,
    y: y2 = 0
  } = p2;

  return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
}

export class MobileZoom {
  constructor(element, callback) {
    this.element = element;
    this.callback = callback || (() => {});

    this.reset();

    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._addListeners();
  }

  _addListeners() {
    this.element.addEventListener('touchstart', this._handleTouchStart);
    this.element.addEventListener('touchmove', this._handleTouchMove);
  }

  _handleTouchStart(event = {}) {
    event.preventDefault();

    const { touches: t } = event;
    const touches = [...t];

    this.touches = touches.map((touch) => {
      return {
        id: touch.identifier,
        begin: {
          x: touch.screenX,
          y: touch.screenY
        },
        current: {
          x: touch.screenX,
          y: touch.screenY
        }
      };
    });

    Object.assign(this.beginTranslation, this.translation);
    this.beginDistance = this.distance;

    this._geometry();
  }

  _handleTouchMove(event = {}) {
    event.preventDefault();

    const { touches: t } = event;
    const touches = [...t];

    this.touches.forEach((finger) => {
      const { id } = finger;

      const match = touches.find((touch) => {
        return touch.identifier === id;
      });

      if (!match) return;

      Object.assign(finger, {
        current: {
          x: match.screenX,
          y: match.screenY
        }
      });
    });

    this._geometry();
  }

  _geometry() {
    const [p1, p2] = this.touches;

    const first = p1 || {};
    const second = p2 || {};

    const midpointBegin = calcMidpoint(first.begin, second.begin);
    const midpointCurrent = calcMidpoint(first.current, second.current);

    this.touchTranslation = calcTranslation(midpointBegin, midpointCurrent);

    const beginDistance = calcDistance(first.begin, second.begin);
    const currentDistance = calcDistance(first.current, second.current);

    this.touchDistance = p2 ? currentDistance - beginDistance : 0;

    this.translation = {
      x: this.beginTranslation.x + this.touchTranslation.x,
      y: this.beginTranslation.y + this.touchTranslation.y
    };

    this.distance = Math.max(this.beginDistance + this.touchDistance, 0);

    this.callback(this.translation, this.distance);
  }

  reset() {
    this.translation = {
      x: 0,
      y: 0
    };
    this.distance = 0;

    this.beginTranslation = {
      x: 0,
      y: 0
    };
    this.beginDistance = 0;

    this.touches = [];
    this.touchTranslation = {
      x: 0,
      y: 0
    };
    this.touchDistance = 0;

    this.callback(this.translation, this.distance);
  }
}
