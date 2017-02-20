var automata = new Automaton("dfa",[],[],[]);
var newwork = {};
var statesDS = [];
var transitionsDS = [];
var converted = {};

addAlphabet = function(){
    let value = document.getElementById('newSymbol').value;
    if(!automata.alphabet.includes(value)){
        automata.alphabet.push(value);
        this.renderAlphabetSection();
        console.log('Symbol ', value, 'added');
    }
    document.getElementById('newSymbol').value = '';
    return false;
}

deleteAlphabet = function(pos){
    if(confirm('If you delete a symbol, all transitions linked to the symbol will also be deleted. Continue?')){
        console.log('Symbol ', automata.alphabet[pos], 'deleted');
        var toDelete = [];
        automata.transitions.filter(x => x.label == automata.alphabet[pos]).forEach(x => toDelete.push(x.id));
        automata.transitions = automata.transitions.filter(x => x.label != automata.alphabet[pos]);
        deleteVisTransition(toDelete);
        automata.alphabet.splice(pos);
        this.renderAlphabetSection();
        
    }
}

addState = function(){
    let value = document.getElementById('newState').value;
    let isFinal = document.getElementById('isFinal').checked;
    if(automata.states.filter(x => x.label == value).length == 0){
        automata.addState(value, isFinal);
        statesDS.add(automata.states[automata.states.length -1]);
        this.renderStatesSection();
        console.log('State ', value, 'added');
        
    }
    document.getElementById('newState').value = '';
    document.getElementById('isFinal').checked = false;
    return false;
}

editState = function(pos){
    let label = document.getElementById('stateLabel').value;
    automata.states[pos].label = label;
    statesDS.update(automata.states[pos]);
    renderStatesSection();
}

deleteState = function(pos){
    if(confirm('If you delete a state, all transitions linked to the state will also be deleted. Continue?')){
        console.log('State ', automata.states[pos].label, 'deleted');
        deleteVisState([automata.states[pos].id]);
        let t_to_delete = automata.transitions.filter(x => x.from == automata.states[pos].id || x.to == automata.states[pos].id);
        let array = [];
        t_to_delete.forEach(x => array.push(x.id));
        deleteVisTransition(array);
        automata.deleteState(pos);
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
    if(automata.transitions.filter(x => x.from == frm && x.to == to && x.label == label).length == 0){
        if(!automata.addTransition(frm, to, label))
            return false;
        transitionsDS.add(automata.transitions[automata.transitions.length -1]);
        this.renderTransitionsSection();
        console.log('Transition from ',frm, ' to ', to, ' label ', label, ' added');
        console.log(JSON.stringify(automata.transitions));
        
    }

    return false;
}

editTransition = function(pos){
    let label = document.getElementById('transitionLabel').value;
    let frm = document.getElementById('transitionFrom').value;
    let to = document.getElementById('transitionTo').value;
    automata.transitions[pos].label = label;
    automata.transitions[pos].from = frm;
    automata.transitions[pos].to = to;
    transitionsDS.update(automata.transitions[pos]);
    renderTransitionsSection();
}

deleteTransition = function(pos){
    if(confirm('Confirm deletion of Transition')){
        console.log('Transition from ',automata.transitions[pos].from, ' to ', automata.transitions[pos].to, ' label ', automata.transitions[pos].label, ' added');
        this.deleteVisTransition([automata.transitions[pos].id]);
        automata.transitions.splice(pos,1);
        this.renderTransitionsSection();
        
    }
}

deleteVisTransition = function(ids){
    ids.forEach(x => transitionsDS.remove({id: x}));
}

deleteVisState = function(ids){
    ids.forEach(x => statesDS.remove({id: x}));
}

evaluateAutomata = function(){
    try{
        let str = document.getElementById('str').value;
        let result = automata.eval(str);

        let target = document.getElementById('result');
        let html = `<span class="fui-` + (result ? `check` : `cross`) + `"></span>`;
        target.innerHTML = html;

        return false;
    }catch(e){
        alert(e);
    }
}

setType =function(){
    let type = document.getElementById('automataType').value;
    this.automata.type = type;
    renderAutomataType();
    return false;
}

convertNFAToDFA = function(){
    this.converted = this.automata.nfaToDfa();
    renderConversion();
}

convertDFAToRegExp = function(){
    let regexp = this.automata.dfaToRegExp();
    renderConversionRegexp(regexp);
}

setConvertedToDefault = function(){
    this.automata = this.converted;
    this.network.setData({nodes: converted.states, edges: converted.transitions});
    $('#newConversion').modal('hide');
    renderHTML();
}

setDfaExample = function(){
    let states = [
    {id: 0, label: 'root'},
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
    {id: 0, label: 'a'},
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
    {id: 0, label: 'q0'},
    {id: 1, label: 'q1'},
    {id: 2, label: 'q2'},
    {id: 4, label: 'q3', final: true}
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

automataFromRegExp = function(){
    try{
        let regexp = document.getElementById('regexp').value;
        if(regexp != ""){
            converted = automata.fromRegExp(regexp);
            renderConversion();
        }
    }catch(e){
        alert(e);
    }
    return false;
}

window.onload = function(){
    // let output = peg$parse('(1+2).2*');
    // alert(JSON.stringify(output));
    let states = [], transitions = [];
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
    this.renderHTML();
}