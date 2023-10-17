import {handlerRouter} from './handler-router';

let prevRoute = '';
let nextRoute = window.location.pathname;

export function getPrevRoute() {
  return prevRoute;
}

export function getNextRoute() {
  return nextRoute;
}

export function rewriteRouter() {
  // popstate 被触发时 路由已经发生了变化
  window.addEventListener('popstate', () => {
    prevRoute = nextRoute
    nextRoute = window.location.pathname
    handlerRouter();
  });

  const rawPushState = window.history.pushState,
    rawReplaceState = window.history.replaceState;

  window.history.pushState = (...args) => {
    prevRoute = window.location.pathname;
    rawPushState.apply(window.history, args);
    nextRoute = window.location.pathname;

    handlerRouter();
  };

  window.history.replaceState = (...args) => {
    prevRoute = window.location.pathname;
    rawReplaceState.apply(window.history, args);
    nextRoute = window.location.pathname;

    handlerRouter();
  };
}
