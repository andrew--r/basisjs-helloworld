const Node = require('basis.ui').Node;
const router = require('basis.router');

const entity = require('basis.entity');
const basisData = require('basis.data');
const Dataset = basisData.Dataset;
const DataObject = basisData.Object;

const persons = require('./persons.json');
const activePersonId = new basis.Token(persons[0].id);

const PersonEntity = entity.createType('Person', {
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
        return id === person.id;
      });
    }
  },
});

router.start();

router.add('users/:id', {
  match: function (id) {
    activePersonId.set(Number(id));
  },
});

module.exports = require('basis.app').create({
  title: 'Hello, World!',

  init: function() {
    return new Node({
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
    });
  }
});
