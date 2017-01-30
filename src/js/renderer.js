renderAlphabetSection = function(){
    let target = document.getElementById('alphabet-list');
    let html = '';
    for(l in dfa.alphabet){
        html += `<li class="list-group-item"><button onclick="deleteAlphabet(`+l+`)" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>`+dfa.alphabet[l]+'</li>';
    }
    target.innerHTML = html;
}

renderStatesSection = function(){
    let target = document.getElementById('states-list');
    let html = '';
    for(l in dfa.states){
        html += `<li class="list-group-item"><button onclick="deleteState(`+l+`)" type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fui-cross" aria-hidden="true"></span></button><button onclick="editState(`+l+`)" type="button" class="close" aria-label="Edit"><span class="fui-new" aria-hidden="true"></span></button>`+dfa.states[l].label+'</li>';
    }
    target.innerHTML = html;

    target = document.getElementById('fromOptions');
    html = '';

    for(l in dfa.states){
        html += `<option value="`+dfa.states[l].id+`">`+dfa.states[l].label+`</option>`;
    }
    target.innerHTML = html;

    target = document.getElementById('toOptions');
    target.innerHTML = html;
}

renderTransitionsSection = function(){
    let target = document.getElementById('transitions-list');
    let html = '';
    for(l in dfa.transitions){
        html += `<li class="list-group-item"><button onclick="deleteTransition(`+l+`)" type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fui-cross" aria-hidden="true"></span></button><button onclick="editTransition(`+l+`)" type="button" class="close" aria-label="Edit"><span class="fui-new" aria-hidden="true"></span></button>From: `+dfa.transitions[l].from+`   To: `+dfa.transitions[l].to+`   Label: `+dfa.transitions[l].label+'</li>';
    }
    target.innerHTML = html;
}

renderHTML = function(){
    this.renderAlphabetSection();
    this.renderStatesSection();
    this.renderTransitionsSection();
}