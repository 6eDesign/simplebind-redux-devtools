(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('simplebind.js')) :
  typeof define === 'function' && define.amd ? define(['simplebind.js'], factory) :
  (factory(global.simpleBind));
}(this, (function (simpleBind) { 'use strict';

  simpleBind = simpleBind && simpleBind.hasOwnProperty('default') ? simpleBind['default'] : simpleBind;

  var bind = simpleBind.bind;
  var registerPlugin = simpleBind.registerPlugin;
  var util = simpleBind.util;
  var state = simpleBind.getState();

  var useDevTools = typeof window.__REDUX_DEVTOOLS_EXTENSION__ != 'undefined'; 
  var devTools, isBindDueToDevTools = false;
  if(useDevTools) { 
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({latency: 0});
    devTools.subscribe(function (message) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      if (message.type === 'DISPATCH' && message.state) {
        var newState = JSON.parse(message.state); 
        for(var key in newState) {
          isBindDueToDevTools = true;
          bind(key,newState[key]);
        }
      }
    });
  }

  var isARepeatKey = function (name) { return name.indexOf('__repeat') == 0; };

  var removeRepeatsFromState = function (obj) { 
    var newObj = Object.keys(obj).reduce(function (newObj,key) { 
      if(!isARepeatKey(key)) { newObj[key] = obj[key]; } 
      return newObj;
    },{}); 
    return newObj;
  }; 

  var onBind = function (objName,obj) { 
    if(isARepeatKey(objName)) { return; } 
    var eligibleForDevTools = isBindDueToDevTools == false; 
    if(isBindDueToDevTools) { isBindDueToDevTools = false; }
    if(!isARepeatKey(objName) && eligibleForDevTools) {
      devTools.send((objName + "-bound"), removeRepeatsFromState(state.boundObjects));
    } 
    return obj;
  };

  registerPlugin({
    name: 'reduxDevToolsConnector',
    postBind: onBind
  });

})));
//# sourceMappingURL=simplebind-redux-devtools.umd.js.map
