import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.getElementById('search-box');
const list = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  const searchValue = evt.target.value.trim();
  if (searchValue === '') {
    list.innerHTML = '';
    return;
  }
  fetchCountries(searchValue)
    .then(data => {
      if (data.length >= 10) {
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length < 2) {
        createMarkupExtended(data);
      } else {
        const filteredData = data.filter(country => {
          return country.name.official
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        });
        createMarkup(filteredData);
      }
    })
    .catch(err =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function debounce(callback, delay) {
  let timeoutId;
  return function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback.apply(this, arguments);
    }, delay);
  };
}

function createMarkupExtended(data) {
  const [{ name, flags, capital, population, languages }] = data;

  const languagesMarkup = Object.entries(languages)
    .map(([key, value]) => {
      return `<li>${key}: ${value}</li>`;
    })
    .join('');

  const markup = `
      <div style="display: flex; align-items: center; margin-bottom: 10px">
      <img  style="margin-right: 10px" src="${flags.svg}" alt="${flags.alt}" width=50" /> 
      <h2 style="font-family: 'Roboto', sans-serif; font-size: 22px; font-weight: bold;">${name.official}</h2>
      </div> 
      <p style="font-family: 'Roboto', sans-serif; font-size: 18px; font-weight: bold;">Capital: ${capital[0]}</p>
      <p style="font-family: 'Roboto', sans-serif; font-size: 16px">Population: ${population}</p>
      <h3 style="font-family: 'Roboto', sans-serif; font-size: 16px">Languages:</h3>
      <ul>${languagesMarkup}</ul>
  `;

  document.querySelector('.country-info').innerHTML = markup;
}

function createMarkup(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `
      <div style="display: flex; align-items: center; margin-bottom: 10px">
        <img src="${flags.png}" alt="${flags.alt}" style="margin-right: 10px;" height="30" width="50" />  
        <h2 style="margin: 0; font-family: 'Roboto', sans-serif; font-size: 22px; font-weight: bold;">${name.official}</h2>
      </div> 

      `;
    })
    .join('');
  document.querySelector('.country-info').innerHTML = markup;
}
