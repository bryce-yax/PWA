let pokemonHistory = [];
const API_BASE = "https://api.pokemontcg.io/v1/";
const API_pokemon = API_BASE + "cards?name=";
const HISTORY_STORAGE_KEY = "HISTORY_KEY";

function buildpokemonMarkup(pokemon){
    if(pokemon.text == undefined){
        return `<div class="pokemon_item"><img class='pokemon_image' src=${pokemon.imageUrl} /><h2 class='pokemon_name'>${pokemon.name}</h2><p class='pokemon_description'>${"No text provided"}</p></div>`;
    }else{
        return `<div class="pokemon_item"><img class='pokemon_image' src=${pokemon.imageUrl} /><h2 class='pokemon_name'>${pokemon.name}</h2><p class='pokemon_description'>${pokemon.text}</p></div>`;
    }
}

function buildHistoryMarkup(pokemon){
    return '<div class="pokemon_item_history"><h4 class="pokemon_name_history">' + pokemon.name + '</h4><img class="pokemon_image_history" src="' + pokemon.imageUrl + '"/></div>';
}

function updateHistory(pokemon) {
    pokemonHistory.push(pokemon);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(pokemonHistory));

    if(document.querySelector('#history').childElementCount >= 6){
        document.querySelector('#history').removeChild(document.querySelector('#history').lastElementChild);
        addpokemonToHistoryTag(pokemon);
    }else{
        addpokemonToHistoryTag(pokemon);
    }
}

function addpokemonToHistoryTag(pokemon) {
    document.querySelector('#history').innerHTML = buildHistoryMarkup(pokemon) + document.querySelector('#history').innerHTML;
}

async function onOkButtonClickAsync() {
    let targetElementId = '#main_pokemon';
    let pokemonName = document.querySelector("#pokemon_name_input").value;
    try {
        const response = await fetch(API_pokemon + pokemonName);
        if (!response.ok) {
            return;
        }
        let pokemon = await response.json();
        document.querySelector(targetElementId).innerHTML = buildpokemonMarkup(pokemon["cards"][0]);
        updateHistory(pokemon["cards"][0]);
    } catch (err) {
        console.error(`error ${err}`);
    }
}

function getLocalHistsory(){
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY));
}

async function onLoadHistoryAsync(){
    let history = getLocalHistsory();
    if(history !== null){
        pokemonHistory = history;
        for(var i=0; i < pokemonHistory.length; i++){
            addpokemonToHistoryTag(pokemonHistory[i]);
        }
    }

    if('serviceWorker' in navigator){
        try{
            let serviceWorker = await navigator.serviceWorker.register('/components/utilities/PWA/sw.js');
            console.log('Service worker registers ' + serviceWorker);
        }catch(err){
            console.log('Failed to register service worker: ' + err);
        }
    }
}

async function onLoadAsync(){
    let history = getLocalHistsory();
    if(history !== null){
        pokemonHistory = history;
        if(pokemonHistory.length > 5){
            for(var i=0; i < 6; i++){
                addpokemonToHistoryTag(pokemonHistory[i]);
            }
        }else{
            for(var i=0; i < pokemonHistory.length; i++){
                addpokemonToHistoryTag(pokemonHistory[i]);
            }
        }
    }

    if('serviceWorker' in navigator){
        try{
            let serviceWorker = await navigator.serviceWorker.register('/components/utilities/PWA/sw.js');
            console.log('Service worker registers ' + serviceWorker);
        }catch(err){
            console.log('Failed to register service worker: ' + err);
        }
    }
}