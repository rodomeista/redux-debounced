"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var timers = {};

  var middleware = function middleware() {
    return function (dispatch) {
      return function (action) {
        var _action$meta = action.meta;
        _action$meta = _action$meta === undefined ? {} : _action$meta;
        var _action$meta$debounce = _action$meta.debounce,
            debounce = _action$meta$debounce === undefined ? {} : _action$meta$debounce,
            type = action.type;
        var time = debounce.time,
            _debounce$key = debounce.key,
            key = _debounce$key === undefined ? type : _debounce$key,
            _debounce$cancel = debounce.cancel,
            cancel = _debounce$cancel === undefined ? false : _debounce$cancel,
            _debounce$leading = debounce.leading,
            leading = _debounce$leading === undefined ? false : _debounce$leading,
            _debounce$trailing = debounce.trailing,
            trailing = _debounce$trailing === undefined ? true : _debounce$trailing;


        var shouldDebounce = (time && key || cancel && key) && (trailing || leading);
        var dispatchNow = leading && !timers[key];

        var later = function later() {
          return new Promise(function (resolve) {
            if (trailing && !dispatchNow) {
              resolve(dispatch(action));
            }
            timers[key] = null;
          });
        };

        if (!shouldDebounce) {
          return dispatch(action);
        }

        if (timers[key]) {
          clearTimeout(timers[key]);
          timers[key] = null;
        }

        if (!cancel) {
          return new Promise(function (resolve) {

            if (dispatchNow) {
              resolve(dispatch(action));
            }

            timers[key] = setTimeout(later, time);
          });
        }
      };
    };
  };

  middleware._timers = timers;

  return middleware;
};