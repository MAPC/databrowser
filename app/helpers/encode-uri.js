import { helper as buildHelper } from '@ember/component/helper';

export function encodeUri(params) {
  return encodeURIComponent(params);
}

export default buildHelper(encodeUri);
