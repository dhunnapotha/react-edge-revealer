(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Waypoint = require('react-waypoint');
var EdgeRevealer = React.createClass({
  displayName: 'EdgeRevealer',

  propTypes: {
    from: React.PropTypes.string, /*one in array top or bottom: todo*/
    height: React.PropTypes.string, /*caller needs to set this*/
    container_styling: React.PropTypes.object, /*if nothing is set, top will be set to either zero or windowHeight - height*/
    threshold: React.PropTypes.number
  },

  /* Hide it */

  getInitialState: function () {
    return { show: false };
  },

  /* Waypoint callback. This is triggered, whenever the waypoint element enters the view */

  handleWaypointEnter: function () {
    console.log('~~~ entered');
    this.setState({ show: true });
  },

  /* Waypoint callback. This is triggered, whenever the waypoint exits enters the view */

  handleWaypointLeave: function () {
    console.log('~~~ exited');
    this.setState({ show: false });
  },

  /* Should we reveal from the top?*/

  _isFromUp: function () {
    return this.props.from == 'up';
  },

  /* When container_styling.top is not set in the props, this function computes the default top */

  _getDefaultContainerTopWhenRevealed: function () {
    return _isFromUp() ? 0 : window.innerHeight - height;
  },

  /*
    Calculates top based on the following logic: 
    
    When hidden
    if from is top, then top property has to be -height 
    If from is down, then the top property has to be window.innerHeight
     When revealed
    then top has to be whatever that is set in the container_styling*/

  _calculateTop: function (styling) {
    if (this.state.show) return this.props.container_styling.top || this._getDefaultContainerTopWhenRevealed();

    return _isFromUp() ? '-' + this.props.height : window.innerHeight;
  },

  /*Compute styling according to props and state*/

  _computeStyling: function () {
    var height = this.props.height;
    // todo: move this to default props
    var styling = {
      position: 'fixed',
      height: height,
      transition: 'bottom .25s, top .25s',
      transitionTimingFunction: 'ease',
      width: '100%',
      left: 0
    };

    styling['top'] = this._calculateTop();
    return styling;
  },

  render: function () {
    var styling = this._computeStyling();

    return React.createElement(
      'div',
      { className: 'edge-revealer-container' },
      React.createElement(Waypoint, { onEnter: this.handleWaypointEnter, onLeave: this.handleWaypointLeave, threshold: this.props.threshold }),
      React.createElement(
        'div',
        { className: 'edge-revealer', style: styling },
        this.props.children
      )
    );
  }
});

if (typeof module != 'undefined') module.exports = EdgeRevealer;


},{"react-waypoint":2}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var POSITIONS = {
  above: 'above',
  inside: 'inside',
  below: 'below'
};

var propTypes = {
  // threshold is percentage of the height of the visible part of the
  // scrollable ancestor (e.g. 0.1)
  threshold: _react.PropTypes.number,
  onEnter: _react.PropTypes.func,
  onLeave: _react.PropTypes.func,
  fireOnRapidScroll: _react.PropTypes.bool,
  scrollableAncestor: _react.PropTypes.any
};

var defaultProps = {
  threshold: 0,
  onEnter: function onEnter() {},
  onLeave: function onLeave() {},

  fireOnRapidScroll: true
};

/**
 * Calls a function when you scroll to the element.
 */

