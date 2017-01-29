class DFA{
	constructor(nodes = [], edges = [], alphabet = []){
		if(!alphabet)
			return;
		this.nodes = nodes;
		this.alphabet = alphabet;

		if(this.checkAlphabet(edges)){
			this.edges = edges;
			this.transformEdges();
		}else{
			alert("Error adding transitions, value not found in alphabet" );
			return;
		}

		this.transformNodes();

		this.nextId = nodes.length;
		console.log("DFA created:" + JSON.stringify(this.nodes));
	}

	checkAlphabet(edges){
		for (var i = edges.length - 1; i >= 0; i--) {
			if (!this.alphabet.includes(edges[i].label))
				return false;
		}
		return true;
	}

	addNode(node, isFinal){
		node.color = '#3498db';
		node.id = nextId++;
		if(this.nodes.length == 0)
			node.color = '#34495e';
		else if(isFinal)
			node.color = '#2ecc71';

		this.nodes.push(node);
	}

	transformNodes(){
		for (var i = this.nodes.length - 1; i >= 0; i--) {
			if(i == 0){
				this.nodes[i].color = '#34495e';
				this.nodes[i].font = {color: 'white'};
			}
			this.nodes[i].id = i;
		}
	}

	transformEdges(){
		for (var i = this.edges.length - 1; i >= 0; i--) {
			this.edges[i].font = {align: 'top'};
			this.edges[i].arrows = 'to';
			this.edges[i].color = '#3498db';
		}
	}


}