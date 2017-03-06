setDfaExample = function(){
    let states = [
    {id: 0, label: 'root', root: true},
    {id: 1, label: '0'},
    {id: 2, label: '01', final: true},
    {id: 3, label: '010', final: true}
    ];
    // create an array with transitions
    let transitions = [
    {from: 0, to: 0, label: '1'},
    {from: 0, to: 1, label: '0'},
    {from: 1, to: 2, label: '1'},
    {from: 2, to: 3, label: '0'}
    ];
    automata = new Automaton("dfa", states, transitions, ['0', '1']);

    let container = document.getElementById('mynetwork');

    // provide the data in the vis format
    statesDS = new vis.DataSet(states);
    transitionsDS = new vis.DataSet(transitions);

    let data = {
        nodes: statesDS,
        edges: transitionsDS
    };
    //let options = {};
    let options = {
        "nodes": {
          "shapeProperties": {
              "interpolation": false
          }
      }
  };

    // initialize your network!
    network = new vis.Network(container, data, options);
    renderHTML();
}

setNfaExample = function(){
    let states = [], transitions = [];
    states = [
    {id: 0, label: 'a', root: true},
    {id: 1, label: 'b'},
    {id: 2, label: 'c'},
    {id: 3, label: 'd'},
    {id: 4, label: 'e', final: true}
    ];

    // create an array with transitions
    transitions = [
    {from: 0, to: 0, label: '0'},
    {from: 0, to: 1, label: '0'},
    {from: 0, to: 2, label: '0'},
    {from: 0, to: 3, label: '0'},
    {from: 0, to: 3, label: '1'},
    {from: 0, to: 4, label: '0'},
    {from: 0, to: 4, label: '1'},
    {from: 1, to: 4, label: '1'},
    {from: 1, to: 2, label: '0'},
    {from: 2, to: 1, label: '1'},
    {from: 3, to: 4, label: '0'},
    ];

    automata = new Automaton("nfa", states, transitions, ['0', '1']);
    //this.renderHTML();

    // create a network
    let container = document.getElementById('mynetwork');

    // provide the data in the vis format
    statesDS = new vis.DataSet(states);
    transitionsDS = new vis.DataSet(transitions);

    let data = {
        nodes: statesDS,
        edges: transitionsDS
    };
    //let options = {};
    let options = {
        "nodes": {
          "shapeProperties": {
              "interpolation": false
          }
      }
  };

    // initialize your network!
    network = new vis.Network(container, data, options);
    renderHTML();
}

setNfaeExample = function(){
    let states = [], transitions = [];
    states = [
    {id: 0, label: 'q0', root: true},
    {id: 1, label: 'q1'},
    {id: 2, label: 'q2'},
    {id: 3, label: 'q3', final: true}
    ];

    // create an array with transitions
    transitions = [
    {from: 0, to: 1, label: '1'},
    {from: 1, to: 0, label: '#'},
    {from: 1, to: 2, label: '0'},
    {from: 2, to: 3, label: '1'},
    {from: 2, to: 3, label: '#'},
    ];

    automata = new Automaton("nfa-e", states, transitions, ['0', '1']);
    //this.renderHTML();

    // create a network
    let container = document.getElementById('mynetwork');

    // provide the data in the vis format
    statesDS = new vis.DataSet(states);
    transitionsDS = new vis.DataSet(transitions);

    let data = {
        nodes: statesDS,
        edges: transitionsDS
    };
    //let options = {};
    let options = {
        "nodes": {
          "shapeProperties": {
              "interpolation": false
          }
      }
  };

    // initialize your network!
    network = new vis.Network(container, data, options);
    renderHTML();
}