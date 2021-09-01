window.addEventListener("load", function () {
  const button = this.document.getElementsByTagName("button");

  function initial() {
    const springPoint = new Particle();
    const springPoint2 = new Particle();
    const springPoint3 = new Particle();
    const weight = new Particle();
    const weight2 = new Particle();
    const springPos = document
      .querySelector("div.spring-point")
      .getBoundingClientRect();
    const springPos2 = document
      .querySelector("div.spring-point2")
      .getBoundingClientRect();
    const springPos3 = document
      .querySelector("div.spring-point3")
      .getBoundingClientRect();
    const weightPos = document
      .querySelector("div.weight")
      .getBoundingClientRect();
    console.log(weightPos);
    console.log(springPos);
    const weightPos2 = document.querySelector("div.w2").getBoundingClientRect();

    springPoint.create(
      springPos.x,
      springPos.y,
      document.querySelector("div.spring-point")
    );
    springPoint2.create(
      springPos2.x,
      springPos2.y,
      document.querySelector("div.spring-point2")
    );
    springPoint3.create(
      springPos3.x,
      springPos3.y,
      document.querySelector("div.spring-point3")
    );

    weight.create(
      weightPos.x,
      weightPos.y,
      document.querySelector("div.weight")
    );
    weight2.create(weightPos.x, weightPos.y, document.querySelector("div.w2"));

    const lineSelector = document.querySelector("div.line");

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
      mouseEvent;
    const weights = {
      ["weight"]: weight,
      ["weight1"]: weight2,
    };
    for (let weight in weights) {
      weights[weight].friction = 0.5 + Math.random() * 0.01;
    }
    let kk = 1;
    function perspective(e) {
      e.target.style.transform = `scale(${kk})`;
      var distance = springPoint.position.subtract(weights[e.target.id].position);
      if (kk < 1.1) {
        requestAnimationFrame(function (time) {
          perspective(e, time);
        });
      }
    }
    window.onmousedown = function (e) {
      if (
        e.target.className !== "weight" &&
        e.target.className !== "weight w2"
      ) {
        return;
      }
      perspective(e);
      mouseEvent = true;
      e.preventDefault();
      currX = 0;
      currY = 0;
      diff = 0;
      oldX = e.clientX;
      oldY = e.clientY;
      let shiftX = e.clientX - weights[e.target.id].position._x;
      let shiftY = e.clientY - weights[e.target.id].position._y;
      weights[e.target.id].ele.style.perspective = `1500px`;

      interval = setInterval(function () {
        diff = currX - oldX;

        oldX = currX;
      }, 10);
      eventF = function trackCursor(e) {
        currX = e.clientX;
        currY = e.clientY;

        weights[e.target.id].position.setX(e.clientX - shiftX);
        weights[e.target.id].position.setY(e.clientY - shiftY);
        weights[e.target.id].ele.style.left = `${
          weights[e.target.id].position._x
        }px`;
      };
      eventF(e);
      weights[e.target.id].ele.addEventListener("mousemove", eventF);
      document.body.addEventListener("mouseup", function () {
        weights[e.target.id].ele.removeEventListener("mousemove", eventF);
      });
    };

    let v = new Vector();
    v = v.create(0.2, 0);
    let j = 0;
    let ordered = [];
    function click(e) {
      let i = 0;

      for (let weight of ordered) {
        setTimeout(() => {
          const k = 0.02;
          j = 0;
          console.log(weights[weight].position);
          exited = false;

          var distance = springPoint.position.subtract(
            weights[weight].position
          );
          let springForce = distance.multiply(k);

          weights[weight].velocity.addTo(springForce);
          weights[weight].move();
        }, i * 500);
        i++;
      }
      if (
        (Math.floor(weights["weight"].position.getX()) === 1200 ||
          Math.floor(weights["weight"].position.getX()) === 1199) &&
        (Math.floor(weights["weight1"].position.getX()) === 1200 ||
          Math.floor(weights["weight1"].position.getX()) === 1199)
      ) {
        ordered = [];
        return;
      }
      requestAnimationFrame(function (time) {
        click(e, time);
      });
    }
    button[0].addEventListener("click", function (e) {
      ordered.reverse();
      click(e);
    });

    function shiftOut(e, time) {
      j++;
      const k = 0.1;

      var distance1 = springPoint2.position.subtract(
        weights[e.target.id].position
      );
      var distance2 = springPoint3.position.subtract(
        weights[e.target.id].position
      );
      let distance =
        Math.abs(distance1._x) < Math.abs(distance2._x) ? distance1 : distance2;

      let springForce = distance.multiply(k);
      springForce.addBy(0.1);
      weights[e.target.id].velocity.addTo(springForce);
      weights[e.target.id].move(true);

      if (j < 50) {
        requestAnimationFrame(function (time) {
          shiftOut(e, time);
        });
      } else {
        j = 0;
      }
    }
    function handleMouseUp(e, time) {
      if (Math.abs(diff) > 25) {
        weights[e.target.id].ele.style.backgroundColor = "pink";

        exited = true;

        shiftOut(e);
        ordered.push(e.target.id);
        clearInterval(interval);
      } else {
        mouseEvent = false;
        for (var i = 1; i < 99999; i++) window.clearInterval(i);
        weights[e.target.id].ele.style.perspective = `0px`;
        const k = 0.1;

        var distance = springPoint.position.subtract(
          weights[e.target.id].position
        );
        let springForce = distance.multiply(k);

        weights[e.target.id].velocity.addTo(springForce);

        weights[e.target.id].move();
        i++;
        if (
          Math.floor(weights[e.target.id].position.getX()) === 1200 ||
          Math.floor(weights[e.target.id].position.getX()) === 1199
        ) {
          return;
        }
        requestAnimationFrame(function (time) {
          handleMouseUp(e, time);
        });
      }
    }
    for (let weight in weights) {
      weights[weight].ele.addEventListener("mouseup", handleMouseUp);
    }
  }

  initial();
});
