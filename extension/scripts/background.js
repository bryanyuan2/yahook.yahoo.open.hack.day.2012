// chrome.tabs.onUpdated.addListener(function(tabId) {
// 	jAlert('This is a custom alert box', 'Alert Dialog');
// 	chrome.tabs.get(tabId, function(tab) {
// 		if (tab.url.search("facebook.com") > 0) {
// 			jAlert('This is a custom alert box', 'Alert Dialog');
// 			chrome.tabs.executeScript(tab.id, {file: "contentscript.js"});
// 		}
// 	});
// });
var original_tab_url = {};
var checkForValidUrl = function (tabId, changeInfo, tab) {
    if (tab.url != original_tab_url[tabId]) {
        if (tab.url.indexOf('www.facebook.com/pages/') > -1 ||
            tab.url.indexOf('www.facebook.com/events/') > -1) {
		    chrome.tabs.reload(tab.id);
        }

        original_tab_url[tabId] = tab.url;
    }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);
