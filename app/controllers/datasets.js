import { A } from '@ember/array';
import EmberError from '@ember/error';
import Controller from '@ember/controller';
import config from '../config/environment';
import { service } from '@ember-decorators/service';
import { computed, action } from '@ember-decorators/object';


export default class extends Controller {

  @service ajax

  constructor() {
    super(...arguments);

    this.queryParams = ['min', 'max'];
    this.years = [];

    this.min = 0;
    this.max = this.perPage = 50;
  }


  @computed('selected_rows.length')
  get pageCount() {
    return Math.ceil(this.get('selected_rows.length') / this.get('perPage'));
  }


  @computed('min', 'max', 'selected_rows.length')
  get page() {
    return Math.ceil(this.get('max') / this.get('perPage'));
  }


  @computed('model.metadata')
  get formattedMetadata() {
    const metadata = this.get('model.metadata');

    if (metadata && 'definition' in metadata) {
      const columnMetadata = metadata['definition']['DEFeatureClassInfo']['GPFieldInfoExs']['GPFieldInfoEx'];
      const title = {name: "title", alias: "Title", details: metadata['documentation']['metadata']['dataIdInfo']['idCitation']['resTitle']}
      const tbl_table = {name: "tbl_table", alias: "Table Name", details: metadata['documentation']['metadata']['Esri']['DataProperties']['itemProps']['itemName']}
      const description = {name: "descriptn", alias: "Description", details: this.strip(metadata['documentation']['metadata']['dataIdInfo']['idPurp'])}

      const transformedColumnMetadata = columnMetadata.filter(column => column.AliasName)
                                                .map(column => ({ name: column.Name, alias: column.AliasName }));
      const combinedMetadata = [title, tbl_table, description, ...transformedColumnMetadata];

      return A(combinedMetadata);
    }
    else {
      return metadata;
    }
  }


  @computed('formattedMetadata.[]', 'model.raw_data.fields')
  get fields() {
    const metadata = (this.get('formattedMetadata') || []).map(x => x.name);
    const fieldNames = Object.keys(this.get('model.raw_data.fields') || {});
    const fields = [];
    const withoutMeta = [];

    fieldNames.forEach(field => {
      var fieldMetaIndex = metadata.indexOf(field);

      if (fieldMetaIndex !== -1) {
        fields[fieldMetaIndex] = field;
      }
      else {
        withoutMeta.push(field);
      }
    });

    return [...fields.filter(x => x), ...withoutMeta];
  }


  @computed('model.years_available.@each.selected')
  get selected_rows() {
    if (this.get('model.years_available') instanceof EmberError) {
      return this.get('model.raw_data.rows');
    }
    if((this.get('model.years_available') || []).length === 0) {
      return this.get('model.raw_data.rows');
    }

    let years_available = this.get('model.years_available')
                              .filterBy('selected', true)
                              .map(selected => selected.year);

    return this.get('model.raw_data.rows').filter((row) => {
      return years_available.includes(row[this.get('model.dataset.yearcolumn')]);
    });
  }

  @computed('model.{metadata.rows,raw_data.spatialMetaData}')
  get downloadButtonsLength() {
    let length = 1;

    if (this.get('model.metadata.rows')) {
      length++;
    }

    if (this.get('model.raw_data.spatialMetaData')) {
      length = length + 3;
    }

    return length;
  }


  @computed('model', 'model.years_available.@each.selected')
  get download_link() {
    return window.location.origin + '/csv?table=' + this.get('model.dataset.schemaname') + '.' + this.get('model.dataset.table_name') + '&database=' + this.get('model.dataset.db_name');
  }


  @computed('model')
  get download_link_metadata() {
    return this.metadata_query('csv');
  }


  @computed('model')
  get download_link_shapefile() {
    return window.location.origin + '/shapefile?table=' + this.get('model.metadata.definition.DEFeatureClassInfo.Name') + '&database=' + this.get('model.dataset.db_name');
  }


