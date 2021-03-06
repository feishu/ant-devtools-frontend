Ant.TinyModel = class extends SDK.DOMModel {
  constructor(target) {
    super(target);
    const dispatcher = new Ant.TinyDispatcher(this);
    this._tinyConnection = new Ant.TinyConnection(target, dispatcher);
    // this._agent = target.tinyAgent();
    target.registerDOMDispatcher(dispatcher);
    this._agent = target.domAgent();
    this._idToDOMNode = {};
    this._backendIdDomNode = {};
    this._document = null;
    this._attributeLoadNodeIds = new Set();
    this._runtimeModel = /** @type {!SDK.RuntimeModel} */ (Ant.targetManager.getWorkerTarget().model(SDK.RuntimeModel));
  }

  static fromTarget(target) {
    let domModel = Ant.targetManager.getTinyModel(target);
    if (!domModel) {
      domModel = Ant.targetManager.getCurrentModel();
    }
    return domModel;
  }

  cssModel() {
    if (!this._cssModel)
      this._cssModel = Ant.targetManager.get(this._target);
    return this._cssModel;
  }

  existingDocument() {
    return this._document;
  }

  markUndoableState() {
    this._agent.markUndoableState();
  }

  _setDocument(payload) {
    this._idToDOMNode = {};
    if (payload && 'nodeId' in payload) {
      const parentRoot = Ant.findReactRoot(payload.children[1].children[1]);
      const root = parentRoot.children[0];
      payload.children = [root];
      this._document = new Ant.DOMDocument(this, payload);
    } else {
      this._document = null;
    }
    this.dispatchEventToListeners(SDK.DOMModel.Events.DocumentUpdated, this._document);
  }

  _setChildNodes(parentId, payloads) {
    if (!parentId && payloads.length) {
      this._setDetachedRoot(payloads[0]);
      return;
    }
    var parent = this._idToDOMNode[parentId];
    if (parent)
      parent._setChildrenPayload(payloads);
  }

  _childNodeInserted(parentId, prevId, payload) {
    var parent = this._idToDOMNode[parentId];
    if (!parent || (!payload.localName && payload.nodeName === '#comment')) return;
    var prev = this._idToDOMNode[prevId];
    var node = parent._insertChild(prev, payload);
    if (node) {
      this._idToDOMNode[node.id] = node;
      this.dispatchEventToListeners(SDK.DOMModel.Events.NodeInserted, node);
      this._scheduleMutationEvent(node);
    }
  }

  /**
   * @param {!Protocol.DOM.NodeId} nodeId
   * @param {number} newValue
   */
  _childNodeCountUpdated(nodeId, newValue) {
    var node = this._idToDOMNode[nodeId];
    if (!node) return;
    node._childNodeCount = newValue;
    this.dispatchEventToListeners(SDK.DOMModel.Events.ChildNodeCountUpdated, node);
    this._scheduleMutationEvent(node);
  }

  _loadNodeAttributes() {
    delete this._loadNodeAttributesTimeout;
    /*
    for (let nodeId of this._attributeLoadNodeIds) {
      this._agent.getAttributes(nodeId).then(attributes => {
        if (!attributes) {
          // We are calling _loadNodeAttributes asynchronously, it is ok if node is not found.
          return;
        }
        var node = this._idToDOMNode[nodeId];
        if (!node)
          return;
        if (node._setAttributesPayload(attributes)) {
          this.dispatchEventToListeners(SDK.DOMModel.Events.AttrModified, {node: node, name: 'style'});
          this._scheduleMutationEvent(node);
        }
      });
    }
    */
    this._attributeLoadNodeIds.clear();
  }

  attributeRemoved(nodeId, name) {
    // this._domModel._attributeRemoved(nodeId, name);
  }

  /**
   * @param {!Protocol.DOM.NodeId} parentId
   * @param {!Protocol.DOM.NodeId} nodeId
   */
  _childNodeRemoved(parentId, nodeId) {
    var parent = this._idToDOMNode[parentId];
    var node = this._idToDOMNode[nodeId];
    if (!node || !parent) return;
    parent._removeChild(node);
    this._unbind(node);
    this.dispatchEventToListeners(SDK.DOMModel.Events.NodeRemoved, {node: node, parent: parent});
    this._scheduleMutationEvent(node);
  }

  _inspectNodeRequested(backendNodeId) {
    const node = this._backendIdDomNode[backendNodeId];
    const treeOutlines = Ant.ElementsTreeOutline.forDOMModel(this);
    treeOutlines.selectDOMNode(node, true);

    if (Elements.inspectElementModeController)
      Elements.inspectElementModeController.stopInspection();
  }

  getChildNodes(callback) {
    if (this._children) {
      callback(this.children());
      return;
    }
    this._agent.requestChildNodes(this.id, undefined, (error) => {
      callback(error ? null : this.children());
    });
  }

  requestDocumentPromise() {
    return new Promise(resolve => {
      this.requestDocument(docuemnt => resolve(docuemnt));
    })
  }

  requestDocument(callback) {
    const self = this;
    if (this._document) {
      if (callback)
        callback(this._document);
      return;
    }

    if (this._pendingDocumentRequestCallbacks) {
      this._pendingDocumentRequestCallbacks.push(callback);
      return;
    }

    this._pendingDocumentRequestCallbacks = [callback];

    /**
     * @this {SDK.DOMModel}
     * @param {?Protocol.Error} error
     * @param {!Protocol.DOM.Node} root
     */
    async function onDocumentAvailable(error, root) {
      const parentRoot = Ant.findReactRoot(root.children[1].children[1]);
      const pageRoot = parentRoot.children[0];

      await Ant.makeProxyPromiseOnce('setDocumentNodeIdOnce', { root: pageRoot }, ({ data }) => {
        if (root) {
          Ant.initPage(pageRoot);
          self._setDocument(root);
        }
        delete self._pendingDocumentRequestPromise;
        if (!self._document)
          console.error('No document');
        if (callback) callback(self._document);
      });
    }

    this._agent.getDocument(5, undefined, onDocumentAvailable.bind(this));
  }

  setInspectMode(mode, callback) {
    /**
     * @this {SDK.DOMModel}
     */
    function onDocumentAvailable() {
      this._inspectModeEnabled = mode !== Protocol.DOM.InspectMode.None;
      this.dispatchEventToListeners(SDK.DOMModel.Events.InspectModeWillBeToggled, this._inspectModeEnabled);
      this._highlighter.setInspectMode(mode, this._buildHighlightConfig(), callback);
    }
    this.requestDocument(onDocumentAvailable.bind(this));
  }

  nodeForId(nodeId) {
    return this._idToDOMNode[nodeId] || null;
  }

  propsModified(nodeId, props) {
    const node = this._idToDOMNode[nodeId];
    if (!node || node._localName === 'swiper-item')
      return;

    Ant.combinedProps(node, props, this);
    this._scheduleMutationEvent(node);
  }

  _attributeModified(nodeId, name, value) {
    var node = this._idToDOMNode[nodeId];
    if (name === 'class' || name === 'className') {
      name = 'className';
      value.replace(/a-[a-z]*/, '').trim();
      if (!value)
        return;
    }
    if (!node)
      return;
  }
};

