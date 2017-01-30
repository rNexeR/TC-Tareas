var dfa = new DFA([],[],['a', 'b']);
var newwork = {};

addAlphabet = function(){
    let value = document.getElementById('newSymbol').value;
    if(!dfa.alphabet.includes(value)){
        dfa.alphabet.push(value);
        this.renderAlphabetSection();
        console.log('Symbol ', value, 'added');
    }
    document.getElementById('newSymbol').value = '';
    return false;
}

deleteAlphabet = function(pos){
    if(confirm('Confirm deletion of symbol')){
        console.log('Symbol ', dfa.alphabet[pos], 'deleted');
        delete dfa.alphabet[pos];
        this.renderAlphabetSection();
    }
}

addState = function(){
    let value = document.getElementById('newState').value;
    let isFinal = document.getElementById('isFinal').checked;
    console.log("Add state?", value, isFinal, dfa.states.filter(x => x.label == value).length == 0);
    if(dfa.states.filter(x => x.label == value).length == 0){
        dfa.addState(value, isFinal);
        this.renderStatesSection();
        console.log('State ', value, 'added');
    }
    document.getElementById('newState').value = '';
    document.getElementById('isFinal').checked = false;
    return false;
}

deleteState = function(pos){
    if(confirm('If you delete a state, all transitions linked to the state will also be deleted. Continue?')){
        console.log('State ', dfa.states[pos].label, 'deleted');
        dfa.deleteState(pos);
        this.renderStatesSection();
    }
}

addTransition = function(){
    let from = parseInt(document.getElementById('fromOptions').value);
    let to = parseInt(document.getElementById('toOptions').value);
    let label = document.getElementById('newTransition').value;
    if(dfa.transitions.filter(x => x.from == from && x.to == to).length == 0){
        dfa.transitions.push({from: from, to: to, label: label});
        this.renderTransitionsSection();
        console.log('Transition from ',from, ' to ', to, ' label ', label, ' added');
        console.log(JSON.stringify(dfa.transitions));
    }

    return false;
}

deleteTransition = function(pos){

}

window.onload = function(){
    this.renderHTML();
  // create an array with statess
  let states = [
  {id: 0, label: 'Node 0'},
  {id: 1, label: 'Node 1'},
  {id: 2, label: 'Node 2'},
  {id: 3, label: 'Node 3'},
  {id: 4, label: 'Node 4'}
  ];

    // create an array with transitions
    let transitions = [
    {from: 0, to: 2, label: 'a'},
    {from: 0, to: 1, label: 'a'},
    {from: 1, to: 3, label: 'b'},
    {from: 1, to: 4, label: 'b'},
    ];

    dfa = new DFA(states, transitions, ['a', 'b']);
    this.renderHTML();

    // create a network
    let container = document.getElementById('mynetwork');

    // provide the data in the vis format
    let nodesDS = new vis.DataSet(states);
    let transitionsDS = new vis.DataSet(transitions);

    let data = {
        nodes: nodesDS,
        edges: transitionsDS
    };
    let options = {};

    // initialize your network!
    network = new vis.Network(container, data, options);
    nodesDS.add({id: 5, label: 'Node 5'});
    nodesDS.update({id: 5, label: "Changed"});
    transitions.push({from: 2, to: 4, label: 'a'});
    network.setData({
        nodes: nodesDS,
        edges: new vis.DataSet(transitions)
    });
    network.redraw();
}

updateGraph = function(){

}