'use strict';
let
pointsEl = document.getElementById('points'),
heartsEl = document.getElementById('hearts'),
recommEl = document.getElementById('recomm'),
buttons = document.querySelectorAll('.button');

chrome.storage.sync.get(['pointsKey']).then((r)=>pointsEl.setAttribute('data-state',r.pointsKey));
chrome.storage.sync.get(['heartsKey']).then((r)=>heartsEl.setAttribute('data-state',r.heartsKey));
chrome.storage.sync.get(['recommKey']).then((r)=>recommEl.setAttribute('data-state',r.recommKey));

buttons.forEach(function(button){
  button.addEventListener('click',()=>{

    switch (button.getAttribute('id')){
      case 'points':
      chrome.storage.sync.get(['pointsKey']).then((r)=>{
        if(r.pointsKey === 'on'){
          chrome.storage.sync.set({pointsKey:'off'});
          pointsEl.setAttribute('data-state','off');
        }
        else if(r.pointsKey === 'off'){
          chrome.storage.sync.set({pointsKey:'on'});
          pointsEl.setAttribute('data-state','on');
        }
      });
      break;
      case 'hearts':
      chrome.storage.sync.get(['heartsKey']).then((r)=>{
        if(r.heartsKey === 'on'){
          chrome.storage.sync.set({heartsKey:'off'});
          heartsEl.setAttribute('data-state','off');
        }
        else if(r.heartsKey === 'off'){
          chrome.storage.sync.set({heartsKey:'on'});
          heartsEl.setAttribute('data-state','on');
        }
      });
      break;
      case 'recomm':
      chrome.storage.sync.get(['recommKey']).then((r)=>{
        if(r.recommKey === 'on'){
          chrome.storage.sync.set({recommKey:'off'});
          recommEl.setAttribute('data-state','off');
        }
        else if(r.recommKey === 'off'){
          chrome.storage.sync.set({recommKey:'on'});
          recommEl.setAttribute('data-state','on');
        };
      });
      break;
    };

  })
});
