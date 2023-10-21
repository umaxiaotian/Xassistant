chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-info",
    title: "XAssistantで選択文章を質問する",
    contexts: ["all"]
  });
});


// MODEの説明
// 1.Query = 通常の質問
// 2.Summary = 要約
let context_get_text = { text: "", mode: "Query" }
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // @ts-ignore
  chrome.sidePanel.open({ windowId: tab.windowId })
  context_get_text.text = info.selectionText
  chrome.runtime.sendMessage({ info: context_get_text })
});

//サイドバーが開いてからのファンクション
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "open_side_panel") {
    console.log("Received message:", request.message);
    chrome.runtime.sendMessage({ info: context_get_text })
    context_get_text.text = null
  }
});

