var Node = Backbone.Model.extend({

	defaults: {
		value: -1,
		parent: null,
		leftChild: null,
		rightChild: null
	},

	initialize: function() {

	},

	fill: function(params) {
		this.setParent(params.parent);
	},

	getValue: function() {
		return this.get('value');
	},

	getParent: function() {
		return this.get('parent');
	},

	getLeftChild: function() {
		return this.get('leftChild');
	},

	getRightChild: function() {
		return this.get('rightChild');
	},

	setValue: function(val) {
		return this.set('value', val);
	},

	setParent: function(par) {
		return this.set('parent', par);
	},

	setLeftChild: function(lc) {
		return this.set('leftChild', lc);
	},

	setRightChild: function(rc) {
		return this.set('rightChild', rc);
	},

	calculateValue: function() {
		var parent = this.getParent();
		if (parent != null) {
			parent = parent.getModel();
			var val = parent.getValue();

			if (parent.getLeftChild().getModel() == this) {
				val += parent.getSide('left', 0);
			}
			else if (parent.getRightChild().getModel() == this) {
				val += parent.getSide('right', 0);
			}
			else alert("Parent node does not have this as a child");

			this.setValue(val);
		}
		else this.setValue(1);
	},

	getSide: function(side, level) {
		var parent = this.getParent();
		var val = 0;

		if (parent != null) {
			parent = this.getParent().getModel();
			if (side == 'left') {
				if (parent.getRightChild().getModel() == this) {
					val = parent.getLeftChild().getModel().getNeighborValue(level, 'right');
				}
				else val += parent.getSide(side, level + 1);
			}
			else {
				if (parent.getLeftChild().getModel() == this) {
					val = parent.getRightChild().getModel().getNeighborValue(level, 'left');
				}
				else val = parent.getSide(side, level + 1);
			}
		}

		return val;
	},

	getNeighborValue: function(level, side) {
		var val = 0;

		if (level == 0) {
			val = this.getValue();
		}
		else {
			if (side == 'left') {
				val = this.getLeftChild().getModel().getNeighborValue(level - 1, side)
			}
			else {
				val = this.getRightChild().getModel().getNeighborValue(level - 1, side);
			}	
		}

		return val;
	}

});

var NodeView = Backbone.View.extend({

	className: "nodeView",

	initialize: function(params) {
		var format = '<input size="5" style="background-color: #e9e9e9;" readonly>';

		this.model = new Node();

		this.model.fill(params);

		this.$el.html(format);

		$('.tree').append(this.$el);

		if (params.levels > 0 && this.model.getParent() == null) {
			this.updateValue();

			var levels = params.levels;
			for (var i = 0; i < levels - 1; i++) {
				$('.tree').append('<div class="row"></div>');
				this.addChildren(i);
				this.calculateLevelValue(i);
			}
		}


	},

	getModel: function() {
		return this.model;
	},

	addChildren: function(level) {
		if (level == 0) {

			this.model.setLeftChild(new NodeView({
				levels: level - 1,
				parent: this
			}));

			this.model.setRightChild(new NodeView({
				levels: level - 1,
				parent: this
			}));
		}
		else {
			this.model.getLeftChild().addChildren(level - 1);
			this.model.getRightChild().addChildren(level - 1);
		}
	},

	calculateLevelValue: function(level) {
		if (level == 0) {
			this.model.getLeftChild().updateValue();
			this.model.getRightChild().updateValue();
		}
		else {
			this.model.getLeftChild().calculateLevelValue(level - 1);
			this.model.getRightChild().calculateLevelValue(level - 1);
		}
	},

	updateValue: function() {
		this.model.calculateValue();
		var v = this.model.getValue();
		this.$('input').val(v);
	}

});

var rootNode = new NodeView({
	levels: 5,
	parent: null
});