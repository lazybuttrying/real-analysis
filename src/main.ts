import './style.css';
import { catalog } from './catalog';
import { chapterUrl } from './paths';
import { h } from './shell/dom';

const BASE = import.meta.env.BASE_URL;
const root = document.getElementById('app');
if (!root) throw new Error('#app 을 찾을 수 없습니다');

root.replaceChildren(
  h(
    'main',
    { class: 'home' },
    h('h1', {}, 'Real Analysis'),
    h('p', {}, '해석학의 개념을 직접 움직여 보며 익히는 인터랙티브 시각화 모음입니다.'),
    h(
      'ul',
      {},
      ...catalog.map((chapter) =>
        h('li', {}, h('a', { href: chapterUrl(BASE, chapter.id) }, chapter.title), ` — ${chapter.summary}`),
      ),
    ),
  ),
);
