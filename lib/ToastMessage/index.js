"use strict";
var React = require("react/addons");
var $__0=  React,PropTypes=$__0.PropTypes;
var $__1=  React.addons,update=$__1.update;
var constants = require('../Constants');

function noop () {}

var ToastMessageSpec = {
  displayName: "ToastMessage",

  propTypes: {
    type: PropTypes.oneOf(Object.keys(constants.toastTypes)).isRequired,
    iconClassName: PropTypes.string,
    messageClassName: PropTypes.string,
    titleClassName: PropTypes.string,
    tapToDismiss: PropTypes.bool,
    closeButton: PropTypes.bool
  },

  getDefaultProps:function () {
    return {
      titleClassName: "toast-title",
      messageClassName: "toast-message",
      tapToDismiss: true,
      closeButton: false
    };
  },

  handleOnClick:function (event) {
    var $__0=  this,props=$__0.props;
    props.handleOnClick(event);
    if (props.tapToDismiss) {
      this.hideToast(true);
    }
  },

  _handle_close_button_click:function (event) {
    event.stopPropagation();
    this.hideToast(true);
  },

  _handle_remove:function () {
    var $__0=  this,props=$__0.props;
    props.handleRemove(props.toastId);
  },

  _render_close_button:function (props) {
    return props.closeButton ? (
      React.createElement("button", {className: "toast-close-button", role: "button", 
              onClick: this._handle_close_button_click}, "×")
    ) : false;
  },

  _render_title_element:function (props) {
    return props.title ? (
      React.createElement("div", {className: props.titleClassName}, 
        props.title
      )
    ) : false;
  },

  _render_message_element:function (props) {
    return props.message ? (
      React.createElement("div", {className: props.messageClassName}, 
        props.message
      )
    ) : false;
  },

  render:function () {
    var cx = React.addons.classSet;
    var $__0=  this,props=$__0.props;
    var iconClassName = props.iconClassName || constants.iconClassNames[props.type];

    var toastClass = {
      "toast": true
    };

    if (props.className) {
      toastClass[props.className] = true;
    }

    toastClass[iconClassName] = true;

    return (
      React.createElement("div", {className: cx(toastClass), style: props.style || {}, 
            onClick: this.handleOnClick, 
            onMouseEnter: this.handleMouseEnter, 
            onMouseLeave: this.handleMouseLeave}, 
        this._render_close_button(props), 
        this._render_title_element(props), 
        this._render_message_element(props)
      )
    );
  }
};


var animation = React.createClass(update(ToastMessageSpec, {
  displayName: { $set: "ToastMessage.animation" },
  mixins: { $set: [require("./animationMixin")] }
}));

var jQuery = React.createClass(update(ToastMessageSpec, {
  displayName: { $set: "ToastMessage.jQuery" },
  mixins: { $set: [require("./jQueryMixin")] }
}));

/*
 * assign default noop functions
 */
ToastMessageSpec.handleMouseEnter = noop;
ToastMessageSpec.handleMouseLeave = noop;
ToastMessageSpec.hideToast = noop;

var ToastMessage = module.exports = React.createClass(ToastMessageSpec);
ToastMessage.animation = animation;
ToastMessage.jQuery = jQuery;
