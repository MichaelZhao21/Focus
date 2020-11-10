function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        api: document.getElementById('website').value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.getElementById('website').value = result.api || "";
    }

    function onError(error) {
        console.log(error);
    }

    let getting = browser.storage.sync.get('api');
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector('form').addEventListener("submit", saveOptions);
document.getElementById('save-button').onclick = saveOptions;