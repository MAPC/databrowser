import Component from '@ember/component';
import { computed } from '@ember-decorators/object';


export default class extends Component {

  constructor() {
    super(...arguments);

    this.classNames = ['component', 'search-bar'];

    this.query = '';
    this.sortBy = 'title';
    this.searchBy = ['title'];
  }


  @computed('records')
  get placeholder() {
    const recordCount = this.get('records.length');

    return recordCount > 0 ? `Search ${recordCount} datasets ...` : 'No datasets loaded.';
  }


  @computed('query', 'records')
  get results() {
    const { records, query } = this.getProperties('records', 'query');
    let results = [];

    if (query.length > 1) {
      const queryWords = query.toLowerCase().split(' ');

      results = records.filter(record => {
        const found = this.get('searchBy').map(attr => {
          const keywords = record[attr].toLowerCase().split(' ');

          const matchesKeywords = queryWords.every(queryWord => (
            keywords.any(keyword => keyword.startsWith(queryWord))
          ));

          return matchesKeywords;
        });

        return found.any(matches => matches);
      }).sortBy(this.get('sortBy'));
    }

    return results;
  }

}
