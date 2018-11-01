import Component from '@ember/component';
import { tagName, classNames } from '@meber-decorators/component';


@tagName('table')
@classNames('ui','sortable', 'unstackable', 'selectable','compact','table')
export default class extends Component {}
