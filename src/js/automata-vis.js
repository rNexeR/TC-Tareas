var automata = new Automaton("dfa",[],[],[]);
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

storeAutomata = function(){
    automataList.push(automata);
    if(automataList.length > 2){
        automataList.shift();
    }
    alert("Automata saved");
}

clearAutomata = function(){
    automata = new Automaton("dfa",[],[],[]);
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
    converted = new Automaton(obj.type, obj.states, obj.transitions, obj.alphabet);
    setConvertedToDefault();
}

createJSON = function(){
    let obj = {};
    obj.type = automata.type;
    obj.states = automata.states;
    obj.transitions = automata.transitions;
    obj.alphabet = automata.alphabet;
    document.getElementById('fromJSON').value = JSON.stringify(obj);
}

joinAutomatas = function(){
    if(automataList.length == 2){
        converted = join(automataList[0], automataList[1]);
        setConvertedToDefault();
    }
}

intersetAutomatas = function(){
    if(automataList.length == 2){
        converted = intersection(automataList[0], automataList[1]);
        setConvertedToDefault();
    }
}

complementAutomata = function(){
    converted = complement(automata);
    setConvertedToDefault();
}

minimizeAutomata = function(){
    converted = automata.minimize();
    setConvertedToDefault();
}

testUnion = function(){
    let json = `{"type":"dfa","states":[{"id":0,"label":"q0","root":true,"final":false,"color":"#34495e","font":{"color":"white"}},{"id":1,"label":"q1","root":false,"final":false,"color":"#bdc3c7"},{"id":2,"label":"q2","root":false,"final":true,"color":"#2ecc71"},{"id":3,"label":"q3","root":false,"final":true,"color":"#2ecc71"}],"transitions":[{"id":0,"from":0,"to":1,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":1,"from":1,"to":2,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":2,"from":1,"to":1,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":3,"from":2,"to":3,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"}],"alphabet":["0","1"]}`;
    let obj = JSON.parse(json);
    let a1 = new Automaton(obj.type, obj.states, obj.transitions, obj.alphabet);

    json = `{"type":"dfa","states":[{"id":0,"label":"root","root":true,"color":"#34495e","font":{"color":"white"}},{"id":1,"label":"0","color":"#bdc3c7"},{"id":2,"label":"01","final":true,"color":"#2ecc71"},{"id":3,"label":"010","final":true,"color":"#2ecc71"}],"transitions":[{"from":0,"to":0,"label":"1","id":0,"font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"from":0,"to":1,"label":"0","id":1,"font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"from":1,"to":2,"label":"1","id":2,"font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"from":2,"to":3,"label":"0","id":3,"font":{"align":"top"},"arrows":"to","color":"#f1c40f"}],"alphabet":["0","1"]}`;
    obj = JSON.parse(json);
    let a2 = new Automaton(obj.type, obj.states, obj.transitions, obj.alphabet);

    converted = union(a1, a2);
    setConvertedToDefault();
}

testMinimize = function(){
    let json = `{"type":"dfa","states":[{"label":"a","color":"#34495e","id":0,"root":true,"font":{"color":"white"}},{"label":"b","color":"#bdc3c7","id":1},{"label":"c","color":"#2ecc71","id":2,"final":true},{"label":"d","color":"#bdc3c7","id":3},{"label":"e","color":"#bdc3c7","id":4},{"label":"f","color":"#bdc3c7","id":5},{"label":"g","color":"#bdc3c7","id":6},{"label":"h","color":"#bdc3c7","id":7}],"transitions":[{"id":0,"from":0,"to":1,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":1,"from":0,"to":5,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":2,"from":1,"to": 2,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":3,"from":1,"to":6,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":4,"from": 2,"to":0,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":5,"from": 2,"to": 2,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":6,"from":3,"to": 2,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":7,"from":3,"to":6,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":8,"from":4,"to":5,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":9,"from":4,"to":7,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":10,"from":5,"to":6,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":11,"from":5,"to": 2,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":12,"from":6,"to":6,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":13,"from":6,"to":4,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":14,"from":7,"to":6,"label":"0","font":{"align":"top"},"arrows":"to","color":"#f1c40f"},{"id":15,"from":7,"to": 2,"label":"1","font":{"align":"top"},"arrows":"to","color":"#f1c40f"}],"alphabet":["0","1"]}`;
    let obj = JSON.parse(json);
    converted = new Automaton(obj.type, obj.states, obj.transitions, obj.alphabet);
    setConvertedToDefault();
    minimizeAutomata();
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