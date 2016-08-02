Item = require '../../src/models/item'
expect = chai.expect

describe 'Item Model', ->

  item = null

  beforeEach ->
    item = new Item
      name: 'Tiger'
      value: '1'
      data:
        'data-key': 'laohu lh'
        'data-test-property': 'test'
        animal: true
        human: false

  afterEach ->
    item = null

  it 'accepts name/value/data as options', ->
    expect(item.name).to.be.equal 'Tiger'
    expect(item.value).to.be.equal '1'
    expect(Object.keys(item.data).length).to.be.equal 4
    expect(item.data.key).to.be.equal 'laohu lh'
    expect(item.data.animal).to.be.true
    expect(item.data.human).to.be.false
    expect(item.data.testProperty).to.be.equal 'test'

  it 'can match value', ->
    expect(item.match 'tiger').to.be.false
    expect(item.match 'laohu').to.be.true
    expect(item.match 'lh').to.be.true
