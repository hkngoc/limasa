function showImage(id, url) {
  chrome.tabs.sendMessage(id, { type: 'showImage', id: id, url: url });
}

function onOpenImage(info, tab) {
  showImage(tab.id, info.srcUrl);
}

chrome.contextMenus.create({
  title: "Open image in Limasa",
  contexts: ["image"],
  type : "normal",
  onclick: onOpenImage
});
