/*
	var Node

	Description: The node model (defined as a model in Backbone) of a binary tree that holds a value and 
					links to adjacent nodes (parent and children);

*/

var Node = Backbone.Model.extend({

	// Default parameters
	defaults: {
		value: -1,
		parent: null,
		leftChild: null,
		rightChild: null
	},

	// Run when a new Node is declared
	initialize: function() {

	},

	// Sets the parent property
	fill: function(params) {
		this.setParent(params.parent);
	},


	// Get/Sets

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

	// End Get/Sets


	// Calculates and sets the value for a node. The calculation is the value of the parent and the neighboring
	// 		node in the same direction as this child node is to it's parent (left child -> get left neighbor, 
	// 		right -> right neighbor) if there is one.
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

	// If there is a parent to the current node, recursively try to find the neighbor on the given side
	// 		by running up the tree until the neighbor's branch and this branch meet (if they do) then 
	// 		running back down the neighbor's branch.
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

	// Runs down a branch to the given level and returns that value
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

/*
	var NodeView

	Description: The node view (defined as a view in Backbone) of a binary tree. It represents each
					node as a clear, readonly input box spaced apart by gray, readonly input boxes.

*/

var NodeView = Backbone.View.extend({

	// Class name for the HTML div
	className: "nodeView",

	// When a new NodeView is made, assign it a Node for it's model, give it it's parent, format it,
	// 		and add it to the HTML div for the tree. If this is the root node and there are multiple levels
	// 		to show, create them and then calculate them level by level.
	initialize: function(params) {
		var format = '<input class="node" size="2" readonly>';
		var space = '<input size=2 style="background-color: #e9e9e9;" readonly>';

		this.model = new Node();

		this.model.fill(params);

		this.$el.html(format);

		$('.tree').append(this.$el);

		if (params.levels > 0 && this.model.getParent() == null) {
			this.updateValue();
			var levels = params.levels;

			for (var j = 0; j < Math.pow(2, levels - 1)/2; j++) $('.nodeView').append(space);
			
			for (var i = 0; i < levels - 1; i++) {
				$('.tree').append('<div class="row"></div>');
				for (var j = 0; j < Math.pow(2, levels - 2 - i); j++) $('.nodeView').prepend(space);
				this.addChildren(i);
				for (var j = 0; j < Math.pow(2, levels - 2 - i)/2; j++) $('.nodeView').append(space);
				this.calculateLevelValue(i);
			}

			$('.tree').width((Math.pow(2, levels) + 1) * 35);
		}

	},

	// Get/Set


	getModel: function() {
		return this.model;
	},

	// End Get/Set

	// Recursively runs down the specified number of levels and adds children to the resulting node
	// 		Note: There is no null checking currently. This is only meant to be called by intialize();
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

	// Recursively runs down the specified number of levels and caculates the values for each of the 
	// 		children nodes at the specified level
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

	// Calculate the current node's value and assign it to the input box
	updateValue: function() {
		this.model.calculateValue();
		var v = this.model.getValue();
		this.$('input.node').val(v);
	}

});


/*
	var InputModel

	Description: The input model (defined as a model in Backbone) to specify the number of levels to
					generate for the binary tree.
*/
var InputModel = Backbone.Model.extend({

	// Default parameters
	defaults: {
		value: 0
	}

});

/*
	var InputView

	Description: The input view (defined as a view in Backbone) to display the direction text and input box
					to generate a number of levels for a binary tree.
*/

var InputView = Backbone.View.extend({

	// When declared, assign a new model to the view and format it's text to the HTML div. Bind a keypress
	// 		function to the view so when Enter or Tab is pressed, it resets the tree and generates a new one
	//		based on the held input.
	initialize: function(params) {
		var format = 'How many levels would you like to generate in the tree? <input size="2">';

		this.model = new InputModel();

		this.$el.html(format);

		$('.treeInput').append(this.$el);

		this.$('input').keypress(_.bind(function(event){
			if(event.keyCode === 13 || event.charCode === 13 ||
				event.keyCode === 9 || event.charCode === 9){

				$('.tree').html('');

				rootNode = new NodeView({
					levels: parseInt(event.currentTarget.value),
					parent: null
				})
			}
		}, this));

	}

});

// Declare the input view and root node.
new InputView();
var rootNode;
