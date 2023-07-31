const filter = {url: [{hostContains: 'vkplay.live'}]};
const stream = new RegExp(/^(https:\/\/)vkplay.live\/([-a-zA-Z0-9%_&]+)$/);
const transition = ['reload','link','typed','generated'];

function vkplayFunc(data){
  if(stream.test(data.url) === true){
    chrome.tabs.query({currentWindow:true,active:true},([thisTab])=>{
      chrome.scripting.executeScript({
        target: {tabId: thisTab.id},
        func: vkplayTools
      });
    });
  };
};

chrome.webNavigation.onHistoryStateUpdated.addListener(vkplayFunc,filter);

chrome.webNavigation.onCommitted.addListener(details=>{
  if(transition.includes(details.transitionType)){
    chrome.webNavigation.onCompleted.addListener(function onComplete(){
      vkplayFunc(details);
      chrome.webNavigation.onCompleted.removeListener(onComplete);
    });
  };
});

function vkplayTools(){
  setTimeout(()=>{
    let points = document.querySelector('[class^="PointActions_root"]');

    if(points != null){

      function pointsAction(){
        let pointsButton = document.querySelector('[class^="PointActions_buttonBonus"]');
        if(pointsButton != null) pointsButton.click();
      };
      pointsAction();

      let observer = new MutationObserver(pointsObserver);

      function pointsObserver(mutations){
        for(let mutation of mutations){
          if(mutation.type === 'childList') pointsAction();
        }
      };

      observer.observe(points, {childList: true});
    };

    let heartsButton = document.querySelector('[class^="LikeButton_container"]');
    let heartsStatus = document.querySelector('[class*="LikeButton_iconLiked"]');

    if(heartsStatus === null) heartsButton.click();


  },1000);
};
