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
	}

});

var NodeView = Backbone.View.extend({

	className: "nodeView",

	initialize: function(params) {
		var format = '< class="node">     <input size="5" style="background-color: #e9e9e9;" readonly>     </div>';

		this.model = new Node();

		this.model.fill(params);

		this.$el.html(format);

		var v = this.model.getValue();
		this.$('input').val(v);

		$('.tree').append(this.$el);

		if (params.levels > 0) {
			this.model.setLeftChild(new NodeView({
				levels: params.levels - 1,
				parent: this
			}));

			this.model.setRightChild(new NodeView({
				levels: params.levels - 1,
				parent: this
			}));
		}
	},

	getModel: function() {
		return this.model;
	}

});

var rootNode = new NodeView({
	levels: 0,
	parent: null
});