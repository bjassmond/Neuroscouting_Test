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

});

var NodeView = Backbone.View.extend({

	className: "nodeView",

	initialize: function(params) {
		var format = '<input size="5" style="background-color: #e9e9e9;" readonly>';

		this.model = new Node();

		this.model.fill(params);

		this.$el.html(format);

		var v = this.model.getValue();
		this.$('input').val(v);

		$('.tree').append(this.$el);

		if (params.levels > 0 && this.model.getParent() == null) {
			var levels = params.levels;
			for (var i = 0; i < levels; i++) {
				$('.tree').append('<div class="row"></div>');
				this.addChildren(i);
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
	}

});

var rootNode = new NodeView({
	levels: 2,
	parent: null
});