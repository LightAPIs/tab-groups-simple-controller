import { getCollapse, type CollapseType } from './db';

const menus: CollapseType[] = ['nothing', 'expand', 'collapse'];

export async function createContextMenu() {
  const gc = await getCollapse();
  menus.forEach(menu => {
    chrome.contextMenus.create({
      id: menu,
      type: 'checkbox',
      checked: gc === menu,
      title: chrome.i18n.getMessage(menu + 'Title'),
      contexts: ['action'],
    });
  });
}

export function updateContextMenu(old: CollapseType, cur: CollapseType) {
  chrome.contextMenus.update(old, {
    checked: false,
  });
  chrome.contextMenus.update(cur, {
    checked: true,
  });
}
