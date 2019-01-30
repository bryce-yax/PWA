let pokemonHistory = [];
const API_BASE = "https://api.pokemontcg.io/v1/";
const API_pokemon = API_BASE + "cards?name=";
const HISTORY_STORAGE_KEY = "HISTORY_KEY";

$(document).ready(function () {
    $('#apiSelection').on('click', '#selection_button', function () {
        var pokemon = getNewPokemonObject($(this).parent().children('img').attr('src'), $(this).parent().children('h2').text(), $(this).parent().children('p').text(), $(this).parent().children('h6').text());
        document.querySelector('#main_pokemon').innerHTML = buildpokemonMarkup(pokemon);
        updateHistory(pokemon);
        $('#apiSelection').empty();
    });
});

function getNewPokemonObject(img, name, text, url) {
    var pokemon = {
        imageUrl: img,
        name: name,
        text: text,
        url: url
    };
    return pokemon;
}

function buildpokemonMarkup(pokemon) {
    if (pokemon.text == undefined) {
        return `<div class="pokemon_item"><img crossorigin='anonymous' class='pokemon_image' src=${pokemon.imageUrl} /><h2 class='pokemon_name'>${pokemon.name}</h2><p class='pokemon_description'>${"No text provided"}</p></div>`;
    } else {
        return `<div class="pokemon_item"><img crossorigin='anonymous' class='pokemon_image' src=${pokemon.imageUrl} /><h2 class='pokemon_name'>${pokemon.name}</h2><p class='pokemon_description'>${pokemon.text}</p></div>`;
    }
}

function buildSelectionMarkup(pokemon, url) {
    var returnString = "<ul>";
    for (var i = 0; i < pokemon["cards"].length; i++) {
        if (pokemon["cards"][i].text == undefined) {
            returnString += "<li class='selectionLi'><img crossorigin='anonymous' class='selectionImg' src='" + pokemon["cards"][i].imageUrl + "'/><h2>" + pokemon["cards"][i].name + "</h2><p class='selectionDesc'>No Text Provided</p><button id='selection_button'>Select</button><h6 class='hiddenurl'>" + url + "</h6></li>";
        } else {
            returnString += "<li class='selectionLi'><img crossorigin='anonymous' class='selectionImg' src='" + pokemon["cards"][i].imageUrl + "'/><h2>" + pokemon["cards"][i].name + "</h2><p class='selectionDesc'>" + pokemon["cards"][i].text + "</p><button id='selection_button'>Select</button><h6 class='hiddenurl'>" + url + "</h6></li>";
        }
    }
    returnString += "</ul>";
    return returnString;
}

function buildHistoryMarkup(pokemon) {
    return '<div class="pokemon_item_history"><h4 class="pokemon_name_history">' + pokemon.name + '</h4><img crossorigin="anonymous" class="pokemon_image_history" src="' + pokemon.imageUrl + '"/></div>';
}

function updateHistory(pokemon) {
    pokemonHistory.push(pokemon);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(pokemonHistory));

    if (document.querySelector('#history').childElementCount >= 6) {
        document.querySelector('#history').removeChild(document.querySelector('#history').lastElementChild);
        addpokemonToHistoryTag(pokemon);
    } else {
        addpokemonToHistoryTag(pokemon);
    }
    updateCache(pokemon);
}

function addpokemonToHistoryTag(pokemon) {
    document.querySelector('#history').innerHTML = buildHistoryMarkup(pokemon) + document.querySelector('#history').innerHTML;
}

function updateCache(pokemon) {
    const jsonResponse = new Response(JSON.stringify(pokemon),{
        headers:{
            'content-type' : 'application/json'
        }
    });
    caches.open('V1').then(cache => cache.put(pokemon.url, jsonResponse));
}

async function onOkButtonClickAsync() {
    let pokemonName = document.querySelector("#pokemon_name_input").value;
    try {
        const response = await fetch(API_pokemon + pokemonName);
        if (!response.ok) {
            return;
        }
        let pokemon = await response.json();
        document.querySelector('#apiSelection').innerHTML = buildSelectionMarkup(pokemon, API_pokemon + pokemonName);
    } catch (err) {
        caches.match('https://api.pokemontcg.io/v1/cards?name=' + pokemonName).then(function(response){
            return response.json();
        }).then(function(data){
            document.querySelector('#apiSelection').innerHTML = buildpokemonMarkup(data);
        });
        //console.error(`error ${err}`);
    }
}

function getLocalHistsory() {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY));
}

async function onLoadHistoryAsync() {
    let history = getLocalHistsory();
    if (history !== null) {
        pokemonHistory = history;
        for (var i = 0; i < pokemonHistory.length; i++) {
            addpokemonToHistoryTag(pokemonHistory[i]);
        }
    }

    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker registers ' + serviceWorker);
        } catch (err) {
            console.log('Failed to register service worker: ' + err);
        }
    }
}

async function onLoadAsync() {
    let history = getLocalHistsory();
    if (history !== null) {
        pokemonHistory = history;
        if (pokemonHistory.length > 5) {
            for (var i = 0; i < 6; i++) {
                addpokemonToHistoryTag(pokemonHistory[i]);
            }
        } else {
            for (var i = 0; i < pokemonHistory.length; i++) {
                addpokemonToHistoryTag(pokemonHistory[i]);
            }
        }
    }

    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker registers ' + serviceWorker);
        } catch (err) {
            console.log('Failed to register service worker: ' + err);
        }
    }
}