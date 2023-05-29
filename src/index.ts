import { getCollapse, setCollapse } from './common/db';
import { createContextMenu, updateContextMenu } from './common/contextMenu';

chrome.runtime.onInstalled.addListener(async details => {
  const { reason } = details;
  if (reason === 'install' || reason === 'update') {
    createContextMenu();
  }
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('browser start up!');
  const gc = await getCollapse();
  if (gc === 'collapse') {
    const tabGroups = await chrome.tabGroups.query({
      collapsed: false,
    });
    console.log(tabGroups);
    tabGroups.forEach(({ id }) => {
      chrome.tabGroups.update(id, {
        collapsed: true,
      });
    });
  } else if (gc === 'expand') {
    const tabGroups = await chrome.tabGroups.query({
      collapsed: true,
    });
    console.log(tabGroups);
    tabGroups.forEach(({ id }) => {
      chrome.tabGroups.update(id, {
        collapsed: false,
      });
    });
  }
});

chrome.action.onClicked.addListener(async ({ windowId }) => {
  const tabGroups = await chrome.tabGroups.query({
    windowId,
  });
  console.log(tabGroups);
  if (tabGroups.length === 0) {
    return;
  }
  const e: number[] = [];
  const c: number[] = [];
  tabGroups.forEach(({ id, collapsed }) => {
    if (collapsed) {
      c.push(id);
    } else {
      e.push(id);
    }
  });

  if (c.length > e.length) {
    c.forEach(item => {
      chrome.tabGroups.update(item, {
        collapsed: false,
      });
    });
  } else {
    e.forEach(item => {
      chrome.tabGroups.update(item, {
        collapsed: true,
      });
    });
  }
});

chrome.contextMenus.onClicked.addListener(async ({ menuItemId }) => {
  const old = await getCollapse();
  if (menuItemId !== old) {
    const cur = await setCollapse(menuItemId.toString());
    updateContextMenu(old, cur);
  }
});
