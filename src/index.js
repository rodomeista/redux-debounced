"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
    let timers = {};

    const middleware = () => dispatch => action => {
      const {
        meta: { debounce={} }={},
        type
      } = action;

      const {
        time,
        key = type,
        cancel = false,
        leading = false,
        trailing = true
      } = debounce;

      const shouldDebounce = ((time && key) || (cancel && key)) && (trailing || leading);
      const dispatchNow = leading && !timers[key];

      const later = () => {
        if (trailing && !dispatchNow) {
          dispatch(action);
        }
        timers[key] = null;
      }

      if (!shouldDebounce) {
        return dispatch(action);
      }

      if (timers[key]) {
        clearTimeout(timers[key]);
        timers[key] = null;
      }

      if (!cancel) {
        if (dispatchNow) {
          dispatch(action);
        }

        timers[key] = setTimeout(later, time);
      }
    };

    middleware._timers = timers;

    return middleware;
};