  @computed('model', 'model.years_available.@each.selected')
  get download_link_geojson() {
    return this.spatial_query('geojson')
  }


  @computed('model', 'model.years_available.@each.selected')
  get download_link_visualize() {
    let download_link_geojson = encodeURIComponent(this.get('download_link_geojson'));
    return `http://oneclick.cartodb.com/?file=${download_link_geojson}&provider=MAPC&logo=http://data.mapc.org/img/mapc-color.png`;
  }

  strip(html) {
     var doc = new DOMParser().parseFromString(html, 'text/html');
     return doc.body.textContent || "";
  }

  metadata_query(format = 'json') {
    return `${config.dataBrowserEndpoint} select * from meta_${this.get('model.dataset.table_name')}&format=${format}&filename=meta_${this.get('model.dataset.table_name')}`;
  }


  spatial_query(format) {
    let spatial_meta = this.get('model.raw_data.spatialMetaData');
    let tabular = this.get('model.dataset.table_name');
    let fields = Object.keys(this.get('model.raw_data.fields')).map((el) => { return `a.${el}` });
    let where = '';
    if (this.get('model.dataset.hasYears')) {
      let yearsSelected = this.get('model.years_available').filterBy('selected', true);
      let latest = yearsSelected[yearsSelected.length-1];
      if(latest) {
        where = ` WHERE a.${this.get('model.dataset.yearcolumn')} IN ('${latest.year}')`;
      }
    }

    let select = `SELECT ${fields}, b.the_geom, b.the_geom_webmercator `;
    let from = `FROM ${tabular} a `;
    let inner_join = `INNER JOIN ${spatial_meta.table} b ON a.${spatial_meta.field} = b.${spatial_meta.field}`;
    let sql = encodeURIComponent(`${select} ${from} ${inner_join}${where}`);

    return `${config.dataBrowserEndpoint}${sql}&format=${format}&filename=${tabular}`;
  }

  @action
  downloadMetadata(metadata) {
    const keys = Object.keys(metadata[0])

    const values = metadata.map(row => {
      return keys.map(key => { return row[key]; })
    })

    const rows = values.map(row => {
      return row.reduce((a,b) => a + ',' + b);
    })

    const csvHeader = "data:text/csv;charset=utf-8,";

    const documentHeader = keys;
    const documentRows = rows.reduce((a,b) => `${a}\n${b}`)

    const documentStructure = [[documentHeader], documentRows].reduce((a,b) => a.concat(b));
    const documentBody = documentStructure.reduce((a,b) => `${a}\n${b}`)

    const csvFile = csvHeader + documentBody;
    const encoded = encodeURI(csvFile);
    const fileName =`${metadata.find(data => data.alias === 'Title').details}-metadata.csv`;

    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
  }

  @action
  toggle(year) {
    year.toggleProperty('selected');
    const {
      max,
      perPage
    } = this.getProperties('max', 'perPage');

    if(max > this.get('selected_rows.length')) {
      this.set('max', this.get('selected_rows.length'));
      this.set('min', this.get('selected_rows.length') - perPage)
    }
  }


  @action
  next() {
    const {
      min,
      max,
      perPage,
      page,
      pageCount
    } = this.getProperties('min', 'max', 'perPage', 'page', 'pageCount');

    if (page !== pageCount) {
      this.set('min', min + perPage);
      this.set('max', max + perPage);
    }
  }


  @action
  previous() {
    const { min, perPage, page } = this.getProperties('min', 'perPage', 'page');

    if (page !== 1) {
      this.set('min', min - perPage);
      this.set('max', min);
    }
  }


  @action
  first() {
    this.set('min', 0);
    this.set('max', this.get('perPage'));
  }


  @action
  last() {
    const perPage = this.get('perPage');
    const { length } = this.get('selected_rows');

    this.set('min', length - (length % perPage));
    this.set('max', length);
  }

}
