var canvas;
let flock;
var boidCounter = 1;
let fuguEl = null;     // cached reference to the floating fugu CTA element
let fuguBounds = null; // peak-scale bounding rect (computed at setup / resize, not per frame)

// Compute the floating fugu's bounding box at its peak (scale 1.10) size.
// offsetWidth/Height give the unscaled layout box (the inner <img> breathes with scale,
// but the parent layout doesn't change). We expand by the peak scale factor so the
// avoidance zone is sized for the largest the fugu visually gets.
// Only called once at setup and again on window resize — not per frame.
function refreshFuguBounds() {
  if (!fuguEl) fuguEl = document.querySelector('.fugu-cta');
  if (!fuguEl) { fuguBounds = null; return; }
  const layoutW = fuguEl.offsetWidth;
  const layoutH = fuguEl.offsetHeight;
  if (layoutW === 0 || layoutH === 0) { fuguBounds = null; return; }
  const rect = fuguEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const peakScale = 1.10; // matches @keyframes fugu-breathe peak in index.html
  const peakW = layoutW * peakScale;
  const peakH = layoutH * peakScale;
  fuguBounds = {
    x: centerX - peakW / 2,
    y: centerY - peakH / 2,
    w: peakW,
    h: peakH
  };
}

function setup() {
  canvas = createCanvas(1280, 720);
  const slot = document.querySelector('.fish-slot');
  if (slot) canvas.parent(slot);
  canvas.position(0, 0);
  canvas.style('z-index', '0');
  background("#FAFAF7");
  boidCounter = 1;

  refreshFuguBounds();

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 70; i++) {
    let b = null;
    if (i < 35) {
      b = new Boid(width / 2,height / 2);
    } else {
      b = new Boid(random(width),random(height));
    }    
    flock.addBoid(b);
  }
  if (window.__fishMount) window.__fishMount(); // let the deck place the canvas on the current slide
}

