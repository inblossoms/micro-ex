import { handlerRouter } from "./handler-router";
import { rewriteRouter } from "./rewrite-router";

let instance = [];

/**
 *  Return child app instance.
 */
export function getIns() {
  return instance;
}

export const start = () => {
  // 运行原理
  // 1. 监视路由变化
  // 	hash 路由：window.onhashchange
  //	history 路由：
  //		history.go history.back history.forword
  // 		使用 popstate 事件: window.onpopstate 来监听以上变动，且只能在用户手动触发时监听到
  //	  对于 pushState replaceState 无法通过 popstate 监听到，则需要通过函数重写的方式进行劫持

  // 不可以通过 windows.onpopstate 来注册 会覆盖事件本来的行为
  rewriteRouter();

  // 当 路径指向子路由时刷新页面 路由时不会被监听到的 所以需要手动执行
  handlerRouter();
};

export const regiserMicroApps = (props, event) => {
  instance = props;
};
