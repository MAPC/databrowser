import EmberRouter from '@ember/routing/router';
import config from './config/environment';


const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
   didTransition: function() {
     this._super(...arguments);

     return ga('send', 'pageview', {
       'page': this.url,
       'title': this.url
     });
   }
});

Router.map(function() {
  this.route('categories', { path: '/' }, function() {
    this.route('sub-categories', { path: '/:id' }, function() {
      this.route('datasets', { path: '/:parentcategory_id' });
    });
  });
  this.route('datasets', { path: 'datasets/:dataset_id' });
});


export default Router;
