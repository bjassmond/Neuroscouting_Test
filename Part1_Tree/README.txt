High-level description:

	This tree program was made using HTML, CSS, and JavaScript coding. As such, it may be run by simply opening the webpage (index.html) in any modern browser. Just make sure to keep the filesystem intact, as it has the libraries and other files it requires stored locally.

	The program starts out with a question: "How many levels would you like to generate in the tree?" with an empty textbox. When the user inputs a number and presses "Enter" or "Tab", the program generates a binary tree with the specified number of levels and organizes the nodes into evenly sized cells, with the parent nodes horizontally centered above their children. The values of the nodes are the sum of the parent (1 if none exists) and the value of the node neighboring the parent in the direction the node is relative to the parent (if the node is the left child, it adds the left neighbor). If there is no neighboring node, the value is simply the parent's value.

	To achieve this, the tree is processed level by level, calculating the values of the new level after the nodes have been placed.

Organization:

	I opted, for no particular reason, to include all files in a single main.js file for this exercise. All dependencies, locally stored, are loaded in the head of the HTML file before the script is run.

	The main library I used was Backbone, a model-view-controller library meant to organize program modules up into their actual purposes. The model contains the data and the view is how the model is displayed. I made models and views each for the tree input and nodes. The node model holds a value and references to adjacent nodes (parent and children) and the tree input model holds value to use with the tree (is currently unused). The node view formats the nodes into evenly distributed spreadsheet cells, with the nodes themselves being clear while the unused cells are gray. The tree input view specifies the question and input box that is displayed as well as starts the tree generation.

	Control flows begins with the tree input view, which, when a value is input and "Enter" or "Tab" is pressed, declares a root node for the tree. Control then changes to the node view, creating the root node first, and then beginning to generate additional levels. For each level, the current tree branches are traversed and new nodes are added to the specified level. After all the new nodes have been declared, the branches are traversed again to the new nodes and their values are calculated by adding their parent to the result of traversing the tree to find the correct neighbor node (its value if there is one, 0 otherwise). Once all of the node levels are generated, the program waits for another input to generate a new tree.

Interesting Optimizations:

	I don't think I have any in this exercise. I thought about saving common values, such as the first 5 levels of a tree, as strings to parse, but since I went with the spreadsheet approach to avoid parsing the tree, it didn't suit my needs at the time.
	