function routeData(hueValue) {
  toSendToRouter = hueValue;
  if (isMuseActive) {
    if (promptIndex > 0) { // prompt is chosen
      sendData(prompts[promptIndex].GUID, hueValue);
      sendData(prompts[promptIndex].groupGUID, hueValue, true);
    }
  } else {
    loadJSON(`https://dweet.io/get/latest/dweet/for/${routerGUID}`, (data) => {
      if (data.with && data.with[0] && data.with[0].content) {
        toSendToRouter = data.with[0].content;
      } else {
        toSendToRouter = hueValue;
      }
    });
  }
  sendData(routerGUID, toSendToRouter);
}

function sendData(GUID, hueValue, sendGroupData = false) {
  if (sendGroupData) {
    loadJSON(`https://dweet.io/get/latest/dweet/for/${GUID}`, (data) => {
      if (data.with && data.with[0] && data.with[0].content) {
        let groupColor = data.with[0].content;
        hueValue.hue1 = (hueValue.hue1 + groupColor.hue1) / 2;
        hueValue.hue2 = (hueValue.hue2 + groupColor.hue2) / 2;
        sendData(GUID, hueValue);
      } else {
        sendData(GUID, hueValue);
      }
    });
  } else {
    let url = `https://dweet.io/dweet/for/${GUID}?${JSON.stringify(hueValue)}`;
    loadJSON(url);
  }
}