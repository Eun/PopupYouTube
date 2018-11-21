function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        windowFeatures: document.querySelector("#windowFeatures").value,
    });
  }
  
function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#windowFeatures").value = result.windowFeatures || "width=800,height=600,resizable,menubar=0,toolbar=0,personalbar=0,status=0,location=0,scrollbars=0,titlebar=0";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get("windowFeatures");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);