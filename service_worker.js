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
  chrome.storage.sync.get(['recommKey']).then((r)=>{
    let channelsRoot = document.querySelector('[class*="Channels_root"]');
    if(r.recommKey !== 'off' && !chrome.runtime.lastError){
      if(channelsRoot !== null){
        channelsRoot.querySelectorAll('[class^="Channels_title"]')[1].style.display = "none";
        channelsRoot.querySelectorAll('[class^="ChannelsList_container"]')[1].style.display = "none";
      };
    }
    else if(r.recommKey === 'off' && !chrome.runtime.lastError){
      if(channelsRoot !== null){
        channelsRoot.querySelectorAll('[class^="Channels_title"]')[1].style.display = "flex";
        channelsRoot.querySelectorAll('[class^="ChannelsList_container"]')[1].style.display = "flex";
      };
    };
  });
}

function vkPlayLiveStreamHelper(){

  // баллы
  let intervalPoints = setInterval(()=>{
    chrome.storage.sync.get(['points']).then((result)=>{
      if(result.points != 'off' && !chrome.runtime.lastError){
        let pointsObject = document.querySelector('[class^="PointActions_root"]');
        if(pointsObject != null){
          const pointsCollecting=()=>{
            let pointsButton = document.querySelector('[class^="PointActions_buttonBonus"]');
            if(pointsButton != null){
              if(intervalPoints) clearInterval(intervalPoints);
              pointsButton.click();
            };
          };
          pointsCollecting();
          let observer = new MutationObserver(pointsObserver);
          function pointsObserver(mutations){
            for(let mutation of mutations){
              if(mutation.type === 'childList') pointsCollecting();
            }
          };
          observer.observe(pointsObject, {childList: true});
        };
      };
    });
  },1000);
  intervalPoints;

  // сердечко
  let intervalHeart = setInterval(()=>{
    chrome.storage.sync.get(['heart']).then((result)=>{
      if(result.heart != 'off' && !chrome.runtime.lastError){
        let heartButton = document.querySelector('[class^="LikeButton_container"]');
        if(heartButton != null){
          if(intervalHeart) clearInterval(intervalHeart);
          let heartStatus = document.querySelector('[class*="LikeButton_iconLiked"]');
          if(heartStatus === null){
            heartButton.click();
          };
        };
      };
    });
  },1000);
  intervalHeart;

};
