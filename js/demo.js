let boxElement;
const numSteps = 20.0;
let prevRatio = 0.0;
let theViewIs100Percent = false;
let horizontalScrollStarted = false;
let horizontalScrollEnded = false;
let scrollValue = 0;
let offsetWithOfScrollList;

function init() {
  new SmoothScroll(document, 50, 20);
  boxElement = document.querySelector("#scrollList");
  let target = document.getElementById("scrollList");
  target.style.height = window.innerHeight;
  let Children = document.getElementsByClassName("item");
  offsetWithOfScrollList = Children.length * Children[0].clientWidth;
  createObserver();
}

function createObserver() {
  let observer;
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: buildThresholdList()
  };
  observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(boxElement);
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0.5 || horizontalScrollEnded) {
      theViewIs100Percent = true;
      horizontalScrollStarted = true;
    }
  });
}

function buildThresholdList() {
  let thresholds = [];
  let numSteps = 20;

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

function SmoothScroll(target, speed, smooth) {
  if (target === document)
    target =
      document.scrollingElement ||
      document.documentElement ||
      document.body.parentNode ||
      document.body; // cross browser support for document scrolling

  var moving = false;
  var pos = target.scrollTop;
  var frame =
    target === document.body && document.documentElement
      ? document.documentElement
      : target; // safari is the new IE

  target.addEventListener("mousewheel", scrolled, { passive: false });
  target.addEventListener("DOMMouseScroll", scrolled, { passive: false });

  function scrolled(e) {
    if (theViewIs100Percent) {
      e.preventDefault();
      var delta = normalizeWheelDelta(e);

      pos += -delta * 5;
      pos = Math.max(
        0,
        Math.min(pos, target.scrollHeight - frame.clientHeight)
      ); // limit scrolling

      if (!moving) update();
      scrollHorizontal(e);
    }
    //disable default scrolling
    else {
      e.preventDefault();
      var delta = normalizeWheelDelta(e);

      pos += -delta * speed;
      pos = Math.max(
        0,
        Math.min(pos, target.scrollHeight - frame.clientHeight)
      ); // limit scrolling

      if (!moving) update();
    }
  }

  function scrollHorizontal(event) {
    let target = document.getElementById("scrollList");
    scrollValue = scrollValue + event.deltaY;
    if (scrollValue >= offsetWithOfScrollList) {
      theViewIs100Percent = false;
      scrollValue = offsetWithOfScrollList;
      target.scroll({ top: 0, left: scrollValue, behavior: "smooth" });
    } else if (scrollValue < 0) {
      theViewIs100Percent = false;
      scrollValue = 0;
      target.scroll({ top: 0, left: scrollValue, behavior: "smooth" });
    } else {
      target.scroll({ top: 0, left: scrollValue, behavior: "smooth" });
    }
  }

  function normalizeWheelDelta(e) {
    if (e.detail) {
      if (e.wheelDelta)
        return (e.wheelDelta / e.detail / 40) * (e.detail > 0 ? 1 : -1);
      // Opera
      else return -e.detail / 3; // Firefox
    } else return e.wheelDelta / 120; // IE,Safari,Chrome
  }

  function update() {
    moving = true;

    var delta = (pos - target.scrollTop) / smooth;

    target.scrollTop += delta;

    if (Math.abs(delta) > 0.5) requestFrame(update);
    else moving = false;
  }

  var requestFrame = (function() {
    // requestAnimationFrame cross browser
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(func) {
        window.setTimeout(func, 1000 / 50);
      }
    );
  })();
}
