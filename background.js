"use strict";

function updateIcon(tabID, isTube) {
    if (isTube === true) {
        browser.browserAction.setIcon({
            path: {
                16: "icons/icon_16.png",
                32: "icons/icon_32.png",
                64: "icons/icon_64.png",
                128: "icons/icon_128.png",
            },
            tabId: tabID
        });
        browser.browserAction.setTitle({
            tabId: tabID,
            title: "Open video in separate window...",
        })
        browser.browserAction.enable({
            tabId: tabID
        });
        return;
    }
    browser.browserAction.setIcon({
        path: {
            16: "icons/empty_16.png",
            32: "icons/empty_32.png",
            64: "icons/empty_64.png",
            128: "icons/empty_128.png",
        },
        tabId: tabID
    });
    browser.browserAction.setTitle({
        tabId: tabID,
        title: "No YouTube detected",
    })
    browser.browserAction.disable({
        tabId: tabID
    });
}

function updateActiveTab() {
    browser.tabs.query({ active: true, currentWindow: true })
        .then((tabInfo) => {
            if (tabInfo === undefined || tabInfo === null || tabInfo.length <= 0) {
                throw "unable to get TabInfo";
            }
            tabInfo = tabInfo[0];
            const id = getYouTubeID(tabInfo.url);
            updateIcon(tabInfo.id, id !== undefined && id !== null);
        });
}

function openWindow(tabId, url, title, windowFeatures) {
    console.log(`opening ${url} - ${title} on ${tabId} with ${windowFeatures}`);
    browser.tabs.sendMessage(tabId, {
        action: "open",
        url: url,
        windowTitle: title,
        windowFeatures: windowFeatures,
    });
}

function handleAction() {
    browser.tabs.query({ active: true, currentWindow: true })
        .then((tabInfo) => {
            if (tabInfo === undefined || tabInfo === null || tabInfo.length <= 0) {
                throw "unable to get TabInfo";
            }
            tabInfo = tabInfo[0];

            browser.browserAction.isEnabled({tabId: tabInfo.id}).then((isEnabled) => {
                if (isEnabled !== true) {
                    return;
                }
                const id = getYouTubeID(tabInfo.url);
                if (id === undefined || id === null) {
                    throw "unable to get YouTube ID";
                }

                let windowFeatures = "width=800,height=600,resizable,menubar=0,toolbar=0,personalbar=0,status=0,location=0,scrollbars=0,titlebar=0";
                browser.storage.sync.get("windowFeatures").then((result) => {
                    if (result.windowFeatures !== undefined && result.windowFeatures !== null) {
                        windowFeatures = result.windowFeatures;
                    }
                    openWindow(tabInfo.id, `https://www.youtube.com/embed/${id}`, tabInfo.title, windowFeatures);
                }).catch((error) => {
                    openWindow(tabInfo.id, `https://www.youtube.com/embed/${id}`, tabInfo.title, windowFeatures);
                });
            });
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}
browser.browserAction.onClicked.addListener(handleAction);

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();
