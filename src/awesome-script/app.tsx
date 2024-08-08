import { createEffect, createSignal, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';
import globalCss from './style.css';
import { stylesheet } from './style.module.css';
import { urlFunctionality } from './function';

const main = () => {
  const [getCurrentUrl, setCurrentUrl] = createSignal(window.location.href);

  const updateUrl = () => setCurrentUrl(window.location.href);

  window.addEventListener('popstate', updateUrl);
  window.addEventListener('hashchange', updateUrl);
  onCleanup(() => {
    window.removeEventListener('popstate', updateUrl);
    window.removeEventListener('hashchange', updateUrl);
  });

  function MainPanel() {
    const [getFunctional, setFunctional] = createSignal([]);

    createEffect(() => {
      const currentUrl = getCurrentUrl();
      const functions = urlFunctionality.getFunctionsForUrl(currentUrl);
      setFunctional(functions);
    });

    return (
      <div>
        <p>Linkedin scripts</p>
        <ul>
          {getFunctional().map((func, index) => (
            <li
              key={index}
              onclick={() => func.execute()}
              style={{ cursor: 'pointer' }}
            >
              {func.humanReadName()}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const panel = getPanel({
    theme: 'dark',
    style: [globalCss, stylesheet].join('\n'),
  });
  Object.assign(panel.wrapper.style, {
    top: '10vh',
    left: '10vw',
  });
  panel.setMovable(true);
  panel.show();

  render(MainPanel, panel.body);
};

if (window.self === window.top) {
  main();
}