function draw() {
  background("#FAFAF7");
  flock.run();
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  this.boidCounter = boidCounter;
  boidCounter += 1;
  this.noiseOffsetX = random(1000); // Random starting point in noise space
  this.noiseOffsetY = random(1000);
  this.noiseIncrement = 0.002; // How fast we move through noise space
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  // Sakana AI does it's own thing!!
  if (this.boidCounter == boidCounter-1 && boidCounter > 2) {
    let noiseX = noise(this.noiseOffsetX);
    let noiseY = noise(this.noiseOffsetY);
    
    // Convert noise (0-1) to forces (-1 to 1)
    let forceX = map(noiseX, 0, 1, -1, 1);
    let forceY = map(noiseY, 0, 1, -1, 1);
    
    // Create smooth random force
    let randomForce = createVector(forceX, forceY);
    randomForce.mult(5.5); // Adjust this to control how strong the random movement is
    
    // Apply forces
    this.applyForce(randomForce);
    // this.applyForce(centerForce);
    
    // Increment noise offsets
    this.noiseOffsetX += this.noiseIncrement;
    this.noiseOffsetY += this.noiseIncrement + 0.001; // Slightly different increment for Y
  } else {
    let sep = this.separate(boids);   // Separation
    let ali = this.align(boids);      // Alignment
    let coh = this.cohesion(boids);   // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Avoid the floating fugu CTA (applies to leader boid too)
  let avoid = this.avoid(fuguBounds);
  if (avoid.mag() > 0) {
    this.applyForce(avoid);
  }
}

// Steer around the floating fugu CTA — predictive avoidance.
// Only activates when the boid's near-future position is on track to enter the rect,
// then nudges it sideways (perpendicular to its velocity) so it curves around.
// This avoids the constant-repulsion oscillation that caused jittery motion before.
Boid.prototype.avoid = function(bounds) {
  if (!bounds) return createVector(0, 0);

  // Predict position ~50 frames ahead — gives boids enough lead time to curve away
  const future = p5.Vector.add(this.position, p5.Vector.mult(this.velocity, 50));
  const pad = 22;
  const futureInside =
    future.x >= bounds.x - pad && future.x <= bounds.x + bounds.w + pad &&
    future.y >= bounds.y - pad && future.y <= bounds.y + bounds.h + pad;

  // Fallback for boids that somehow ended up close to or inside the rect (e.g. spawned via mouse drag)
  const nearestX = Math.max(bounds.x, Math.min(this.position.x, bounds.x + bounds.w));
  const nearestY = Math.max(bounds.y, Math.min(this.position.y, bounds.y + bounds.h));
  const dx = this.position.x - nearestX;
  const dy = this.position.y - nearestY;
  const inImmediateZone = dx*dx + dy*dy < 30*30;

  if (!futureInside && !inImmediateZone) return createVector(0, 0);

  // Steer perpendicular to current velocity, toward the side that points away from the rect center
  const cx = bounds.x + bounds.w / 2;
  const cy = bounds.y + bounds.h / 2;
  const toCenter = createVector(cx - this.position.x, cy - this.position.y);
  const perp = createVector(-this.velocity.y, this.velocity.x);
  if (perp.dot(toCenter) > 0) perp.mult(-1);
  if (perp.mag() < 0.001) return createVector(0, 0);
  perp.normalize();
  perp.mult(this.maxspeed);

  let steer = p5.Vector.sub(perp, this.velocity);
  steer.limit(this.maxforce * 3.5);
  return steer;
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);

  // Hard constraint: if this frame's motion landed the boid inside the fugu rect,
  // push it back out along the nearest edge and reflect its velocity component (with damping).
  // This is the safety net behind the predictive `avoid()` steering — guarantees no passthrough.
  if (fuguBounds) {
    const pad = 4;
    const left = fuguBounds.x - pad;
    const right = fuguBounds.x + fuguBounds.w + pad;
    const top = fuguBounds.y - pad;
    const bottom = fuguBounds.y + fuguBounds.h + pad;

    if (this.position.x > left && this.position.x < right &&
        this.position.y > top && this.position.y < bottom) {
      const distLeft = this.position.x - left;
      const distRight = right - this.position.x;
      const distTop = this.position.y - top;
      const distBottom = bottom - this.position.y;

      // Escape along whichever axis is closer
      if (Math.min(distLeft, distRight) < Math.min(distTop, distBottom)) {
        if (distLeft < distRight) {
          this.position.x = left;
          if (this.velocity.x > 0) this.velocity.x = -this.velocity.x * 0.6;
        } else {
          this.position.x = right;
          if (this.velocity.x < 0) this.velocity.x = -this.velocity.x * 0.6;
        }
      } else {
        if (distTop < distBottom) {
          this.position.y = top;
          if (this.velocity.y > 0) this.velocity.y = -this.velocity.y * 0.6;
        } else {
          this.position.y = bottom;
          if (this.velocity.y < 0) this.velocity.y = -this.velocity.y * 0.6;
        }
      }
    }
  }

  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  if (this.boidCounter == boidCounter-1) {
    fill("#E10600");
    stroke("#E10600");
  } else {
    fill(168, 200);
    stroke(168, 200);
  }
  push();
  translate(this.position.x, this.position.y);
  rotate(theta - PI/2);
  scale(0.02);
  strokeWeight(0);
  
  // Logo Fish
  beginShape();
  vertex(0, 554.58227);
  bezierVertex(0, 539.57642, 12.277536, 527.29883, 27.283415, 527.29883);
  bezierVertex(137.78125, 527.29883, 237.36554, 570.95227, 311.03076, 641.89916);
  bezierVertex(350.5917, 588.69652, 376.51114, 524.71648, 381.9678, 453.77966);
  vertex(154.15112, 452.53317);
  bezierVertex(139.14525, 452.53317, 126.86771, 440.25564, 126.86771, 425.24979);
  bezierVertex(126.86771, 410.24393, 139.14525, 397.96639, 154.15112, 397.96639);
  vertex(410.61548, 397.96639);
  bezierVertex(582.50098, 397.96639, 744.83722, 464.8106, 866.24841, 586.22177);
  vertex(941.27783, 661.25118);
  bezierVertex(946.7345, 666.70785, 949.46289, 673.52902, 949.46289, 680.34982);
  bezierVertex(949.46289, 687.17062, 946.7345, 693.99142, 941.27783, 699.44808);
  vertex(866.24841, 774.47749);
  bezierVertex(744.83722, 896.88866, 582.50098, 963.7329, 410.61548, 963.7329);
  vertex(154.15112, 963.7329);
  bezierVertex(139.14525, 963.7329, 126.86771, 951.45536, 126.86771, 936.44951);
  bezierVertex(126.86771, 921.44365, 139.14525, 909.16611, 154.15112, 909.16611);
  vertex(381.9678, 909.16611);
  bezierVertex(376.51114, 839.69397, 350.5917, 774.21393, 311.03076, 721.01129);
  bezierVertex(237.36554, 791.94812, 137.78125, 835.60156, 27.283415, 835.60156);
  bezierVertex(12.277536, 835.60156, 0, 823.32398, 0, 808.31811);
  bezierVertex(0, 793.31226, 12.277536, 781.03467, 27.283415, 781.03467);
  bezierVertex(124.13953, 781.03467, 211.44664, 742.83795, 275.56265, 680.08612);
  bezierVertex(211.44664, 617.33429, 124.13953, 579.13757, 27.283415, 579.13757);
  bezierVertex(12.277536, 581.86597, 0, 569.58814, 0, 554.58227);
  vertex(883.98248, 682.81421);
  vertex(828.05182, 626.88355);
  bezierVertex(723.01068, 521.84241, 585.22925, 460.45465, 436.53464, 454.99799);
  bezierVertex(431.07794, 540.94074, 398.33786, 620.06238, 347.86352, 682.81421);
  bezierVertex(398.33786, 745.5661, 431.07794, 824.68817, 436.53464, 910.63092);
  bezierVertex(583.86505, 903.81006, 723.01068, 843.7865, 828.05182, 738.74476);
  vertex(883.98248, 682.81421);
  endShape();
  
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 20.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 40;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}
