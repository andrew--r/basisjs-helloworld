const Node = require('basis.ui').Node;
const router = require('basis.router');

const entity = require('basis.entity');
const basisData = require('basis.data');
const Dataset = basisData.Dataset;
const DataObject = basisData.Object;

const persons = require('./persons.json');
const defaultActivePersonId = 1;
const activePersonId = router.route('users/:user').param('user');

const PersonEntity = entity.createType({
  name: 'Person',

  fields: {
    id: Number,
    age: Number,
    name: String,
    gender: ['male', 'female'],
    company: String,
    email: String,
    active: {
      type: function(value) { return value; },
      defValue: function (person) {
        return activePersonId.as(function (id) {
          if (id === null || id === undefined) {
            return defaultActivePersonId === person.id;
          }

          return Number(id) === person.id;
        });
      },
    },
  }
});

module.exports = require('basis.app')
  .create({
    title: 'Hello, World!',
    element: new Node({
      dataSource: new Dataset({
        items: persons.map(PersonEntity),
      }),
      template: resource('./app.tmpl'),
      childClass: {
        template: resource('./person.tmpl'),
        binding: {
          id: 'data:',
          active: 'data:',
          name: 'data:',
          age: 'data:',
          gender: 'data:',
          company: 'data:',
          email: 'data:',
        },
        action: {
          setActive: function () {
            router.navigate('users/' + this.data.id);
          }
        }
      },
    }),
  })
  .ready(function () {
    router.start();
    activePersonId.as(function (id) {
      if (!id) {
        router.navigate('user/' + defaultActivePersonId, true);
      }
    })
  });