Ant.DOMNode = class {
  /**
   * @param {!SDK.DOMModel} domModel
   */
  constructor(domModel) {
    this._domModel = domModel;
  }

  target() {
    return Ant.targetManager.getCurrentTarget();
  }

  /**
   * @param {!SDK.DOMModel} domModel
   * @param {?SDK.DOMDocument} doc
   * @param {boolean} isInShadowTree
   * @param {!Protocol.DOM.Node} payload
   * @return {!SDK.DOMNode}
   */
  static create(domModel, doc, isInShadowTree, payload) {
    if (payload.nodeName === '#comment' && (payload.nodeValue.indexOf('react-text') > 0 || payload.nodeValue.indexOf('react-empty') > 0))
      return null;
    var node = new Ant.DOMNode(domModel);
    node._init(doc, isInShadowTree, payload);
    return node;
  }

  /**
   * @param {?SDK.DOMDocument} doc
   * @param {boolean} isInShadowTree
   * @param {!Protocol.DOM.Node} payload
   */
  _init(doc, isInShadowTree, payload) {
    this._agent = this._domModel._agent;
    this.ownerDocument = doc;
    this._isInShadowTree = isInShadowTree;

    this.id = payload.nodeId;
    this._backendNodeId = payload.backendNodeId;
    this._domModel._idToDOMNode[this.id] = this;
    this._domModel._backendIdDomNode[this._backendNodeId] = this;
    this._nodeType = payload.nodeType;
    this._nodeName = payload.nodeName;
    this._localName = payload.localName;
    this._nodeValue = payload.nodeValue;
    this._pseudoType = payload.pseudoType;
    this._shadowRootType = payload.shadowRootType;
    this._frameOwnerFrameId = payload.frameId || null;
    this._xmlVersion = payload.xmlVersion;
    this._isSVGNode = !!payload.isSVG;

    this._shadowRoots = [];

    this._attributes = [];
    this._attributesMap = {};
    if (payload.attributes)
      this._setAttributesPayload(payload.attributes);

    /** @type {!Map<string, ?>} */
    this._markers = new Map();
    this._subtreeMarkerCount = 0;

    this._childNodeCount = payload.childNodeCount || 0;
    this._children = null;

    this.nextSibling = null;
    this.previousSibling = null;
    this.firstChild = null;
    this.lastChild = null;
    this.parentNode = null;

    if (payload.shadowRoots) {
      for (var i = 0; i < payload.shadowRoots.length; ++i) {
        var root = payload.shadowRoots[i];
        var node = Ant.DOMNode.create(this._domModel, this.ownerDocument, true, root);
        this._shadowRoots.push(node);
        node.parentNode = this;
      }
    }

    if (payload.templateContent) {
      this._templateContent = Ant.DOMNode.create(this._domModel, this.ownerDocument, true, payload.templateContent);
      this._templateContent.parentNode = this;
    }

    if (payload.importedDocument) {
      this._importedDocument = Ant.DOMNode.create(this._domModel, this.ownerDocument, true, payload.importedDocument);
      this._importedDocument.parentNode = this;
    }

    if (payload.distributedNodes)
      this._setDistributedNodePayloads(payload.distributedNodes);

    if (payload.children)
      this._setChildrenPayload(payload.children);

    this._setPseudoElements(payload.pseudoElements);

    if (payload.contentDocument) {
      this._contentDocument = new Ant.DOMDocument(this._domModel, payload.contentDocument);
      this._children = [this._contentDocument];
      this._renumber();
    }

    if (this._nodeType === Node.ELEMENT_NODE) {
      // HTML and BODY from internal iframes should not overwrite top-level ones.
      if (this.ownerDocument && !this.ownerDocument.documentElement && this._nodeName === 'HTML')
        this.ownerDocument.documentElement = this;
      if (this.ownerDocument && !this.ownerDocument.body && this._nodeName === 'BODY')
        this.ownerDocument.body = this;
    } else if (this._nodeType === Node.DOCUMENT_TYPE_NODE) {
      this.publicId = payload.publicId;
      this.systemId = payload.systemId;
      this.internalSubset = payload.internalSubset;
    } else if (this._nodeType === Node.ATTRIBUTE_NODE) {
      this.name = payload.name;
      this.value = payload.value;
    }
  }

  /**
   * @return {boolean}
   */
  isSVGNode() {
    return this._isSVGNode;
  }

  /**
   * @return {!SDK.DOMModel}
   */
  domModel() {
    return this._domModel;
  }

  /**
   * @return {number}
   */
  backendNodeId() {
    return this._backendNodeId;
  }

  /**
   * @return {?Array.<!SDK.DOMNode>}
   */
  children() {
    return this._children ? this._children.slice() : null;
  }

  /**
   * @return {boolean}
   */
  hasAttributes() {
    return this._attributes.length > 0;
  }

  /**
   * @return {number}
   */
  childNodeCount() {
    return this._childNodeCount;
  }

  /**
   * @return {boolean}
   */
  hasShadowRoots() {
    return !!this._shadowRoots.length;
  }

  /**
   * @return {!Array.<!SDK.DOMNode>}
   */
  shadowRoots() {
    return this._shadowRoots.slice();
  }

  /**
   * @return {?SDK.DOMNode}
   */
  templateContent() {
    return this._templateContent || null;
  }

  /**
   * @return {?SDK.DOMNode}
   */
  importedDocument() {
    return this._importedDocument || null;
  }

  /**
   * @return {number}
   */
  nodeType() {
    return this._nodeType;
  }

  /**
   * @return {string}
   */
  nodeName() {
    return this._nodeName;
  }

  /**
   * @return {string|undefined}
   */
  pseudoType() {
    return this._pseudoType;
  }

  /**
   * @return {boolean}
   */
  hasPseudoElements() {
    return this._pseudoElements.size > 0;
  }

  /**
   * @return {!Map<string, !SDK.DOMNode>}
   */
  pseudoElements() {
    return this._pseudoElements;
  }

  /**
   * @return {?SDK.DOMNode}
   */
  beforePseudoElement() {
    if (!this._pseudoElements)
      return null;
    return this._pseudoElements.get(SDK.DOMNode.PseudoElementNames.Before);
  }

  /**
   * @return {?SDK.DOMNode}
   */
  afterPseudoElement() {
    if (!this._pseudoElements)
      return null;
    return this._pseudoElements.get(SDK.DOMNode.PseudoElementNames.After);
  }

  /**
   * @return {boolean}
   */
  isInsertionPoint() {
    return !this.isXMLNode() &&
      (this._nodeName === 'SHADOW' || this._nodeName === 'CONTENT' || this._nodeName === 'SLOT');
  }

  /**
   * @return {!Array.<!SDK.DOMNodeShortcut>}
   */
  distributedNodes() {
    return this._distributedNodes || [];
  }

  /**
   * @return {boolean}
   */
  isInShadowTree() {
    return this._isInShadowTree;
  }

  /**
   * @return {?SDK.DOMNode}
   */
  ancestorShadowHost() {
    var ancestorShadowRoot = this.ancestorShadowRoot();
    return ancestorShadowRoot ? ancestorShadowRoot.parentNode : null;
  }

  /**
   * @return {?SDK.DOMNode}
   */
  ancestorShadowRoot() {
    if (!this._isInShadowTree)
      return null;

    var current = this;
    while (current && !current.isShadowRoot())
      current = current.parentNode;
    return current;
  }

  /**
   * @return {?SDK.DOMNode}
   */
  ancestorUserAgentShadowRoot() {
    var ancestorShadowRoot = this.ancestorShadowRoot();
    if (!ancestorShadowRoot)
      return null;
    return ancestorShadowRoot.shadowRootType() === SDK.DOMNode.ShadowRootTypes.UserAgent ? ancestorShadowRoot : null;
  }

  /**
   * @return {boolean}
   */
  isShadowRoot() {
    return !!this._shadowRootType;
  }

  /**
   * @return {?string}
   */
  shadowRootType() {
    return this._shadowRootType || null;
  }

  /**
   * @return {string}
   */
  nodeNameInCorrectCase() {
    var shadowRootType = this.shadowRootType();
    if (shadowRootType)
      return '#shadow-root (' + shadowRootType + ')';

    // If there is no local name, it's case sensitive
    if (!this.localName())
      return this.nodeName();

    // If the names are different lengths, there is a prefix and it's case sensitive
    if (this.localName().length !== this.nodeName().length)
      return this.nodeName();

    // Return the localname, which will be case insensitive if its an html node
    return this.localName();
  }

  /**
   * @param {string} name
   * @param {function(?Protocol.Error, number)=} callback
   */
  setNodeName(name, callback) {
    this._agent.invoke_setNodeName({ nodeId: this.id, name }).then(response => {
      if (!response[Protocol.Error])
        this._domModel.markUndoableState();
      if (callback)
        callback(response[Protocol.Error] || null, response.nodeId);
    });
  }

  /**
   * @return {string}
   */
  localName() {
    return this._localName;
  }

  /**
   * @return {string}
   */
  nodeValue() {
    return this._nodeValue;
  }

  /**
   * @param {string} value
   * @param {function(?Protocol.Error)=} callback
   */
  setNodeValue(value, callback) {
    this._agent.setNodeValue(this.id, value, this._domModel._markRevision(this, callback));
  }

  /**
   * @param {string} name
   * @return {string}
   */
  getAttribute(name) {
    var attr = this._attributesMap[name];
    return attr ? attr.value : undefined;
  }

  /**
   * @param {string} name
   * @param {string} text
   * @param {function(?Protocol.Error)=} callback
   */
  setAttribute(name, text, callback) {
    this._agent.invoke_setAttributesAsText({ nodeId: this.id, text, name }).then(response => {
      if (!response[Protocol.Error])
        this._domModel.markUndoableState();
      if (callback)
        callback(response[Protocol.Error] || null);
    });
  }

  /**
   * @param {string} name
   * @param {string} value
   * @param {function(?Protocol.Error)=} callback
   */
  setAttributeValue(name, value, callback) {
    this._agent.invoke_setAttributeValue({ nodeId: this.id, name, value }).then(response => {
      if (!response[Protocol.Error])
        this._domModel.markUndoableState();
      if (callback)
        callback(response[Protocol.Error] || null);
    });
  }

  /**
  * @param {string} name
  * @param {string} value
  * @return {!Promise<?Protocol.Error>}
  */
  setAttributeValuePromise(name, value) {
    return new Promise(fulfill => this.setAttributeValue(name, value, fulfill));
  }

  /**
   * @return {!Array<!SDK.DOMNode.Attribute>}
   */
  attributes() {
    return this._attributes;
  }

  /**
   * @param {string} name
   * @return {!Promise}
   */
  async removeAttribute(name) {
    var response = await this._agent.invoke_removeAttribute({ nodeId: this.id, name });
    if (response[Protocol.Error])
      return;
    delete this._attributesMap[name];
    var index = this._attributes.findIndex(attr => attr.name === name);
    if (index !== -1)
      this._attributes.splice(index, 1);
    this._domModel.markUndoableState();
  }

  /**
   * @param {function(?Array<!SDK.DOMNode>)} callback
   */
  getChildNodes(callback) {
    if (this._children) {
      callback(this.children());
      return;
    }
    this._agent.requestChildNodes(this.id, undefined, (error) => {
      callback(error ? null : this.children());
    });
  }

  /**
   * @param {number} depth
   * @return {!Promise<?Array<!SDK.DOMNode>>}
   */
  async getSubtree(depth) {
    var response = await this._agent.invoke_requestChildNodes({ id: this.id, depth });
    return response[Protocol.Error] ? null : this._children;
  }

  /**
   * @return {!Promise<?string>}
   */
  getOuterHTML() {
    return this._agent.getOuterHTML(this.id);
  }

  /**
   * @param {string} html
   * @param {function(?Protocol.Error)=} callback
   */
  setOuterHTML(html, callback) {
    this._agent.invoke_setOuterHTML({ nodeId: this.id, outerHTML: html }).then(response => {
      if (!response[Protocol.Error])
        this._domModel.markUndoableState();
      if (callback)
        callback(response[Protocol.Error] || null);
    });
  }

  /**
   * @param {function(?Protocol.Error, !Protocol.DOM.NodeId=)=} callback
   */
  removeNode(callback) {
    this._agent.invoke_removeNode({ nodeId: this.id }).then(response => {
      if (!response[Protocol.Error])
        this._domModel.markUndoableState();
      if (callback)
        callback(response[Protocol.Error] || null);
    });
  }

  /**
   * @return {!Promise<?string>}
   */
  async copyNode() {
    var text = await this._agent.getOuterHTML(this.id);
    if (text !== null)
      InspectorFrontendHost.copyText(text);
    return text;
  }

  /**
   * @return {string}
   */
  path() {
    /**
     * @param {?SDK.DOMNode} node
     */
    function canPush(node) {
      return node && ('index' in node || (node.isShadowRoot() && node.parentNode)) && node._nodeName.length;
    }

    var path = [];
    var node = this;
    while (canPush(node)) {
      var index = typeof node.index === 'number' ?
        node.index :
        (node.shadowRootType() === SDK.DOMNode.ShadowRootTypes.UserAgent ? 'u' : 'a');
      path.push([index, node._nodeName]);
      node = node.parentNode;
    }
    path.reverse();
    return path.join(',');
  }

  /**
   * @param {!SDK.DOMNode} node
   * @return {boolean}
   */
  isAncestor(node) {
    if (!node)
      return false;

    var currentNode = node.parentNode;
    while (currentNode) {
      if (this === currentNode)
        return true;
      currentNode = currentNode.parentNode;
    }
    return false;
  }

  /**
   * @param {!SDK.DOMNode} descendant
   * @return {boolean}
   */
  isDescendant(descendant) {
    return descendant !== null && descendant.isAncestor(this);
  }

  /**
   * @return {?Protocol.Page.FrameId}
   */
  frameId() {
    var node = this.parentNode || this;
    while (!node._frameOwnerFrameId && node.parentNode)
      node = node.parentNode;
    return node._frameOwnerFrameId;
  }

  /**
   * @param {!Array.<string>} attrs
   * @return {boolean}
   */
  _setAttributesPayload(attrs) {
    var attributesChanged = !this._attributes || attrs.length !== this._attributes.length * 2;
    var oldAttributesMap = this._attributesMap || {};

    this._attributes = [];
    this._attributesMap = {};

    for (var i = 0; i < attrs.length; i += 2) {
      var name = attrs[i];
      var value = attrs[i + 1];
      this._addAttribute(name, value);

      if (attributesChanged)
        continue;

      if (!oldAttributesMap[name] || oldAttributesMap[name].value !== value)
        attributesChanged = true;
    }
    return attributesChanged;
  }

  /**
   * @param {!SDK.DOMNode} prev
   * @param {!Protocol.DOM.Node} payload
   * @return {!SDK.DOMNode}
   */
  _insertChild(prev, payload) {
    var node = Ant.DOMNode.create(this._domModel, this.ownerDocument, this._isInShadowTree, payload);
    this._children.splice(this._children.indexOf(prev) + 1, 0, node);
    this._renumber();
    return node;
  }

  /**
   * @param {!SDK.DOMNode} node
   */
  _removeChild(node) {
    if (node.pseudoType()) {
      this._pseudoElements.delete(node.pseudoType());
    } else {
      var shadowRootIndex = this._shadowRoots.indexOf(node);
      if (shadowRootIndex !== -1) {
        this._shadowRoots.splice(shadowRootIndex, 1);
      } else {
        console.assert(this._children.indexOf(node) !== -1);
        this._children.splice(this._children.indexOf(node), 1);
      }
    }
    node.parentNode = null;
    this._subtreeMarkerCount -= node._subtreeMarkerCount;
    if (node._subtreeMarkerCount)
      this._domModel.dispatchEventToListeners(SDK.DOMModel.Events.MarkersChanged, this);
    this._renumber();
  }

  /**
   * @param {!Array.<!Protocol.DOM.Node>} payloads
   */
  _setChildrenPayload(payloads) {
    // We set children in the constructor.
    if (this._contentDocument)
      return;

    this._children = [];
    for (var i = 0; i < payloads.length; ++i) {
      var payload = payloads[i];
      var node = Ant.DOMNode.create(this._domModel, this.ownerDocument, this._isInShadowTree, payload);
      if (node)
        this._children.push(node);
    }
    this._renumber();
  }

  /**
   * @param {!Array.<!Protocol.DOM.Node>|undefined} payloads
   */
  _setPseudoElements(payloads) {
    this._pseudoElements = new Map();
    if (!payloads)
      return;

    for (var i = 0; i < payloads.length; ++i) {
      var node = Ant.DOMNode.create(this._domModel, this.ownerDocument, this._isInShadowTree, payloads[i]);
      node.parentNode = this;
      this._pseudoElements.set(node.pseudoType(), node);
    }
  }

  /**
   * @param {!Array.<!Protocol.DOM.BackendNode>} payloads
   */
  _setDistributedNodePayloads(payloads) {
    this._distributedNodes = [];
    for (var payload of payloads) {
      this._distributedNodes.push(
        new SDK.DOMNodeShortcut(this._domModel.target(), payload.backendNodeId, payload.nodeType, payload.nodeName));
    }
  }

  _renumber() {
    this._childNodeCount = this._children.length;
    if (this._childNodeCount === 0) {
      this.firstChild = null;
      this.lastChild = null;
      return;
    }
    this.firstChild = this._children[0];
    this.lastChild = this._children[this._childNodeCount - 1];
    for (var i = 0; i < this._childNodeCount; ++i) {
      var child = this._children[i];
      child.index = i;
      child.nextSibling = i + 1 < this._childNodeCount ? this._children[i + 1] : null;
      child.previousSibling = i - 1 >= 0 ? this._children[i - 1] : null;
      child.parentNode = this;
    }
  }

  /**
   * @param {string} name
   * @param {string} value
   */
  _addAttribute(name, value) {
    if (name === 'class' || name === 'className') {
      name = 'className';
      value = value.replace(/a-[a-z]*/, '').trim();
      if (!value)
        return;
    }
    var attr = { name: name, value: value, _node: this };
    this._attributesMap[name] = attr;
    this._attributes.push(attr);
  }

  /**
   * @param {string} name
   * @param {string} value
   */
  _setAttribute(name, value) {
    if (name === 'class' || name === 'className') {
      name = 'className';
      value.replace(/a-[a-z]*/, '').trim();
      if (!value)
        return;
    }
    var attr = this._attributesMap[name];
    if (attr)
      attr.value = value;
    else
      this._addAttribute(name, value);
  }

  /**
   * @param {string} name
   */
  _removeAttribute(name) {
    var attr = this._attributesMap[name];
    if (attr) {
      this._attributes.remove(attr);
      delete this._attributesMap[name];
    }
  }

  /**
   * @param {!SDK.DOMNode} targetNode
   * @param {?SDK.DOMNode} anchorNode
   * @param {function(?Protocol.Error, !Protocol.DOM.NodeId=)=} callback
   */
  copyTo(targetNode, anchorNode, callback) {
    this._agent
      .invoke_copyTo(
      { nodeId: this.id, targetNodeId: targetNode.id, insertBeforeNodeId: anchorNode ? anchorNode.id : undefined })
      .then(response => {
        if (!response[Protocol.Error])
          this._domModel.markUndoableState();
        if (callback)
          callback(response[Protocol.Error] || null, response.nodeId);
      });
  }

  /**
   * @param {!SDK.DOMNode} targetNode
   * @param {?SDK.DOMNode} anchorNode
   * @param {function(?Protocol.Error, !Protocol.DOM.NodeId=)=} callback
   */
  moveTo(targetNode, anchorNode, callback) {
    this._agent
      .invoke_moveTo(
      { nodeId: this.id, targetNodeId: targetNode.id, insertBeforeNodeId: anchorNode ? anchorNode.id : undefined })
      .then(response => {
        if (!response[Protocol.Error])
          this._domModel.markUndoableState();
        if (callback)
          callback(response[Protocol.Error] || null, response.nodeId);
      });
  }

  /**
   * @return {boolean}
   */
  isXMLNode() {
    return !!this._xmlVersion;
  }

  /**
   * @param {string} name
   * @param {?*} value
   */
  setMarker(name, value) {
    if (value === null) {
      if (!this._markers.has(name))
        return;

      this._markers.delete(name);
      for (var node = this; node; node = node.parentNode)
        --node._subtreeMarkerCount;
      for (var node = this; node; node = node.parentNode)
        this._domModel.dispatchEventToListeners(SDK.DOMModel.Events.MarkersChanged, node);
      return;
    }

    if (this.parentNode && !this._markers.has(name)) {
      for (var node = this; node; node = node.parentNode)
        ++node._subtreeMarkerCount;
    }
    this._markers.set(name, value);
    for (var node = this; node; node = node.parentNode)
      this._domModel.dispatchEventToListeners(SDK.DOMModel.Events.MarkersChanged, node);
  }

  /**
   * @param {string} name
   * @return {?T}
   * @template T
   */
  marker(name) {
    return this._markers.get(name) || null;
  }

  /**
   * @param {function(!SDK.DOMNode, string)} visitor
   */
  traverseMarkers(visitor) {
    /**
     * @param {!SDK.DOMNode} node
     */
    function traverse(node) {
      if (!node._subtreeMarkerCount)
        return;
      for (var marker of node._markers.keys())
        visitor(node, marker);
      if (!node._children)
        return;
      for (var child of node._children)
        traverse(child);
    }
    traverse(this);
  }

  /**
   * @param {string} url
   * @return {?string}
   */
  resolveURL(url) {
    if (!url)
      return url;
    for (var frameOwnerCandidate = this; frameOwnerCandidate; frameOwnerCandidate = frameOwnerCandidate.parentNode) {
      if (frameOwnerCandidate.baseURL)
        return Common.ParsedURL.completeURL(frameOwnerCandidate.baseURL, url);
    }
    return null;
  }

  /**
   * @param {string=} mode
   * @param {!Protocol.Runtime.RemoteObjectId=} objectId
   */
  highlight(mode, objectId) {
    this._domModel.highlightDOMNode(this.id, mode, undefined, objectId);
  }

  highlightForTwoSeconds() {
    this._domModel.highlightDOMNodeForTwoSeconds(this.id);
  }

  /**
   * @param {string=} objectGroup
   * @param {function(?SDK.RemoteObject)=} callback
   */
  resolveToObject(objectGroup, callback) {
    this.resolveToObjectPromise(objectGroup).then(object => callback && callback(object));
  }

  /**
   * @param {string=} objectGroup
   * @return {!Promise<?SDK.RemoteObject>}
   */
  async resolveToObjectPromise(objectGroup) {
    var object = await this._agent.resolveNode(this.id, objectGroup);
    return object && this._domModel._runtimeModel.createRemoteObject(object);
  }

  /**
   * @return {!Promise<?Protocol.DOM.BoxModel>}
   */
  boxModel() {
    return this._agent.getBoxModel(this.id);
  }

  setAsInspectedNode() {
    var node = this;
    while (true) {
      var ancestor = node.ancestorUserAgentShadowRoot();
      if (!ancestor)
        break;
      ancestor = node.ancestorShadowHost();
      if (!ancestor)
        break;
      // User agent shadow root, keep climbing up.
      node = ancestor;
    }
    this._agent.setInspectedNode(node.id);
  }

  /**
   *  @return {?SDK.DOMNode}
   */
  enclosingElementOrSelf() {
    var node = this;
    if (node && node.nodeType() === Node.TEXT_NODE && node.parentNode)
      node = node.parentNode;

    if (node && node.nodeType() !== Node.ELEMENT_NODE)
      node = null;
    return node;
  }
};

