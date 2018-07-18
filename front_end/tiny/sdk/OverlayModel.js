// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @implements {Protocol.OverlayDispatcher}
 */
SDK.OverlayModel = class extends SDK.SDKModel {
  /**
   * @param {!SDK.Target} target
   */
  constructor(target) {
    super(SDK.OverlayModel, target);
    target.registerOverlayDispatcher(this);
    this._agent = target.overlayAgent();
    this._overlayAgent = target.overlayAgent();
    this._overlayAgent.enable();
    this._domModel = /** @type {!SDK.DOMModel} */ (target.model(Ant.TinyModel));
  }

  /**
   * @override
   * @param {!Protocol.DOM.NodeId} nodeId
   */
  nodeHighlightRequested(nodeId) {
    var node = this._domModel.nodeForId(nodeId);
    if (node)
      this.dispatchEventToListeners(SDK.OverlayModel.Events.HighlightNodeRequested, node);
  }

  /**
   * @override
   * @param {!Protocol.DOM.BackendNodeId} backendNodeId
   */
  inspectNodeRequested(backendNodeId) {
    var deferredNode = new SDK.DeferredDOMNode(this.target(), backendNodeId);
    this.dispatchEventToListeners(SDK.OverlayModel.Events.InspectNodeRequested, deferredNode);
  }
};

// SDK.SDKModel.register(SDK.OverlayModel, SDK.Target.Capability.DOM, true);

/** @enum {symbol} */
SDK.OverlayModel.Events = {
  InspectModeWillBeToggled: Symbol('InspectModeWillBeToggled'),
  HighlightNodeRequested: Symbol('HighlightNodeRequested'),
  InspectNodeRequested: Symbol('InspectNodeRequested'),
};
