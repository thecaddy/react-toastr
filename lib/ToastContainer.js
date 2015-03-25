"use strict";
var React = require("react/addons");
var $__0=  React,PropTypes=$__0.PropTypes;
var $__1=  React.addons,update=$__1.update;
var $__2=  React.addons,classSet=$__2.classSet;

var ToastMessage = React.createFactory(require("./ToastMessage"));

function noop () {}

var toastTypes = {
  error: "error",
  info: "info",
  success: "success",
  warning: "warning"
};

var toastHorizontalPositions = {
  left: "left",
  right: "right",
  full: "full-width",
  center: "center"
};

var toastVerticalPositions = {
  top: "top",
  bottom: "bottom"
};

module.exports = React.createClass({
  displayName: "ToastContainer",

  propTypes: {
    type: PropTypes.oneOf(Object.keys(toastTypes)).isRequired,
    toastMessageFactory: PropTypes.object.isRequired,
    preventDuplicates: PropTypes.bool,
    onClick: PropTypes.func,
    toastPosition: PropTypes.shape({
      horizontal: PropTypes.oneOf(Object.keys(toastHorizontalPositions)),
      vertical: PropTypes.oneOf(Object.keys(toastVerticalPositions))
    }).isRequired
  },

  error:function (message, title, optionsOverride) {
    this._notify(toastTypes.error, message, title, optionsOverride);
  },

  info:function (message, title, optionsOverride) {
    this._notify(toastTypes.info, message, title, optionsOverride);
  },

  success:function (message, title, optionsOverride) {
    this._notify(toastTypes.success, message, title, optionsOverride);
  },

  warning:function (message, title, optionsOverride) {
    this._notify(toastTypes.warning, message, title, optionsOverride);
  },

  clear:function () {
    var $__0=  this,refs=$__0.refs,
        key;
    for (key in refs) {
      refs[key].hideToast(false);
    }
  },

  getDefaultProps:function () {
    return {
      toastMessageFactory: ToastMessage,
      preventDuplicates: false,
      newestOnTop: true,
      onClick: noop,
      toastPosition: {
        horizontal: toastHorizontalPositions.right,
        vertical: toastVerticalPositions.top
      }
    };
  },

  getInitialState:function () {
    return {
      toasts: [],
      toastId: 0,
      previousMessage: null
    };
  },

  render:function () {
    var vPos = this.props.toastPosition.vertical;
    var hPos = this.props.toastPosition.horizontal;
    var props = React.__spread(
      {className: "toast-container toast-" + vPos + '-' + hPos},
      this.props
    );

    return this._render(props, this.state);
  },

  _notify:function (type, message, title, optionsOverride) {
    var $__0=   this,props=$__0.props,state=$__0.state;
    if (props.preventDuplicates) {
      if (state.previousMessage === message) {
        return;
      }
    }
    var key = state.toastId++;
    var toastId = key;
    var newToast = update(optionsOverride || {}, {
      $merge: {
        type:type,
        title:title,
        message:message,
        toastId:toastId,
        key:key,
        ref: ("toasts__" +  key),
        handleOnClick: this._handle_toast_on_click,
        handleRemove: this._handle_toast_remove
      }
    });
    var toastOperation = {};
    toastOperation[(( props.newestOnTop ? "$unshift" : "$push"))] = [newToast];

    var newState = update(state, {
      toasts: toastOperation,
      previousMessage: { $set: message }
    });
    this.setState(newState);
  },

  _handle_toast_on_click:function (event) {
    this.props.onClick(event);
    if (event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  },

  _handle_toast_remove:function (toastId) {
    var $__0=  this,state=$__0.state;
    state.toasts[(( this.props.newestOnTop ? "reduceRight" : "reduce"))](function(found, toast, index)  {
      if (found || toast.toastId !== toastId) {
        return false;
      }
      this.setState(update(state, {
        toasts: { $splice: [[index, 1]] }
      }));
      return true;
    }.bind(this), false);
  },

  _render:function (props, state) {
    return React.createElement("div", React.__spread({},  props, {"aria-live": "polite", role: "alert"}), 
      state.toasts.map(function(toast)  {
        return props.toastMessageFactory(toast);
      })
    );
  }
});
