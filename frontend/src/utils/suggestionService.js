import { getDestinations } from '../api/api.js';
import { INDIA_STATES_AND_UTS } from '../data/indiaData.js';

/**
 * Dynamically fetches and matches destination search suggestions based on 
 * actual destination and place data available in the project (API + indiaData.js).
 * 
 * @param {string} query - The search string typed by the user
 * @returns {Promise<Array<{id: string, title: string, subtitle: string, category: string, searchValue: string, score: number}>>}
 */
export async function getDestinationSuggestions(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const q = query.trim().toLowerCase();
  const suggestionMap = new Map();

  const addSuggestion = (item) => {
    if (!item || !item.title || !item.searchValue) return;
    const key = item.searchValue.toLowerCase().trim();
    
    if (!suggestionMap.has(key)) {
      suggestionMap.set(key, item);
    } else {
      const existing = suggestionMap.get(key);
      if (item.score > existing.score) {
        suggestionMap.set(key, { ...existing, ...item });
      }
    }
  };

  // 1. INSTANT SYNCHRONOUS SEARCH in Static Dataset (INDIA_STATES_AND_UTS)
  if (INDIA_STATES_AND_UTS) {
    Object.keys(INDIA_STATES_AND_UTS).forEach((stateName) => {
      const stateObj = INDIA_STATES_AND_UTS[stateName];
      const stateLower = stateName.toLowerCase();
      const capitalLower = (stateObj.capital || '').toLowerCase();

      // Match State Name
      if (stateLower.includes(q)) {
        let score = 50;
        if (stateLower === q) score = 100;
        else if (stateLower.startsWith(q)) score = 90;
        else score = 70;

        addSuggestion({
          id: `state-${stateName}`,
          title: stateName,
          subtitle: `${stateObj.type || 'State'} • Capital: ${stateObj.capital}`,
          category: stateObj.type || 'State',
          searchValue: stateName,
          score
        });
      }

      // Match Capital Name
      if (capitalLower && capitalLower.includes(q) && capitalLower !== stateLower) {
        let score = 50;
        if (capitalLower === q) score = 98;
        else if (capitalLower.startsWith(q)) score = 88;
        else score = 68;

        addSuggestion({
          id: `capital-${stateObj.capital}`,
          title: stateObj.capital,
          subtitle: `${stateName} • Capital City`,
          category: 'City',
          searchValue: stateObj.capital,
          score
        });
      }

      // Match Places in this State/UT
      if (Array.isArray(stateObj.places)) {
        stateObj.places.forEach((place) => {
          const placeNameLower = (place.name || '').toLowerCase();
          const cityLower = (place.city || '').toLowerCase();
          const catLower = (place.cat || '').toLowerCase();
          const descLower = (place.desc || '').toLowerCase();

          const matchesName = placeNameLower.includes(q);
          const matchesCity = cityLower.includes(q);
          const matchesCat = catLower.includes(q);
          const matchesDesc = descLower.includes(q);

          if (matchesName || matchesCity || matchesCat || matchesDesc) {
            let score = 40;
            if (placeNameLower === q || cityLower === q) score = 100;
            else if (placeNameLower.startsWith(q) || cityLower.startsWith(q)) score = 88;
            else if (matchesName || matchesCity) score = 78;
            else if (matchesCat) score = 58;

            addSuggestion({
              id: `place-${stateName}-${place.name}`,
              title: place.name,
              subtitle: `${place.city}, ${stateName} • ${place.cat || 'Tourist Place'}`,
              category: place.cat || 'Place',
              searchValue: place.name,
              score
            });

            if (matchesCity && cityLower !== stateLower && !suggestionMap.has(cityLower)) {
              addSuggestion({
                id: `city-${place.city}`,
                title: place.city,
                subtitle: `${stateName} • Tourist Destination`,
                category: 'City',
                searchValue: place.city,
                score: cityLower.startsWith(q) ? 89 : 72
              });
            }
          }
        });
      }
    });
  }

  // 2. Non-blocking API Fetch (max 800ms timeout)
  try {
    const apiPromise = getDestinations({ search: query });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API Timeout')), 800)
    );
    
    const apiRes = await Promise.race([apiPromise, timeoutPromise]);
    const destList = Array.isArray(apiRes) 
      ? apiRes 
      : (apiRes && Array.isArray(apiRes.destinations)) 
        ? apiRes.destinations 
        : [];

    destList.forEach((dest) => {
      const nameLower = (dest.name || '').toLowerCase();
      const cityLower = (dest.city || '').toLowerCase();

      let score = 50;
      if (nameLower === q || cityLower === q) score = 100;
      else if (nameLower.startsWith(q) || cityLower.startsWith(q)) score = 92;
      else if (nameLower.includes(q) || cityLower.includes(q)) score = 76;

      addSuggestion({
        id: `api-dest-${dest.id || dest.name}`,
        title: dest.name,
        subtitle: `${dest.city || dest.name}${dest.state ? `, ${dest.state}` : ''} • ${dest.category || 'Destination'}`,
        category: dest.category || 'Destination',
        searchValue: dest.name,
        score
      });

      if (dest.city && dest.city.toLowerCase() !== dest.name.toLowerCase() && dest.city.toLowerCase().includes(q)) {
        addSuggestion({
          id: `api-city-${dest.city}`,
          title: dest.city,
          subtitle: `${dest.state || 'India'} • Destination City`,
          category: 'City',
          searchValue: dest.city,
          score: dest.city.toLowerCase().startsWith(q) ? 90 : 74
        });
      }
    });
  } catch (err) {
    // Ignore API delay or offline error (static results take precedence)
  }

  // 3. Sort by score descending & limit to 7 results
  return Array.from(suggestionMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);
}
