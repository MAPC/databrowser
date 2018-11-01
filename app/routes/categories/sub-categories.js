import Route from '@ember/routing/route';


export default class extends Route {

  model(params) {
    const parent = this.modelFor('categories');
    return parent.filterBy('menu1', params.id);
  }

}
