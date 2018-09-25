import simpleBind from 'simplebind.js';

let { bind, registerPlugin, util } = simpleBind;
let state = simpleBind.getState();

const useDevTools = typeof window.__REDUX_DEVTOOLS_EXTENSION__ != 'undefined'; 
let devTools, isBindDueToDevTools = false;
if(useDevTools) { 
  devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({latency: 0});
  devTools.subscribe((message,...args) => {
    if (message.type === 'DISPATCH' && message.state) {
      let newState = JSON.parse(message.state); 
      for(var key in newState) {
        isBindDueToDevTools = true;
        bind(key,newState[key]);
      }
    }
  });
}

let isARepeatKey = name => name.indexOf('__repeat') == 0;

let removeRepeatsFromState = obj => { 
  let newObj = util.extend({},state.boundObjects); 
  Object.keys(newObj).filter(isARepeatKey).forEach(k => delete newObj[k]);
  return newObj;
}; 

let onBind = (objName,obj) => { 
  if(isARepeatKey(objName)) return; 
  var eligibleForDevTools = isBindDueToDevTools == false; 
  if(isBindDueToDevTools) isBindDueToDevTools = false;
  if(!isARepeatKey(objName) && eligibleForDevTools) {
    devTools.send(`${objName}-bound`, removeRepeatsFromState(state.boundObjects))
  } 
  return obj;
};

registerPlugin({
  name: 'reduxDevToolsConnector',
  postBind: onBind
});