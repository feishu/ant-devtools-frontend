import { ipcRenderer as ipc } from 'electron';
import installGlobalReactHook from './installReactHook';
import componentsMap from './componentsMap.json';
import attachRenderer from './attachRenderer';

const getData = require('./getData');

installGlobalReactHook();

// check devicePixelRatio
console.log('devicePixelRatio', window.devicePixelRatio);

const disposes = [];

window.ipc = ipc;

let container;
let render = null;
const rootNodeIDMap = new Map();

window.rootNodeIDMap = rootNodeIDMap;

let updateQueue = [];

// We can not get styles form the context of react component.
// So we make it by ourselves.
const nodeIdForDom = new Map();
const appxForNodeId = new Map();

window.appxForNodeId = appxForNodeId;

// React devtools gloabl hook.
// The hook is setupped before the <head> dom ready,
// so it can not be install here.
// See installReactHook.js.
const globalHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

globalHook.on('root', ({renderer, internalInstance}) => {
});
globalHook.on('unmount', ({ internalInstance }) => {
});
globalHook.on('mount', ({ internalInstance, data }) => {
});
globalHook.on('update', ({ internalInstance, data }) => {

  if (data.props && data.props.$tag && data.nodeType === 'Composite') {
    const oldProps = internalInstance.memoizedProps;
    let nodeId = appxForNodeId.get(internalInstance);
    // while nodeId is not found, maybe it is the owner of this instance.
    // so we get out of this intance to check once more.
    if (!nodeId)
      nodeId = appxForNodeId.get(internalInstance._debugOwner);
    if (nodeId) {
      if (!oldProps) {
        sendMessage({
          method: 'propsModified',
          payload: {
            nodeId,
            props: filterProps(data.props.$tag, data.props),
          },
        });
      } else {
        for (const key of Object.keys(oldProps)) {
          if (oldProps[key] !== data.props[key]) {
            sendMessage({
              method: 'propsModified',
              payload: {
                nodeId,
                props: filterProps(data.props.$tag, data.props),
              },
            });
            break;
          }
        }
      }
    }
  }
});
globalHook.on('renderer-attached', ({ id, renderer, helpers }) => {
  helpers.walkTree(
    (component, dataType) => {},
    (instance) => {},
  );
});

function setupBackend(hook) {
  var oldReact = window.React && window.React.__internals;
  if (oldReact && Object.keys(hook._renderers).length === 0) {
    hook.inject(oldReact);
  }

  for (var rid in hook._renderers) {
    hook.helpers[rid] = attachRenderer(hook, rid, hook._renderers[rid]);
    hook.emit('renderer-attached', {id: rid, renderer: hook._renderers[rid], helpers: hook.helpers[rid]});
  }

  hook.on('renderer', ({id, renderer}) => {
    hook.helpers[id] = attachRenderer(hook, id, renderer);
    hook.emit('renderer-attached', {id, renderer, helpers: hook.helpers[id]});
  });

  var shutdown = () => {
    for (var id in hook.helpers) {
      hook.helpers[id].cleanup();
    }
    hook.off('shutdown', shutdown);
  };
  hook.on('shutdown', shutdown);

  ipc.sendToHost('main', 'load-end');

  return true;
}

function findOwner(fiber) {
  if (fiber && fiber.memoizedProps.$tag) {
    return fiber;
  }
  return findOwner(fiber._debugOwner);
}

function handleTinyElemets(dom, getReactElementFromNative) {
  try {
    const fiber = getReactElementFromNative(dom);
    console.log(fiber);
    if (
      fiber &&
      fiber.memoizedProps &&
      fiber.memoizedProps.$tag) return fiber;
    return findOwner(fiber);
  } catch (e) {
    throw new Error(e);
  }
}

function handleStringChildren(children) {
  if (!children) return '';
  if (typeof children === 'string')
    return children;
  if (Array.isArray(children) && typeof children[0] === 'string')
    return children.join('');
}

