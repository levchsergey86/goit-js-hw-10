const BASE_URL = 'https://restcountries.com/v3.1/name/';
const properties = ['name', 'capital', 'population', 'languages', 'flags'];

export function fetchCountries(countryName) {
  const URL = `${BASE_URL}${countryName}?fields=${properties.join(',')}`;
  return fetch(URL).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}
