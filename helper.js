/** Helper functions **/

let mockIndex = 0;
let values = { delta: [], theta: [], alpha: [], beta: [], gamma: [], ppg: {bpm: []} };

function getMockData(eeg) {
  eeg = {
    ...eeg,
    delta: mockEEG.delta[mockIndex],
    theta: mockEEG.theta[mockIndex],
    alpha: mockEEG.alpha[mockIndex],
    beta: mockEEG.beta[mockIndex],
    gamma: mockEEG.gamma[mockIndex],
  };
  mockIndex = mockIndex >= mockEEG.delta.length ? 0 : mockIndex + 1;
  ppg = {
    bpm: mockEEG.ppg.bpm[mockIndex]
  };
  return eeg;
}

function printValues(count = 500) {
  // count is when to stop collecting data--500 by default
  print(values);
  if (eeg.delta === 0) return; // headset not on
  if (values.delta.length === count) {
    saveJSON(values, "mockData.json", true);
    values = { delta: [], theta: [], alpha: [], beta: [], gamma: [], ppg: {bpm: []} };
    mockIndex = 0;
  } else {
    values.delta.push(eeg.delta);
    values.theta.push(eeg.theta);
    values.alpha.push(eeg.alpha);
    values.beta.push(eeg.beta);
    values.gamma.push(eeg.gamma);
    values.ppg.bpm.push(ppg.heartbeat ? ppg.bpm : 0);
  }
}

function displayData() {
  let tSize = 20;
  let tHeight = 30;
  textSize(tSize / 2);
  text("BATTERY: " + batteryLevel, width - 80, 10);

  textSize(tSize);
  text("DELTA: " + eeg.delta, 10, tSize + (tHeight += tSize));
  text("THETA: " + eeg.theta, 10, tSize + (tHeight += tSize));
  text("ALPHA: " + eeg.alpha, 10, tSize + (tHeight += tSize));
  text("BETA:  " + eeg.beta, 10, tSize + (tHeight += tSize));
  text("GAMMA: " + eeg.gamma, 10, tSize + (tHeight += tSize));

  if (ppg.heartbeat) {
    text("HEART bpm: " + ppg.bpm + " •", 10, tSize + (tHeight += tSize));
  } else {
    text("HEART bpm: " + ppg.bpm, 10, tSize + (tHeight += tSize));
  }
}

function printAllowedFeatures() {
  //testing only
  // printing to see if this browser and website allows web bluetooth 
  console.log(document.featurePolicy.allowedFeatures());
}

function setGradient() {
  const topH = 80;
  const topS = 100 * noise(1000 + frameCount / (eeg.alpha + 500));
  const topB = 80;

  const bottomH = 60;
  const bottomS = 60 * noise(frameCount / (eeg.alpha + 500));
  const bottomB = 80;

  const topColor = color(topH, topS, topB);
  const bottomColor = color(bottomH, bottomS, bottomB);

  for (let y = 0; y < height; y++) {
    let lineH = map(y, 0, height, topH, bottomH);
    let lineS = map(y, 0, height, topS, bottomS);
    let lineB = map(y, 0, height, topB, bottomB);

    stroke(lineH, lineS, lineB);
    line(0, y, width, y);
  }
}