Ant.DOMDocument = class extends Ant.DOMNode {
  /**
   * @param {!Ant.TinyModel} domModel
   * @param {!Protocol.DOM.Node} payload
   */
  constructor(domModel, payload) {
    super(domModel);
    this._init(this, false, payload, '0');
    this.documentURL = payload.documentURL || '';
    this.baseURL = payload.baseURL || '';
  }
};

Ant.TinyModel.Events = {
  AttrModified: Symbol('tiny-AttrModified'),
  AttrRemoved: Symbol('tiny-AttrRemoved'),
  CharacterDataModified: Symbol('tiny-CharacterDataModified'),
  DOMMutated: Symbol('tiny-DOMMutated'),
  NodeInserted: Symbol('tiny-NodeInserted'),
  NodeRemoved: Symbol('tiny-NodeRemoved'),
  DocumentUpdated: Symbol('tiny-DocumentUpdated'),
  ChildNodeCountUpdated: Symbol('tiny-ChildNodeCountUpdated'),
  DistributedNodesChanged: Symbol('tiny-DistributedNodesChanged'),
  MarkersChanged: Symbol('tiny-MarkersChanged')
};

Ant.TinyDispatcher = class extends SDK.DOMDispatcher {
  constructor(tinyModel) {
    super(tinyModel);
  }

  documentUpdated() {
    // get the document from a new webview.
    this._domModel._documentUpdated();
  }

  async setChildNodes(parentId, payloads) {
    this._domModel._setChildNodes(parentId, payloads);
  }
};

