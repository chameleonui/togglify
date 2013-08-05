var $ = require('jquery');
var Emitter = require('emitter');

module.exports = Togglify;

var defaults = {
	toggleClass: 'is-open',
	clickEvent: 'click.togglify.api'
};

function Togglify(Element, options){
	this.options = options || {};
	for (var i in defaults) {
		if (!(this.options[i])) this.options[i] = defaults[i];
	}

	this._element = Element;
	this._$element = $(this._element);
	this._dataTarget = null;
	
	return this;
}

Emitter(Togglify.prototype);

Togglify.prototype.hasClass = function(_self, className) {
	var check = className || this.options.toggleClass;
	return _self.parents(this._getDataTarget(_self)).hasClass(check);
};

Togglify.prototype._getDataTarget = function(_self) {
	this._dataTarget = _self.data('target') || 'li';
	return this._dataTarget;
};

Togglify.prototype.toggle = function(_self, className) {
	if (this.hasClass(_self, className)) {
		this.close(_self);
	} else {
		this.open(_self);
	}

	this.emit('toggle');
	return this;
};

Togglify.prototype.open = function(_self) {
	_self.parents(this._getDataTarget(_self)).addClass(this.options.toggleClass);

	this.emit('open');
	return this;
};

Togglify.prototype.close = function(_self) {
	_self.parents().removeClass(this.options.toggleClass);

	this.emit('close');
	return this;
};

Togglify.prototype.toggleAll = function(_self) {
	if (this.hasClass(_self)) {
		this.closeAll();
	} else {
		this.closeAll().open(_self);
	}

	this.emit('toggleAll');
	return this;
};

Togglify.prototype.closeAll = function() {
	this._$element.parents().removeClass(this.options.toggleClass);

	this.emit('closeAll');
	return this;
};


Togglify.prototype.onClickToggle = function() {
	var _this = this;
	this._$element.on(this.options.clickEvent, function(e){
		e.stopPropagation();
		e.preventDefault();
		_this.toggle($(this));
	});

	this.emit('onClickToggle');
};

Togglify.prototype.onClickToggleAll = function() {
	var _this = this;
	this._$element.on(this.options.clickEvent, function(e){
		e.stopPropagation();
		e.preventDefault();
		_this.toggleAll($(this));
	});

	this.emit('onClickToggle');
	return this;
};

Togglify.prototype.offClickCloseAll = function() {
	var _this = this;
	$('html').on(this.options.clickEvent, function(e){
		e.stopPropagation();
		_this.closeAll();
	});

	this.emit('offClickCloseAll');
	return this;
};