function getTinyData(fiber) {
  const name = fiber.memoizedProps['$tag'];

  console.log(fiber);

  const props = getProps(fiber);
  if (!props) return null;

  // 这里需要特殊处理一些 DOM.Node 上面的数据从而使的该节点下面的 child 不被暴露出来
  switch (name) {
    case 'view':
    case 'scroll-view':
    case 'label':
    case 'navigator':
    case 'picker-view':
    case 'picker':
    case 'form':
    case 'radio-group':
    case 'checkbox-group':
    case 'swiper':
    case 'swiper-item':
      break;
    case 'text':
    case 'button':
      props['_childNodeCount'] = 1;
      props['_textValue'] = handleStringChildren(fiber.memoizedProps.children);
      break;
    default:
      props['_childNodeCount'] = 0;
      props['_childNodeValue'] = handleStringChildren(fiber.memoizedProps.children);
      break;
  }

  return {
    name,
    props,
  };
};

function filterProps(name, props, noText) {
  const filteredProps = {};
  const allProps = componentsMap[name];
  Object.keys((allProps && allProps.attributions) || []).forEach((index) => {
    const prop = allProps.attributions[index];
    const propKey = (prop.label || '').replace(/\-([a-z])/g, (all, letter) => {
      return letter.toUpperCase();
    })
    if (props[propKey] || props[propKey] !== 'none' || props[propKey] !== false)
      filteredProps[propKey] = props[propKey];
  });

  ['className'].forEach(prop => {
    if (props[prop] && props[prop] !== 'none' && props[prop].trim() !== `a-${name}`)
      filteredProps[prop] = props[prop].replace(`a-${name}`, '').trim();
  });

  if (!noText)
    filteredProps._textChildren = typeof props.children === 'string' ? props.children : '';

  return filteredProps;
}

function getProps(fiber) {
  const name = fiber.memoizedProps['$tag'];
  if (!fiber || !name) throw new Error('devtools: getProps not found the $tag from', element);
  const allProps = componentsMap[name];
  const props = filterProps(name, fiber.memoizedProps);

  try {
    const ariaProps = fiber.memoizedProps.$appx.getAriaProps();
    Object.keys(ariaProps).forEach(key => {
      if (key.match(/^aria/))
        props[`${key}`] = ariaProps[key];
      else
        props[`aria-${key}`] = ariaProps[key];
    });
  } catch (e) {}
  return props;
}

const sendMessage = ({ method, payload, error }) => {
  ipc.sendToHost('devtools', {
    method, payload, error,
  })
}

function mappingDomToNodeId(root, dom) {
  nodeIdForDom.set(root.nodeId, dom);
  if (root.children && root.children.length > 0) {
    root.children.forEach((next, index) => {
      mappingDomToNodeId(next, dom.children[index]);
    })
  }
}

function mappingDomToNodeIdChildren(parent, children, getReactElementFromNative, nodeType) {
  if (!parent) return;
  const reactComponents = [];
  if (nodeType === 'swiper') {
    parent = parent.children[0].children[0];
  }
  if (nodeType === 'swiper-item') {
    parent = parent.children[0];
  }
  if (nodeType === 'picker-view-column') {
    parent = parent.children[2];
  }
  if (children && children.length > 0) {
    children.forEach((next, index) => {
      reactComponents.push('');
      nodeIdForDom.set(next.nodeId, parent.children[index]);
      if (nodeType === 'swiper') { return reactComponents; }
      try {
        const fiber = handleTinyElemets(parent.children[index], getReactElementFromNative);
        const speHandled = elementSpecailHandler(fiber);
        if (nodeType !== 'picker-view-column' && nodeType !== 'picker-view')
          appxForNodeId.set(fiber, next.nodeId);
        reactComponents[reactComponents.length - 1] = getTinyData(speHandled);
      } catch (e) { console.error(e); }
    });
  }
  return reactComponents;
}

function elementSpecailHandler(fiber, id) {
  if (fiber.memoizedProps && fiber.memoizedProps.$tag === 'image') {
    return fiber._debugOwner;
  }
  return fiber;
}

