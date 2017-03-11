var automata = new PDA([],[],[]);
var automataList = [];
var network = {};
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
    try{

        let frm = parseInt(document.getElementById('fromOptions').value);
        let to = parseInt(document.getElementById('toOptions').value);
        let symbol = document.getElementById('symbolTransition').value;
        let head = document.getElementById('headTransition').value;
        let push = [];

        if(document.getElementById('pushTransition').value != "")
            push = document.getElementById('pushTransition').value.split('|')

        let has = automata.transitions.filter(x => x.from == frm && x.to == to);

        if(!automata.addTransition(frm, to, symbol, head, push))
            return false;
        if(has.length == 0){
            transitionsDS.add(automata.transitions[automata.transitions.length -1]);
        }else{
            has.push(automata.transitions[automata.transitions.length -1])
            let label = has.map(x => x.label).join("\n");
            transitionsDS.update({id: has[0].id, from: has[0].from, to: has[0].to, label: label})
        }
        this.renderTransitionsSection();
        console.log('Transition from ',frm, ' to ', to, ' symbol ', symbol, ' added');
        console.log(JSON.stringify(automata.transitions));


    }catch(e){
        alert(e)
        console.log(e);
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

//Vis functions to update transitions and states
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
        console.log(e);
        alert(e);
    }
    return false
}

setConvertedToDefault = function(){
    this.automata = new PDA(this.converted.states, this.converted.transitions, this.converted.alphabet);
    statesDS = new vis.DataSet(automata.states);
    transitionsDS = new vis.DataSet(automata.transitions);
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
    let container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
    $('#newConversion').modal('hide');
    renderHTML();
}

storeAutomata = function(){
    automataList.push(automata);
    if(automataList.length > 2){
        automataList.shift();
    }
    alert("Automata saved");
}

clearAutomata = function(){
    automata = new PDA("dfa",[],[],[]);
    statesDS = new vis.DataSet(automata.states);
    transitionsDS = new vis.DataSet(automata.transitions);
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
    let container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
    //this.network.setData({nodes: automata.states, edges: automata.transitions});
    renderHTML();
}

createAutomata = function(){
    let json = document.getElementById('fromJSON').value;
    let obj = JSON.parse(json);
    converted = new PDA(obj.states, obj.transitions, obj.alphabet);
    setConvertedToDefault();
}

createJSON = function(){
    let obj = {};
    obj.states = automata.states;
    obj.transitions = automata.transitions;
    obj.alphabet = automata.alphabet;
    document.getElementById('fromJSON').value = JSON.stringify(obj);
}

testCFG = function(){
    let cfg = `S->T+T
      T->0
      |1`.replace(" ", "");
      let terminals = ["1", "0", "+"];
      let principals = [];

      converted = automata.fromCFG(cfg, terminals, principals);
    setConvertedToDefault();
}

createAutomataFromCFG = function(){
    let cfg = document.getElementById('fromCFG').value.replace(" ", "");
    let terminals = document.getElementById('terminals').value.split("|");
    let principals = document.getElementById('principals').value.split("|");

    converted = automata.fromCFG(cfg, terminals, principals);
    setConvertedToDefault();
}

window.onload = function(){
    // let output = peg$parse('(1+2).2*');
    // alert(JSON.stringify(output));
/*    let hi = "hello";
alert(hi.substr(1));*/
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