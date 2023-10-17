import {fetchResource} from './utils';

export async function importHTML(url) {
  const html = await fetchResource(url);
  const template = document.createElement('div');
  // 出于浏览器的安全机制 script 中的 Js 脚本代码是不会被自动执行 需要手动调用
  template.innerHTML = html;

  // 提取 script 元素中的 Js 脚本
  const scripts = template.querySelectorAll('script');

  async function getExternalScripts() {
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute('src');
        // <script type="text/javascript"></script>
        if (!src) return Promise.resolve(script.innerHTML);
        // <script src="https://www.baidu.com"></script>
        // <script src="./index.js"></script>
        return fetchResource(src.startsWith('http') ? src : `${url}${src}`);
      })
    );
  }

  // 执行 script 脚本代码
  async function execScript() {
    const scripts = await getExternalScripts();

    for (const code of scripts) {
      const module = {
          exports: {}
        },
        exports = module.exports;

      eval(code);

      return module.exports;
    }
  }

  return {
    template,
    getExternalScripts,
    execScript
  };
}
