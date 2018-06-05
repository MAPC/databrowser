import config from '../config/environment';

export default function imputeSpatiality(cartoTable) {
  let spatialField = Object.keys(cartoTable.fields).find(function(item) {
    return config.spatialJoinFields.isAny('field', item);
  });

  if(spatialField) {
    let spatialMetaData = config.spatialJoinFields.findBy('field', spatialField);
    cartoTable.spatialMetaData = spatialMetaData;
  } else {
    cartoTable.spatialMetaData = false;
  }

  return cartoTable;
}
