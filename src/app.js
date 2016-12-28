const Node = require('basis.ui').Node;
const router = require('basis.router');
const entity = require('basis.entity');
const basisData = require('basis.data');
const persons = require('./persons.json');

const Dataset = basisData.Dataset;
const Value = basisData.Value;

const DEFAULT_ACTIVE_PERSON_ID = 1;
const activePersonId = Value
  .from(router.route('users/:id').param('id'))
  .as(function (id) {
    console.log(id);
    return (typeof id === 'string') ? Number(id) : id;
  });

const PersonEntity = entity.createType({
  name: 'Person',
  fields: {
    id: Number,
    age: Number,
    name: String,
    gender: ['male', 'female'],
    company: String,
    email: String,
  },
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
          name: 'data:',
          age: 'data:',
          gender: 'data:',
          company: 'data:',
          email: 'data:',
          selected: activePersonId.compute(function(node, id) {
            return node.data.id === id;
          })
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
    if (!activePersonId.value) {
        router.navigate('users/' + DEFAULT_ACTIVE_PERSON_ID);
    }
  });
