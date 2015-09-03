import qs from 'query-string';

export default function createPermalink(params) {
  window.location.hash = qs.stringify(params);
}
