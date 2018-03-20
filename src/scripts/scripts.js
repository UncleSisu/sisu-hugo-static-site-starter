import $ from 'jquery';
import debounce from 'lodash/debounce';
import postal from 'postal';
import lunr from 'lunr';

// const $searchForm = $('.search-form');

// $searchForm.on('submit', (e) => {
//   e.preventDefault();
//   console.log('submit');
// });

let lunrIndex;
const $search = $('#search');
const $results = $('#results');
let pagesIndex;

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');

  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
    }
  }

  return null;
}

const searchTerm = getQueryVariable('query');

// Initialize lunrjs using our generated index file
function initLunr() {
  // First retrieve the index file
  $.getJSON('/index.json')
    .done((index) => {
      pagesIndex = index;
      console.log('index:', pagesIndex);

      // Set up lunrjs by declaring the fields we use
      // Also provide their boost level for the ranking
      lunrIndex = lunr(function() {
        this.field('title', { boost: 10 });
        this.field('tags', { boost: 5 });
        this.field('categories', { boost: 5 });
        this.field('type', { boost: 5 });
        this.field('content');
        // ref is the result item identifier (I chose the page URL)
        this.ref('uri');

        // Feed lunr with each file and let lunr actually index them
        pagesIndex.forEach((page) => {
          this.add(page);
        }, this);
      });

      // Feed lunr with each file and let lunr actually index them
      // pagesIndex.forEach((page) => {
      //   lunrIndex.add(page);
      // });
    })
    .fail((jqxhr, textStatus, error) => {
      const err = textStatus + ', ' + error;
      console.error('Error getting Hugo index flie:', err);
    });
}

// Nothing crazy here, just hook up a listener on the input field
function initUI() {
  $search.keyup(() => {
    $results.empty();

    // Only trigger a search when 2 chars. at least have been provided
    const query = $search.val();
    if (query.length < 2) {
      return;
    }

    const results = search(query);

    renderResults(results);
  });
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
  // Find the item in our index corresponding to the lunr one to have more info
  // Lunr result:
  //  {ref: "/section/page1", score: 0.2725657778206127}
  // Our result:
  //  {title:"Page1", href:"/section/page1", ...}
  return lunrIndex.search(query).map((result) => {
    return pagesIndex.filter((page) => {
      return page.uri === result.ref;
    })[0];
  });
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
  if (!results.length) {
    return;
  }

  // Only show the ten first results
  results.slice(0, 100).forEach((result) => {
    const $result = $('<li>');
    $result.append(
      $('<a>', {
        href: result.uri,
        text: '» ' + result.title
      })
    );
    $results.append($result);
  });
}

// Let's get started
if ($results.length > 0) {
  initLunr();
  initUI();
}