Ant.replaceTagNameAndAttr = (backDom, data) => {
  const attributes = [];
  backDom.localName = data.name;
  backDom.nodeName = data.name.toUpperCase();
  const filterPropKey = new Set(['$tag', '$appx', 'children', '_textChildren']);
  Object.keys(data.props).forEach(key => {
    if (filterPropKey.has(key)) return;
    const value = data.props[key];
    attributes.push(key);
    if (typeof value === 'string') {
      attributes.push(value);
    } else if (typeof value === 'object') {
      let localValue = '';
      Object.keys(value).forEach(property => {
        localValue += `${property}: ${value[property]};`;
      });
      attributes.push(localValue);
    } else {
      attributes.push(`${String(value)}`);
    }
  });
  backDom.attributes = attributes;
  return backDom;
};

Ant.combinedProps = (node, props, model) => {
  const filterPropKey = new Set(['$tag', '$appx', 'children', '_textChildren']);
  Object.keys(props).forEach(key => {
    if (filterPropKey.has(key)) return;
    const value = props[key];
    if (!value && value !== false && value !== 'none') return;
    if (typeof value === 'string') {
      node._setAttribute(key, value);
    } else if (typeof value === 'object') {
      let localValue = '';
      Object.keys(value).forEach(property => {
        localValue += `${property}: ${value[property]};`;
      });
      node._setAttribute(key, localValue);
    } else {
      node._setAttribute(key, `${String(value)}`);
    }
    model.dispatchEventToListeners(SDK.DOMModel.Events.AttrModified, {node: node, name: key});
  });
};

SDK.OverlayDispatcher = class {
  /**
   * @param {!SDK.DOMModel} domModel
   */
  constructor(domModel) {
    this._domModel = domModel;
  }

  /**
   * @override
   * @param {!Protocol.DOM.NodeId} nodeId
   */
  inspectNodeRequested(nodeId) {
    console.log(nodeId);
    this._domModel._inspectNodeRequested(nodeId);
  }

  /**
   * @override
   * @param {!Protocol.DOM.NodeId} nodeId
   */
  nodeHighlightRequested(nodeId) {
    console.log(nodeId);
    this._domModel.nodeHighlightRequested(nodeId);
  }
}

Ant.initPage = (node) => {
  node.attributes = [];
  node.localName = 'page';
  node.nodeName = 'PAGE';
}

Ant.findReactRoot = parent => {
  for (const child of parent.children) {
    if (child.attributes && child.attributes[0] === 'id' && child.attributes[1] === '__react-content')
      return child;
  }
};

// SDK.SDKModel.register(Ant.TinyModel, SDK.Target.Capability.DOM, false);
