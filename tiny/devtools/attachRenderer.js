/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

var getData = require('./getData');
var attachRendererFiber = require('./attachRendererFiber');

/**
 * This takes care of patching the renderer to emit events on the global
 * `Hook`. The returned object has a `.cleanup` method to un-patch everything.
 */
function attachRenderer(hook, rid, renderer) {
  var rootNodeIDMap = new Map();
  var extras = {};

  // React Fiber
  if (typeof renderer.findFiberByHostInstance === 'function') {
    return attachRendererFiber(hook, rid, renderer);
  }

  extras.getNativeFromReactElement = function(component) {
    return renderer.ComponentTree.getNodeFromInstance(component);
  };

  extras.getReactElementFromNative = function(node) {
    return renderer.ComponentTree.getClosestInstanceFromNode(node);
  };

  var oldMethods;
  var oldRenderComponent;
  var oldRenderRoot;

  // React DOM
  if (renderer.Mount._renderNewRootComponent) {
    oldRenderRoot = decorateResult(renderer.Mount, '_renderNewRootComponent', (internalInstance) => {
      hook.emit('root', {renderer: rid, internalInstance});
    });
  }

  if (renderer.Reconciler) {
    oldMethods = decorateMany(renderer.Reconciler, {
      mountComponent(internalInstance, rootID, transaction, context) {
        var data = getData(internalInstance);
        rootNodeIDMap.set(internalInstance._rootNodeID, internalInstance);
        hook.emit('mount', {internalInstance, data, renderer: rid});
      },
      performUpdateIfNecessary(internalInstance, nextChild, transaction, context) {
        hook.emit('update', {internalInstance, data: getData(internalInstance), renderer: rid});
      },
      receiveComponent(internalInstance, nextChild, transaction, context) {
        hook.emit('update', {internalInstance, data: getData(internalInstance), renderer: rid});
      },
      unmountComponent(internalInstance) {
        hook.emit('unmount', {internalInstance, renderer: rid});
        rootNodeIDMap.delete(internalInstance._rootNodeID, internalInstance);
      },
    });
  }

  extras.walkTree = function(visit, visitRoot) {
    var onMount = (component, data) => {
      rootNodeIDMap.set(component._rootNodeID, component);
      visit(component, data);
    };
    walkRoots(renderer.Mount._instancesByReactRootID || renderer.Mount._instancesByContainerID, onMount, visitRoot, isPre013);
  };

  extras.cleanup = function() {
    if (oldMethods) {
      if (renderer.Component) {
        restoreMany(renderer.Component.Mixin, oldMethods);
      } else {
        restoreMany(renderer.Reconciler, oldMethods);
      }
    }
    if (oldRenderRoot) {
      renderer.Mount._renderNewRootComponent = oldRenderRoot;
    }
    if (oldRenderComponent) {
      renderer.Mount.renderComponent = oldRenderComponent;
    }
    oldMethods = null;
    oldRenderRoot = null;
    oldRenderComponent = null;
  };

  return extras;
}

function walkRoots(roots, onMount, onRoot, isPre013) {
  for (var name in roots) {
    walkNode(roots[name], onMount, isPre013);
    onRoot(roots[name]);
  }
}

function walkNode(internalInstance, onMount, isPre013) {
  var data = isPre013 ? getData012(internalInstance) : getData(internalInstance);
  if (data.children && Array.isArray(data.children)) {
    data.children.forEach(child => walkNode(child, onMount, isPre013));
  }
  onMount(internalInstance, data);
}

function decorateResult(obj, attr, fn) {
  var old = obj[attr];
  obj[attr] = function(instance) {
    var res = old.apply(this, arguments);
    fn(res);
    return res;
  };
  return old;
}

function decorate(obj, attr, fn) {
  var old = obj[attr];
  obj[attr] = function(instance) {
    var res = old.apply(this, arguments);
    fn.apply(this, arguments);
    return res;
  };
  return old;
}

function decorateMany(source, fns) {
  var olds = {};
  for (var name in fns) {
    olds[name] = decorate(source, name, fns[name]);
  }
  return olds;
}

function restoreMany(source, olds) {
  for (var name in olds) {
    source[name] = olds[name];
  }
}

module.exports = attachRenderer;
