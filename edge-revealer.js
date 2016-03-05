// todo height in various formats!
var Waypoint = require('react-waypoint');
var EdgeRevealer = React.createClass({
  displayName: 'EdgeRevealer',

  propTypes: {
    from: React.PropTypes.string, /*one in array top or bottom: todo*/
    height: React.PropTypes.number, /*caller needs to set this. Only in px as of now*/
    container_styling: React.PropTypes.object, /*if nothing is set, top will be set to either zero or windowHeight - height*/
    threshold: React.PropTypes.number
  },

  /*Default props here*/

  getDefaultProps: function () {
    return {
      from: "up",
      height: 100,
      container_styling: {},
      threshold: 0
    };
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