function detectGetReactElementFromNative(dom) {
  const help = globalHook.helpers[render];
  if (help) {
    let reactComponent = null;
    try {
      reactComponent = help.getReactElementFromNative(dom);
    } catch (e) { console.error('detect', e); return {}; }
    if (reactComponent) {
      return {
        getReactElementFromNative: help.getReactElementFromNative,
        rootReactDom: reactComponent,
      }
    }
  }
  return {};
}

let count = 0;
let initReady = false;
const maxTryOut = 10;

function checkReactRenderFromHook(hook) {
  let ready = false;
  if (!hook || !hook._fiberRoots) return null;
  for (const k of Object.keys(hook._fiberRoots)) {
    const fibers = hook._fiberRoots[k];
    for (const fiber of fibers) {
      if (fiber.containerInfo && fiber.containerInfo.id === '__react-content') {
        ready = true;
        break;
      }
    }
    if (ready) return k;
  }
  return null;
}

function checkReactReady(callback) {
  if (count === maxTryOut) return callback(false);
  count++;
  try {
    const rootDom = document.getElementById('__react-content');
    render = checkReactRenderFromHook(globalHook);
    if (!render)
      throw new Error('react is not ready');
    const { getReactElementFromNative } = detectGetReactElementFromNative(rootDom.children[0].children[0]);
    if (getReactElementFromNative && window.__chromePort__) {
      count = 0;
      callback(true);
    } else {
      setTimeout(function() {
        checkReactReady(callback);
      }, 1000);
    }
  } catch (e) {
    setTimeout(function() {
      checkReactReady(callback);
    }, 1000);
  }
}

const messageHandler = {
  initOnce: () => {
    checkReactReady((ready) => {
      if (ready) {
        initReady = true;
        sendMessage({
          method: 'initOnce',
          payload: {
            filePath: window.$page.getPagePath(),
            path: window.location.href,
          },
        })
      } else {
        sendMessage({
          error: 'react is not ready',
        })
      }
    })
  },
  refresh: () => {
    nodeIdForDom.clear();
    appxForNodeId.clear();
    rootNodeIDMap.clear();
    sendMessage({ method: 'switchTarget' });                  
  },
  setDocumentNodeIdOnce: ({ root }) => {
    const rootDom = document.getElementById('__react-content');
    const { rootReactDom } = detectGetReactElementFromNative(rootDom.children[0]);

    nodeIdForDom.set(root.nodeId, rootDom.children[0]);
    updateQueue = [];
    sendMessage({
      method: 'setDocumentNodeIdOnce',
      payload: {},
    })
  },
  setChildNodeIdOnce: ({ parentId, payloads, nodeType }) => {
    let reactComponents = null;
    const realDom = nodeIdForDom.get(parentId);
    const rootDom = document.getElementById('__react-content');
    const { getReactElementFromNative } = detectGetReactElementFromNative(realDom || rootDom.children[0]);
    if (getReactElementFromNative) {
      if (nodeIdForDom.size === 0 || !realDom) {
        nodeIdForDom.set(parentId, rootDom.children[0]);
        reactComponents = mappingDomToNodeIdChildren(rootDom.children[0], payloads, getReactElementFromNative);
      } else {
        reactComponents = mappingDomToNodeIdChildren(realDom, payloads, getReactElementFromNative, nodeType);
      }
    }
    sendMessage({
      method: 'setChildNodeIdOnce',
      payload: {
        data: reactComponents,
      },
    })
  }
};

// handle all messages from devtools
ipc.on('devtools', (event, args) => {
  const { method, payload } = args;

  console.log(method, payload);

  if (!initReady)
    if (['refresh', 'initOnce'].indexOf(method) === -1)
      return sendMessage({ error: 'react is not ready' });
  if (messageHandler[method]) {
    messageHandler[method](payload);
  } else {
    throw new Error(`Error: method ${method} is not defined`);
  }
});

setupBackend(globalHook);
