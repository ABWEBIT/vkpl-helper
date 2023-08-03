const filter = {url: [{hostContains: 'vkplay.live'}]};
const stream = new RegExp(/^(https:\/\/)vkplay.live\/([-a-zA-Z0-9%_&.]+)$/);
const transition = ['reload','generated','start_page'];

function vkplayFunc(data){
  if(stream.test(data.url) === true){
    chrome.scripting.executeScript({
      target: {tabId: data.tabId},
      func: vkplayTools
    });
  };
};

chrome.webNavigation.onHistoryStateUpdated.addListener(details=>{
  vkplayFunc(details);
},filter);

chrome.webNavigation.onCommitted.addListener(details=>{
  if(transition.includes(details.transitionType)) vkplayFunc(details);
},filter);


function vkplayTools(){

  setTimeout(()=>{
    // баллы
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

    // сердечко
    let heartsButton = document.querySelector('[class^="LikeButton_container"]');
    if(heartsButton != null){
      let heartsStatus = document.querySelector('[class*="LikeButton_iconLiked"]');
      if(heartsStatus === null) heartsButton.click();
    };


  },1000);
};