var Waypoint = (function (_React$Component) {
  _inherits(Waypoint, _React$Component);

  function Waypoint() {
    _classCallCheck(this, Waypoint);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Waypoint).apply(this, arguments));
  }

  _createClass(Waypoint, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.scrollableParent) {
        // eslint-disable-line react/prop-types
        throw new Error('The `scrollableParent` prop has changed name ' + 'to `scrollableAncestor`.');
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!Waypoint.getWindow()) {
        return;
      }

      this._handleScroll = this._handleScroll.bind(this);
      this.scrollableAncestor = this._findScrollableAncestor();
      this.scrollableAncestor.addEventListener('scroll', this._handleScroll);
      window.addEventListener('resize', this._handleScroll);
      this._handleScroll(null);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!Waypoint.getWindow()) {
        return;
      }

      // The element may have moved.
      this._handleScroll(null);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (!Waypoint.getWindow()) {
        return;
      }

      if (this.scrollableAncestor) {
        // At the time of unmounting, the scrollable ancestor might no longer
        // exist. Guarding against this prevents the following error:
        //
        //   Cannot read property 'removeEventListener' of undefined
        this.scrollableAncestor.removeEventListener('scroll', this._handleScroll);
      }
      window.removeEventListener('resize', this._handleScroll);
    }

    /**
     * Traverses up the DOM to find an ancestor container which has an overflow
     * style that allows for scrolling.
     *
     * @return {Object} the closest ancestor element with an overflow style that
     *   allows for scrolling. If none is found, the `window` object is returned
     *   as a fallback.
     */

  }, {
    key: '_findScrollableAncestor',
    value: function _findScrollableAncestor() {
      if (this.props.scrollableAncestor) {
        return this.props.scrollableAncestor;
      }

      var node = _reactDom2.default.findDOMNode(this);

      while (node.parentNode) {
        node = node.parentNode;

        if (node === document) {
          // This particular node does not have a computed style.
          continue;
        }

        if (node === document.documentElement) {
          // This particular node does not have a scroll bar, it uses the window.
          continue;
        }

        var style = window.getComputedStyle(node);
        var overflowY = style.getPropertyValue('overflow-y') || style.getPropertyValue('overflow');

        if (overflowY === 'auto' || overflowY === 'scroll') {
          return node;
        }
      }

      // A scrollable ancestor element was not found, which means that we need to
      // do stuff on window.
      return window;
    }

    /**
     * @param {Object} event the native scroll event coming from the scrollable
     *   ancestor, or resize event coming from the window. Will be undefined if
     *   called by a React lifecyle method
     */

  }, {
    key: '_handleScroll',
    value: function _handleScroll(event) {
      var currentPosition = this._currentPosition();
      var previousPosition = this._previousPosition || null;

      // Save previous position as early as possible to prevent cycles
      this._previousPosition = currentPosition;

      if (previousPosition === currentPosition) {
        // No change since last trigger
        return;
      }

      if (currentPosition === POSITIONS.inside) {
        this.props.onEnter.call(this, event, previousPosition);
      } else if (previousPosition === POSITIONS.inside) {
        this.props.onLeave.call(this, event, currentPosition);
      }

      var isRapidScrollDown = previousPosition === POSITIONS.below && currentPosition === POSITIONS.above;
      var isRapidScrollUp = previousPosition === POSITIONS.above && currentPosition === POSITIONS.below;
      if (this.props.fireOnRapidScroll && (isRapidScrollDown || isRapidScrollUp)) {
        // If the scroll event isn't fired often enough to occur while the
        // waypoint was visible, we trigger both callbacks anyway.
        this.props.onEnter.call(this, event, previousPosition);
        this.props.onLeave.call(this, event, currentPosition);
      }
    }

    /**
     * @param {Object} node
     * @return {Number}
     */

  }, {
    key: '_distanceToTopOfScrollableAncestor',
    value: function _distanceToTopOfScrollableAncestor(node) {
      if (this.scrollableAncestor !== window && !node.offsetParent) {
        throw new Error('The scrollable ancestor of Waypoint needs to have positioning to ' + 'properly determine position of Waypoint (e.g. `position: relative;`)');
      }

      if (this.scrollableAncestor === window) {
        var rect = node.getBoundingClientRect();
        return rect.top + window.pageYOffset - document.documentElement.clientTop;
      }

      if (node.offsetParent === this.scrollableAncestor || !node.offsetParent) {
        return node.offsetTop;
      } else {
        return node.offsetTop + this._distanceToTopOfScrollableAncestor(node.offsetParent);
      }
    }

    /**
     * @return {string} The current position of the waypoint in relation to the
     *   visible portion of the scrollable parent. One of `POSITIONS.above`,
     *   `POSITIONS.below`, or `POSITIONS.inside`.
     */

  }, {
    key: '_currentPosition',
    value: function _currentPosition() {
      var waypointTop = this._distanceToTopOfScrollableAncestor(_reactDom2.default.findDOMNode(this));
      var contextHeight = undefined;
      var contextScrollTop = undefined;

      if (this.scrollableAncestor === window) {
        contextHeight = window.innerHeight;
        contextScrollTop = window.pageYOffset;
      } else {
        contextHeight = this.scrollableAncestor.offsetHeight;
        contextScrollTop = this.scrollableAncestor.scrollTop;
      }

      var thresholdPx = contextHeight * this.props.threshold;

      var isBelowTop = contextScrollTop <= waypointTop + thresholdPx;
      if (!isBelowTop) {
        return POSITIONS.above;
      }

      var contextBottom = contextScrollTop + contextHeight;
      var isAboveBottom = contextBottom >= waypointTop - thresholdPx;
      if (!isAboveBottom) {
        return POSITIONS.below;
      }

      return POSITIONS.inside;
    }

    /**
     * @return {Object}
     */

  }, {
    key: 'render',
    value: function render() {
      // We need an element that we can locate in the DOM to determine where it is
      // rendered relative to the top of its context.
      return _react2.default.createElement('span', { style: { fontSize: 0 } });
    }
  }]);

  return Waypoint;
})(_react2.default.Component);

exports.default = Waypoint;

Waypoint.propTypes = propTypes;
Waypoint.above = POSITIONS.above;
Waypoint.below = POSITIONS.below;
Waypoint.getWindow = function () {
  if (typeof window !== 'undefined') {
    return window;
  }
};
Waypoint.defaultProps = defaultProps;
module.exports = exports['default'];

},{"react":"react","react-dom":"react-dom"}]},{},[1]);
