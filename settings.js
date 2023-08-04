'use strict';
let
loot = document.getElementById('loot'),
like = document.getElementById('like'),
buttons = document.querySelectorAll('.button');

chrome.storage.sync.get(['loot']).then((result)=>{
  loot.setAttribute('data-state',result.loot);
  console.log(result.loot);
});
chrome.storage.sync.get(['like']).then((result)=>{
  like.setAttribute('data-state',result.like);
  console.log(result.loot);
});

buttons.forEach(function(button){
  button.addEventListener('click',()=>{
    chrome.storage.sync.get([button.getAttribute('id')]).then((result)=>{
      if(result && button.getAttribute('id') === 'loot'){
        if(result.loot === 'on'){
          chrome.storage.sync.set({loot:'off'});
          loot.setAttribute('data-state','off');
        }
        else if(result.loot === 'off'){
          chrome.storage.sync.set({loot:'on'});
          loot.setAttribute('data-state','on');
        }
      }
      else if(result && button.getAttribute('id') === 'like'){
        if(result.like === 'on'){
          chrome.storage.sync.set({like:'off'});
          like.setAttribute('data-state','off');
        }
        else if(result.like === 'off'){
          chrome.storage.sync.set({like:'on'});
          like.setAttribute('data-state','on');
        }
      };
    });
  })
});