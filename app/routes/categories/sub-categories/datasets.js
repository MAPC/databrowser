import Route from '@ember/routing/route';


export default class extends Route {

  model(params) {
    const parent = this.modelFor('categories.sub-categories');
    return parent.filterBy('menu2', params.parentcategory_id);
  }

}
