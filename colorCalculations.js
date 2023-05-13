/** Color calc. functions **/

let avg = 0;
let channels = ["delta", "theta", "alpha", "beta", "gamma"];

let hues = { 0: 70, 1: 250, 2: 0, 3: 190 };

let left = 0;
let right = 1;

function calculateHue(active) {
  if (!active) {
    return {"hue1": 130, "hue2": 130};
  }
  channels.forEach((c) => {
    avg += eeg[c];
  });

  avg /= channels.length;
  avg -= 20;

  if (eeg.alpha >= avg) {
    right = left;
    left = 1;
  }
  if (eeg.theta >= avg) {
    right = left;
    left = 2;
  }
  if (eeg.delta >= avg && eeg.beta >= avg && eeg.gamma >= avg) {
    right = left;
    left = 3;
  }

  // get the left and right closest hardset hues
  const leftHue = hues[constrain(left, 0, 4)];
  const rightHue = hues[constrain(right, 0, 4)];
  return {"hue1": leftHue, "hue2": rightHue};
}