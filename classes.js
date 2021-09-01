function Particle() {
  this.position = null;
  this.velocity = null;

  this.ele = null;
  this.gravity = 0;
  this.create = function (x, y, ele, direction) {
    this.position = new Vector().create(x, y);
    this.velocity = new Vector().create(0, 0);
    this.ele = ele;
  };
  this.move = function (exit) {
    if (exit) {
      this.velocity.multiplyBy(0.5);
   
      this.position.addTo(this.velocity);
      this.ele.style.left = `${this.position._x}px`;
      console.log(this.position._x, "pos");
    } else {
      console.log(this.friction)
      this.velocity.multiplyBy(this.friction);

      this.position.addTo(this.velocity);
      this.ele.style.left = `${this.position._x}px`;
    }
  };
}
function Vector() {
  this._x = 0;
  this._y = 0;
  this.height = 0;
  this.friction = 0;

  this.getX = function () {
    return this._x;
  };
  this.getY = function () {
    return this._y;
  };
  this.multiplyBy = function (val) {
    this._x *= val;
    this._y *= val;
  };
  this.addBy = function (val) {
    this._x += val;
    this._y += val;
  };
  this.create = function (x, y) {
    const v = new Vector();
    v._x = x;
    v._y = y;

    return v;
  };
  this.subtract = function (v2) {
    return this.create(this._x - v2.getX(), this._y - v2.getY());
  };
  this.lineHeight = function (v2) {
    this.height = Math.sqrt(
      Math.pow(this._x - v2.getX(), 2) + Math.pow(this._y - v2.getY(), 2)
    );
    return this.height;
  };
  this.addTo = function (v2) {
    this._x += v2.getX();
  };

  this.multiply = function (val) {
    return this.create(this._x * val, this._y * val);
  };
  this.setX = function (val) {
    this._x = val;
  };
  this.setY = function (val) {
    this._y = val;
  };
}
