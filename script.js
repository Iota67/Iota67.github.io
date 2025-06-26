let isLoading = false;

async function searchPokemon() {
    const input = document.getElementById('pokemonInput');
    const pokemonName = input.value.trim().toLowerCase();
    
    if (!pokemonName) {
        showError('Veuillez entrer le nom d\'une carte Yu-Gi-Oh!');
        return;
    }
    
    await fetchAndDisplayPokemon(pokemonName);
}

async function searchSpecificPokemon(pokemonName) {
    document.getElementById('pokemonInput').value = pokemonName;
    await fetchAndDisplayPokemon(pokemonName);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchPokemon();
    }
}

async function fetchAndDisplayPokemon(pokemonName) {
    if (isLoading) return;
    
    try {
        setLoading(true);
        clearResult();
        
        const pokemon = await fetchPokemon(pokemonName);
        
        displayPokemon(pokemon);
        
    } catch (error) {
        showError(`Erreur : ${error.message}. Vérifiez l'orthographe du nom de la carte.`);
    } finally {
        setLoading(false);
    }
}

async function fetchPokemon(pokemonName) {
    // changer l'url pour l'api que vous avez choisi
    const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${pokemonName}`;
    
    console.log(`Recherche de ${pokemonName}...`);
    console.log(`URL de l'API : ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Carte "${pokemonName}" non trouvée`);
    }
    
    const data = await response.json();
    console.log('Données reçues :', data);
    
    return data;
}

function displayPokemon(pokemon) {
    const resultDiv = document.getElementById('result');
    
    const card = pokemon.data[0];
    
    // Zone a modifier en html pour afficher les données de l'api Yu-Gi-Oh
    const cardDisplay = `
        <div class="pokemon-card">
            <div class="pokemon-header">
                <div class="pokemon-image">
                    <img src="${card.card_images[0].image_url}" 
                         alt="${card.name}"
                         onerror="this.src='https://via.placeholder.com/300x400?text=Image+non+disponible'">
                </div>
                <div class="pokemon-info">
                    <h3>${card.name}</h3>
                    <div class="pokemon-id">#${card.id}</div>
                    <div class="types">
                        <span class="type ${card.type.toLowerCase().replace(' ', '-')}">${card.type}</span>
                    </div>
                    ${card.attribute ? `<div class="attribute">Attribut: ${card.attribute}</div>` : ''}
                </div>
            </div>
            
            <div class="pokemon-details">
                <div class="detail-section">
                    <h4>Informations de base</h4>
                    <ul class="stats">
                        <li class="stat">
                            <span class="stat-name">Archétype</span>
                            <span class="stat-value">${card.archetype}</span>
                        </li>
                        <li class="stat">
                            <span class="stat-name">Type</span>
                            <span class="stat-value">${card.race}</span>
                        </li>
                        ${card.level ? `
                        <li class="stat">
                            <span class="stat-name">Niveau</span>
                            <span class="stat-value">${card.level}</span>
                        </li>
                        ` : ''}
                        ${card.atk ? `
                        <li class="stat">
                            <span class="stat-name">ATK</span>
                            <span class="stat-value">${card.atk}</span>
                        </li>
                        ` : ''}
                        ${card.def ? `
                        <li class="stat">
                            <span class="stat-name">DEF</span>
                            <span class="stat-value">${card.def}</span>
                        </li>
                        ` : ''}
                        ${card.scale ? `
                        <li class="stat">
                            <span class="stat-name">Échelle Pendulum</span>
                            <span class="stat-value">${card.scale}</span>
                        </li>
                        ` : ''}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4>Description</h4>
                    <div class="description">
                        ${card.desc}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Informations supplémentaires</h4>
                    <ul class="stats">
                        <li class="stat">
                            <span class="stat-name">Rareté</span>
                            <span class="stat-value">${card.card_sets ? card.card_sets.length + ' versions' : 'Non disponible'}</span>
                        </li>
                        <li class="stat">
                            <span class="stat-name">Prix</span>
                            <span class="stat-value">${card.card_prices && card.card_prices[0] ? 
                                `$${card.card_prices[0].cardmarket_price || 'N/A'}` : 'Non disponible'}</span>
                        </li>
                        <li class="stat">
                            <span class="stat-name">Archetype</span>
                            <span class="stat-value">${card.archetype || 'Aucun'}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    // modifier jusque la 
    
    resultDiv.innerHTML = cardDisplay;
    
    console.log('Carte Yu-Gi-Oh affichée avec succès !');
    console.log('Données utilisées :', {
        nom: card.name,
        id: card.id,
        type: card.type,
        race: card.race,
        atk: card.atk,
        def: card.def
    });
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="error">
            <strong>Erreur :</strong> ${message}
        </div>
    `;
    console.error('', message);
}

function setLoading(loading) {
    isLoading = loading;
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    
    if (loading) {
        searchBtn.disabled = true;
        searchBtn.textContent = 'Recherche...';
        resultDiv.innerHTML = '<div class="loading">Recherche en cours...</div>';
    } else {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Rechercher';
    }
}

function clearResult() {
    document.getElementById('result').innerHTML = '';
}