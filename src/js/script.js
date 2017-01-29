function sayHello( s ){
	// create an array with nodess
	let nodes = 
		[
		{id: 1, label: 'Node 1'},
		{id: 2, label: 'Node 2'},
		{id: 3, label: 'Node 3'},
		{id: 4, label: 'Node 4'},
		{id: 5, label: 'Node 5'}
		];

    // create an array with edges
    let edges = [
    	{from: 0, to: 2, label: 'a'},
    	{from: 0, to: 1, label: 'a'},
    	{from: 1, to: 3, label: 'b'},
    	{from: 1, to: 4, label: 'b'},
    	{from: 2, to: 4, label: 'a'}
    	];

    let dfa = new DFA(nodes, edges, ['a', 'b']);

    // create a network
    let container = document.getElementById('mynetwork');

    // provide the data in the vis format
    let data = {
    	nodes: dfa.nodes,
    	edges: dfa.edges
    };
    let options = {};

    // initialize your network!
    let network = new vis.Network(container, data, options);
}