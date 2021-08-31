window.addEventListener("load", function () {
  function initial() {
    const springPoint = new Particle();
    const weight = new Particle();
    const springPos = document
      .querySelector("div.spring-point")
      .getBoundingClientRect();

    const weightPos = document
      .querySelector("div.weight")
      .getBoundingClientRect();
    springPoint.create(
      springPos.x,
      springPos.y,
      document.querySelector("div.spring-point")
    );

    weight.create(
      weightPos.x,
      weightPos.y,
      document.querySelector("div.weight")
    );

    const lineSelector = document.querySelector("div.line");

    function lineAlter() {
      const subtract = weight.position.subtract(springPoint.position);
      let degree = (Math.atan2(subtract._x, subtract._y) * 180) / Math.PI;

      const distance = Math.sqrt(
        Math.pow(subtract._x, 2) + Math.pow(subtract._y, 2)
      );

      lineSelector.style.height = `${distance}px`;

      lineSelector.style.transform = `rotate(${-degree}deg)`;
    }
    function lineDraw(ax, ay, bx, by) {
      const subtract = weight.position.subtract(springPoint.position);

      let degree = (Math.atan2(subtract._y, subtract._x) * 180) / Math.PI;
      const distance = Math.sqrt(
        Math.pow(subtract._x, 2) + Math.pow(subtract._y, 2)
      );

      lineSelector.style.height = `${distance}px`;

      lineSelector.style.transform = `rotate(${-degree}deg)`;
    }

    lineDraw(weight.x, weight.y, springPoint.x, springPoint.y);
    let eventF;

    let currX = 0,
      oldX = 0,
      currY = 0,
      diff = 0,
      interval,
      exited,
      velocity,
      coords,
      mouseCoords = {
        coords1: null,
        coords2: null,
      };
    weight.ele.onmousedown = function (e) {
      e.preventDefault();
      currX = 0;
      currY = 0;
      diff = 0;
      oldX = e.clientX;
      oldY = e.clientY;

      let shiftX = e.clientX - weight.position._x;
      let shiftY = e.clientY - weight.position._y;
      weight.ele.style.perspective = `1500px`;

      interval = setInterval(function () {
        let prevX = oldX;
        diff = currX - oldX;

        oldX = currX;

        if (Math.abs(diff) > 25) {
          console.log(oldY, currY);
          weight.ele.style.backgroundColor = "pink";

          exited = true;

          const slope = currY - oldY / currX - oldX;

          shiftOut();

          clearInterval(interval);
        }
      }, 10);
      eventF = function trackCursor(e) {
        currX = e.clientX;
        currY = e.clientY;

        weight.position.setX(e.clientX - shiftX);
        weight.position.setY(e.clientY - shiftY);
        weight.ele.style.transform = `translate(${weight.position._x}px,${weight.position._y}px) `;

        lineAlter();
      };
      eventF(e);

      weight.ele.addEventListener("mousemove", eventF);
      document.body.addEventListener("mouseup", function () {
        weight.ele.removeEventListener("mousemove", eventF);
      });
    };

    let i = 0;
    function shiftOut() {
      let v = new Vector();
      v = v.create(diff/10,0)
      
      weight.velocity = v;
      weight.velocity.addTo(v);

      weight.move(true);

      requestAnimationFrame(shiftOut);
    }
    function handleMouseUp(time) {
      for (var i = 1; i < 99999; i++) window.clearInterval(i);
      if (!exited) {
        weight.ele.style.perspective = `0px`;
        const k = 0.1;
        weight.friction = 0.5 + Math.random() * 0.01;
        var distance = springPoint.position.subtract(weight.position);

        let springForce = distance.multiply(k);
        weight.velocity.addTo(springForce);

        weight.move();
        i++;
        if (Math.floor(weight.position.getY()) === 499) {
          return;
        }
        requestAnimationFrame(handleMouseUp);
      }
    }

    weight.ele.addEventListener("mouseup", handleMouseUp);
  }

  initial();
});
