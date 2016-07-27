Group = require '../../src/models/group'
Item = require '../../src/models/item'
expect = chai.expect

describe 'Group Model', ->

  group = null

  beforeEach ->
    group = new Group
      name: 'Test Group'
      items: [
        ['Dog 1', '1', {key: 'dog1'}]
        ['Dog 2', '2', {key: 'dog2'}]
        ['Cat 1', '3', {key: 'cat1'}]
        ['Cat 2', '4', {key: 'cat2'}]
      ]

  afterEach ->
    group = null

  it 'accepts name and items as options', ->
    expect(group.name).to.be.equal 'Test Group'
    expect(group.items.length).to.be.equal 4
    expect(group.items[0] instanceof Item).to.be.true

  it 'can fitlers items by search key', ->
    newGroup = group.filterItems 'dog'
    expect(newGroup).to.be.not.equal group
    expect(newGroup.name).to.be.equal group.name
    expect(newGroup.items.length).to.be.equal 2
    expect(newGroup.items[0].name).to.be.equal 'Dog 1'
    expect(newGroup.items[1].name).to.be.equal 'Dog 2'

  it 'can excludes items by values', ->
    items = [
      new Item name: 'xxx', value: '1'
      new Item name: 'xxx', value: '3'
    ]
    newGroup = group.excludeItems items
    expect(newGroup).to.be.not.equal group
    expect(newGroup.name).to.be.equal group.name
    expect(newGroup.items.length).to.be.equal 2
    expect(newGroup.items[0].name).to.be.equal 'Dog 2'
    expect(newGroup.items[1].name).to.be.equal 'Cat 2'

  it 'can get item by value', ->
    item = group.getItem '4'
    expect(item instanceof Item).to.be.true
    expect(item.name).to.be.equal 'Cat 2'
    expect(item.value).to.be.equal '4'

  it 'can get item by Name', ->
    item = group.getItemByName 'Cat 1'
    expect(item instanceof Item).to.be.true
    expect(item.name).to.be.equal 'Cat 1'
    expect(item.value).to.be.equal '3'
