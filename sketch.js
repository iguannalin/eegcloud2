// Code from Jason Snell (https://openprocessing.org/sketch/1748494)
let mockEEG;
let isTesting = false;
let isMuseActive = true; // waiting for muse 2 to be active
let img;
let font;
let arduinoOne = "b73009ec-1002-4de7-9aae-c6eb718223a6";
let arduinoTwo = "46b92c3b-4b2c-4e22-9485-de7910b15db6";
let prompts = [
  "What is the memory you keep reliving?",
  "Think of a happy memory.",
  "What is something that is stressing you out?",
];
let promptIndex = 0;

function preload() {
  mockEEG = loadJSON("assets/mockData.json");
  font = loadFont('assets/Inter-Medium.ttf');
  img = loadImage("assets/image.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  colorMode(HSB, 100);
  setupMuse();
  frameRate(3);
}

function draw() {
  if (isTesting) eeg = getMockData(eeg, ppg);
  // printValues(); // records new mockData.json file and saves it

  eeg.delta = Math.abs(eeg.delta / 2.5); // normalize eeg delta numbers
  isMuseActive = (ppg.bpm && ppg.bpm > 20);

  let colorData = calculateHue(isMuseActive);
  displayBackground();
  displayPrompt(prompts[promptIndex]);
  sendData(arduinoOne, colorData);
  // sendData(arduinoTwo, colorData);
  // routeData(colorData);
}

function touchEnded() {
  promptIndex = (promptIndex + 1) % prompts.length;
}

function displayBackground(color = "#5C21C9") {
  if (!isMuseActive) return background("white");
  return background('gray');
}

function displayPrompt(prompt) {
  push();
  rectMode(CENTER);
  textAlign(CENTER);
  textWrap(WORD);
  textSize(24);
  if (isMuseActive) { // muse is on & prompt is chosen
    fill('white');
    translate(width / 2, height / 2);
    if (!prompt) promptIndex = 1;
    text(prompt, 0, 0, 500);
  } else {
    fill('black');
    translate(width / 2, height / 3);
    text("Place the Muse 2 device on your head, and a prompt will be displayed on this screen.\n\nThink about this prompt, and wear the device for as long as you want.", 0, 0, 500);
    imageMode(CENTER);
    image(img, 0, 250, 200, 150);
  }
  pop();
}
