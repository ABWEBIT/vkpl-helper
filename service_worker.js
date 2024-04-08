const filter = {url: [{hostContains: '.vkplay.ru'}]};
const vkPlayLiveSite = new RegExp(/^(https:\/\/)live.vkplay.ru*/);
const vkPlayLiveStream = new RegExp(/^(https:\/\/)live.vkplay.ru\/([-a-zA-Z0-9%_&.]+)$/);
const transition = ['reload','generated','start_page'];

chrome.storage.sync.get(['pointsKey']).then((r)=>{
  if(r.pointsKey == null || chrome.runtime.lastError) chrome.storage.sync.set({pointsKey:'on'});
});

chrome.storage.sync.get(['heartsKey']).then((r)=>{
  if(r.heartsKey == null || chrome.runtime.lastError) chrome.storage.sync.set({heartsKey:'on'});
});

chrome.storage.sync.get(['recommKey']).then((r)=>{
  if(r.recommKey == null || chrome.runtime.lastError) chrome.storage.sync.set({recommKey:'off'});
});

function vkplayFunc(data){

  if(vkPlayLiveSite.test(data.url) === true){
    chrome.scripting.executeScript({
      target: {tabId: data.tabId},
      func: vkPlayLiveSiteHelper
    });
  };

  if(vkPlayLiveStream.test(data.url) === true){
    chrome.scripting.executeScript({
      target: {tabId: data.tabId},
      func: vkPlayLiveStreamHelper
    });
  };
};

chrome.webNavigation.onHistoryStateUpdated.addListener(details=>{
  vkplayFunc(details);
},filter);

chrome.webNavigation.onCommitted.addListener(details=>{
  if(transition.includes(details.transitionType)) vkplayFunc(details);
},filter);

function vkPlayLiveSiteHelper(){
  // рекомендации
  let channelsRoot = document.querySelector('[class*="Channels_root"]');
  if(channelsRoot){
    let channelsPanel=()=>{
      chrome.storage.sync.get(['recommKey']).then((r)=>{
        if(r.recommKey === 'on' && !chrome.runtime.lastError){
          let channelsTitle = channelsRoot.querySelectorAll('[class*="Channels_title"]')[1];
          if(channelsTitle) channelsTitle.style.display = "none";
          let channelsList = channelsRoot.querySelectorAll('[class*="ChannelsList_container"]')[1];
          if(channelsList) channelsList.style.display = "none";
          let channelsPortal = channelsRoot.querySelector('[class*="Channels_portalBtn"]');
          if(channelsPortal) channelsPortal.style.display = "none";
          let channelsIconRecommended = channelsRoot.querySelector('[class*="Channels_iconRecommended"]');
          if(channelsIconRecommended) channelsIconRecommended.style.height = "0px";
        };
      });
    };
    channelsPanel();

    let observerChannels = new MutationObserver(channelsObserverFunc);
    function channelsObserverFunc(mutations){
      for(let mutation of mutations){
        if(mutation.type === 'childList') channelsPanel();
      }
    };
    observerChannels.observe(channelsRoot,{childList: true});
  };
};

function vkPlayLiveStreamHelper(){

  // баллы
  let pointsInterval = setInterval(()=>{
    let pointsButton = document.querySelector('[class*="PointActions_root"]');
    if(pointsButton){
      if(pointsInterval) clearInterval(pointsInterval);

      chrome.storage.sync.get(['pointsKey']).then((r)=>{
        if(r.pointsKey === 'on' && !chrome.runtime.lastError){

          let pointsCollecting=()=>{
            let pointsButton = document.querySelector('[class*="PointActions_buttonBonus"]');
            if(pointsButton) pointsButton.click();
          };
          pointsCollecting();

          let observerPoints = new MutationObserver(pointsObserverFunc);
          function pointsObserverFunc(mutations){
            for(let mutation of mutations){
              if(mutation.type === 'childList') pointsCollecting();
            }
          };
          observerPoints.observe(pointsButton,{childList: true});

        };
      });

    };
  },500);

  // сердечко
  let heartsInterval = setInterval(()=>{
    let heartsButton = document.querySelector('[class*="LikeButton_container"]');
    if(heartsButton){
      if(heartsInterval) clearInterval(heartsInterval)
      chrome.storage.sync.get(['heartsKey']).then((r)=>{
        if(r.heartsKey === 'on' && !chrome.runtime.lastError){
          let heartStatus = heartsButton.querySelector('[class*="LikeButton_iconLiked"]');
          if(heartStatus == null) heartsButton.click();
        };
      });
    };
  },500);

  setTimeout(()=>{
    if(pointsInterval) clearInterval(pointsInterval);
    if(heartsInterval) clearInterval(heartsInterval);
  },5000);

};
