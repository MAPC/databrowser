import Component from '@ember/component';
import { nest } from 'd3-collection';
import { computed, action } from '@ember-decorators/object';


export default class extends Component {

  constructor(params) {
    super(...arguments);

    this.classNames = ['component', 'menus-component'];
    this.subRoute = params.attrs.subRoute || 'categories.sub-categories';
    this.groupColumn = params.attrs.groupColumn || 'menu1';
  }


  @computed('model')
  get primary() {
    const model = this.get('model');
    const groupColumn = this.get('groupColumn');

    return nest().key(d => d.get(groupColumn))
                 .entries(model.toArray());
  }


  @action
  routeTo(category) {
    const subRoute = this.get('subRoute')

    this.get('router').transitionTo(subRoute, category);
  }

}
