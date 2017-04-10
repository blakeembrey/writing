import { pages } from 'config';

exports.onRouteUpdate = function(state) {
  if (window.ga) {
    const page = pages.filter(page => page.path === state.pathname);

    window.ga('send', 'pageview', {
      location: location.pathname,
      title: (page && page.data && page.data.title) || state.pathname,
      page: state.pathname
    });
  }
};
