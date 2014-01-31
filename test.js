var HumanModel = require('human-model'),
    uuid = require('node-uuid'),
    expect = require('expect.js');

var M = HumanModel.define({
  props: {
    id: {
      type: 'string',
      required: true,
      default: uuid.v4 // uuid.v4() generates a UUID
    },
    tags: ['array', true],
    simple_object: ['object', true, {first: '', second: ''}]
  }
});

var m_1 = new M(),
    m_2 = new M();

// If the default value could be a function, then the ID can be populated with a UUID from uuid.v4()
expect(m_1.id).to.have.length(36);

// It would be nice if the default values are cloned for each instance of the model
expect(m_1.tags).not.to.be(m_2.tags);

// So that when we use one array
m_1.tags.push('one');
// It doesn't affect the other
expect(m_2.tags).to.not.eql(['one']);

// Same for objects
m_2.simple_object.first = 'Frank';
expect(m_1.simple_object.first).not.to.be('Frank');
