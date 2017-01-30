var dfa = new DFA([],[],['0','1']);
var newwork = {};
var statesDS = [];
var transitionsDS = [];

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
    if(confirm('If you delete a symbol, all transitions linked to the symbol will also be deleted. Continue?')){
        console.log('Symbol ', dfa.alphabet[pos], 'deleted');
        var toDelete = [];
        dfa.transitions.filter(x => x.label == dfa.alphabet[pos]).forEach(x => toDelete.push(x.id));
        dfa.transitions = dfa.transitions.filter(x => x.label != dfa.alphabet[pos]);
        deleteVisTransition(toDelete);
        dfa.alphabet.splice(pos);
        this.renderAlphabetSection();
        
    }
}

addState = function(){
    let value = document.getElementById('newState').value;
    let isFinal = document.getElementById('isFinal').checked;
    if(dfa.states.filter(x => x.label == value).length == 0){
        dfa.addState(value, isFinal);
        statesDS.add(dfa.states[dfa.states.length -1]);
        this.renderStatesSection();
        console.log('State ', value, 'added');
        
    }
    document.getElementById('newState').value = '';
    document.getElementById('isFinal').checked = false;
    return false;
}

editState = function(pos){
    let label = document.getElementById('stateLabel').value;
    dfa.states[pos].label = label;
    statesDS.update(dfa.states[pos]);
    renderStatesSection();
}

deleteState = function(pos){
    if(confirm('If you delete a state, all transitions linked to the state will also be deleted. Continue?')){
        console.log('State ', dfa.states[pos].label, 'deleted');
        deleteVisState([dfa.states[pos].id]);
        let t_to_delete = dfa.transitions.filter(x => x.from == dfa.states[pos].id || x.to == dfa.states[pos].id);
        let array = [];
        t_to_delete.forEach(x => array.push(x.id));
        deleteVisTransition(array);
        dfa.deleteState(pos);
        this.renderStatesSection();
        this.renderTransitionsSection();
        
    }
}

editar = function(){
    if(edit == 'state'){
        editState(posi);
    }else if(edit == 'transition'){
        editTransition(posi);
    }
    $('#edit').modal('hide');
}

addTransition = function(){
    let frm = parseInt(document.getElementById('fromOptions').value);
    let to = parseInt(document.getElementById('toOptions').value);
    let label = document.getElementById('newTransition').value;
    if(dfa.transitions.filter(x => x.from == frm && x.to == to && x.label == label).length == 0){
        if(!dfa.addTransition(frm, to, label))
            return false;
        transitionsDS.add(dfa.transitions[dfa.transitions.length -1]);
        this.renderTransitionsSection();
        console.log('Transition from ',frm, ' to ', to, ' label ', label, ' added');
        console.log(JSON.stringify(dfa.transitions));
        
    }

    return false;
}

editTransition = function(pos){
    let label = document.getElementById('transitionLabel').value;
    let frm = document.getElementById('transitionFrom').value;
    let to = document.getElementById('transitionTo').value;
    dfa.transitions[pos].label = label;
    dfa.transitions[pos].from = frm;
    dfa.transitions[pos].to = to;
    transitionsDS.update(dfa.transitions[pos]);
    renderTransitionsSection();
}

deleteTransition = function(pos){
    if(confirm('Confirm deletion of Transition')){
        console.log('Transition from ',dfa.transitions[pos].from, ' to ', dfa.transitions[pos].to, ' label ', dfa.transitions[pos].label, ' added');
        this.deleteVisTransition([dfa.transitions[pos].id]);
        dfa.transitions.splice(pos,1);
        this.renderTransitionsSection();
        
    }
}

deleteVisTransition = function(ids){
    ids.forEach(x => transitionsDS.remove({id: x}));
}

deleteVisState = function(ids){
    ids.forEach(x => statesDS.remove({id: x}));
}

evaluateDFA = function(){
    let str = document.getElementById('str').value;
    let result = dfa.eval(str);
    
    let target = document.getElementById('result');
    let html = `<span class="fui-` + (result ? `check` : `cross`) + `"></span>`;
    target.innerHTML = html;

    return false;
}

window.onload = function(){
  // create an array with statess
  let states = [], transitions = [];
  states = [
  {id: 0, label: 'root'},
  {id: 1, label: '0'},
  {id: 2, label: '01'}
  ];

    // create an array with transitions
    transitions = [
    {from: 0, to: 0, label: '1'},
    {from: 0, to: 1, label: '0'},
    {from: 1, to: 2, label: '1'},
    {from: 2, to: 2, label: '0'}
    ];

    dfa = new DFA(states, transitions, ['0', '1']);
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
    let options = {};

    // initialize your network!
    network = new vis.Network(container, data, options);
    /*statesDS.add({id: 5, label: 'Node 5'});
    statesDS.update({id: 5, label: "Changed"});
    //transitions.push({from: 2, to: 4, label: 'a'});
    network.setData({
        nodes: statesDS,
        edges: new vis.DataSet(transitions)
    });*/
    //network.redraw();
    this.renderHTML();
}