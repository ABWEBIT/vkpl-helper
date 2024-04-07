const filter = {url: [{hostContains: '.vkplay.ru'}]};
const stream = new RegExp(/^(https:\/\/)live.vkplay.ru\/([-a-zA-Z0-9%_&.]+)$/);
const transition = ['reload','generated','start_page'];

chrome.storage.sync.get(['loot']).then((result)=>{
  if(result.loot == null || chrome.runtime.lastError){
    chrome.storage.sync.set({loot:'on'});
  }
});

chrome.storage.sync.get(['like']).then((result)=>{
  if(result.like == null || chrome.runtime.lastError){
    chrome.storage.sync.set({like:'on'});
  }
});

function vkplayFunc(data){
  if(stream.test(data.url) === true){
    chrome.scripting.executeScript({
      target: {tabId: data.tabId},
      func: vkplayHelper
    });
  };
};

chrome.webNavigation.onHistoryStateUpdated.addListener(details=>{
  vkplayFunc(details);
},filter);

chrome.webNavigation.onCommitted.addListener(details=>{
  if(transition.includes(details.transitionType)) vkplayFunc(details);
},filter);

function vkplayHelper(){

  // баллы
  let intervalPoints = setInterval(()=>{
    chrome.storage.sync.get(['loot']).then((result)=>{
      if(result.loot != 'off' && !chrome.runtime.lastError){
        let points = document.querySelector('[class^="PointActions_root"]');
        if(points != null){
          let pointsButton = document.querySelector('[class^="PointActions_buttonBonus"]');
          if(pointsButton != null){
            if(intervalPoints) clearInterval(intervalPoints);
            pointsButton.click();
          };
          let observer = new MutationObserver(pointsObserver);
          function pointsObserver(mutations){
            for(let mutation of mutations){
              if(mutation.type === 'childList'){
                let pointsButton = document.querySelector('[class^="PointActions_buttonBonus"]');
                if(pointsButton != null){
                  if(intervalPoints) clearInterval(intervalPoints);
                  pointsButton.click();
                };
              }
            }
          };
          observer.observe(points, {childList: true});
        };
      };
    });
  },1000);
  intervalPoints;

  // сердечко
  let intervalHeart = setInterval(()=>{
    chrome.storage.sync.get(['like']).then((result)=>{
      if(result.like != 'off' && !chrome.runtime.lastError){
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
