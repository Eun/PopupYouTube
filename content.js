"use strict";

browser.runtime.onMessage.addListener(request => {
    if (request.action !== 'open') {
        return;
    }
    if (request.url === undefined || request.url === null) {
        return;
    }
    if (request.windowTitle === undefined || request.windowTitle === null) {
        return;
    }
 
    window.open(request.url, request.windowTitle, request.windowFeatures)
    return Promise.resolve();
  });