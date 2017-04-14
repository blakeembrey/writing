import { pages } from 'config';
import { pageTitle } from './utils/pages';

exports.onRouteUpdate = function(state) {
  // Only log new pages when `ga` is defined.
  if (window.ga && state.action === 'PUSH') {
    const page = pages.filter(page => page.path === state.pathname)[0];

    window.ga('send', 'pageview', {
      location: location.pathname,
      title: page ? pageTitle(page) : state.pathname,
      page: state.pathname
    });
  }
};
