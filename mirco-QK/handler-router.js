import {importHTML} from './import-html';
import {getIns} from './index';
import {getNextRoute, getPrevRoute} from './rewrite-router';

/**
 *  Process route changes
 */
export async function handlerRouter() {
  const apps = getIns();

  // 处理路由变化：子应用的切换需要保证
  // - 切换下一个应用之前卸载上一个
  const prevApp = apps.find((app) => {
    return getPrevRoute().startsWith(app.activeRule)
  })

  // - 上一个应用卸载后 通过路由加载新应用
  //   1. 匹配子应用
  //   1.1 获取当前路由路径 https://developer.mozilla.org/zh-CN/docs/Web/API/Location
  // const pathName = window.location.pathname;
  //   1.2 获取子应用信息
  //   1.2.1 匹配子应用路径
  const app = apps.find((app) => getNextRoute().startsWith(app.activeRule));

  if (prevApp) await _unmount(prevApp)
  if (!app) return;

  //   2. 请求获取 entry： 资源
  const {template, execScript} = await importHTML(app.entry);

  const container = document.querySelector(app.container);
  // 2.1 加载子应用
  container.appendChild(template);

  const {bootstrap, mount, unmount} = await execScript();
  // 配置全局环境变量
  //   qiankunWindow.__POWERED_BY_QIANKUN__ = true; // qiankunWindow 是在 qiankun 子应用实例被挂载的时候创建的
  window.__POWERED_BY_QIANKUN__ = true
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + '/'

  app.bootstrap = bootstrap;
  app.mount = mount;
  app.unmount = unmount;

  await _bootstrap(app)
  await _mount(app)
  //   3. 渲染到容器中：container
}

async function _bootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}

async function _mount(app) {
  app.mount && (await app.mount({
    container: document.querySelector(app.container)
  }));
}

async function _unmount(app) {
  app.unmount && (await app.unmount({
    container: document.querySelector(app.container)
  }));
}
