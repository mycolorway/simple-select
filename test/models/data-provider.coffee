DataProvider = require '../../src/models/data-provider'
Group = require '../../src/models/group'
Item = require '../../src/models/item'
expect = chai.expect

describe 'Data Provider', ->

  dataProvider = null

  beforeEach ->
    dataProvider = new DataProvider
      groups: {
        'Cat Animals': [
          ['Cat', '1']
          ['Tiger', '2']
        ],
        'Dog Animals': [
          ['Dog', '3']
          ['Wolf', '4']
        ]
      }

  afterEach ->
    dataProvider = null

  it 'can set groups from json data', ->
    groups1 = dataProvider.getGroups()
    expect(groups1.length).to.be.equal 2
    expect(groups1[0].name).to.be.equal 'Cat Animals'
    expect(groups1[0].items.length).to.be.equal 2

    dataProvider.setGroupsFromJson [
      ['Cat 1', '3', {key: 'cat1'}]
      ['Cat 2', '4', {key: 'cat2'}]
    ]
    groups2 = dataProvider.getGroups()
    expect(groups2.length).to.be.equal 1
    expect(groups2[0].name).to.be.equal Group.defaultName
    expect(groups2[0].items.length).to.be.equal 2

  it 'can set groups from select element', ->
    $selectEl = $ '''
      <select>
        <optgroup label="Dog Animals">
          <option value="1">Dog</option>
          <option value="2">Wolf</option>
        </optgroup>
        <optgroup label="Cat Animals">
          <option value="3">Cat</option>
          <option value="4">Tiger</option>
        </optgroup>
      </select>
    '''
    dataProvider = new DataProvider
      selectEl: $selectEl

    groups = dataProvider.getGroups()
    expect(groups.length).to.be.equal 2
    expect(groups[0].name).to.be.equal 'Dog Animals'
    expect(groups[0].items.length).to.be.equal 2

  it 'can get item by value', ->
    item = dataProvider.getItem '3'
    expect(item instanceof Item).to.be.true
    expect(item.name).to.be.equal 'Dog'
    expect(item.value).to.be.equal '3'

  it 'can get item by name', ->
    item = dataProvider.getItemByName 'Wolf'
    expect(item instanceof Item).to.be.true
    expect(item.name).to.be.equal 'Wolf'
    expect(item.value).to.be.equal '4'

  it 'can filter items without remote option', (done) ->
    validate = (groups, value) ->
      expect(value).to.be.equal 'ti'
      expect(groups.length).to.be.equal 1
      expect(groups[0].items.length).to.be.equal 1
      expect(groups[0].items[0].name).to.be.equal 'Tiger'
      expect(groups[0].items[0].value).to.be.equal '2'

    dataProvider.on 'filter', (e, groups, value) ->
      validate groups, value
      done()
    dataProvider.filter 'ti', (groups, value) ->
      validate groups, value

  it 'can filter items with remote option', (done) ->
    server = sinon.fakeServer.create
      respondImmediately: true
    server.respondWith [
      200
      {"Content-Type": "application/json"}
      JSON.stringify({'Cat Animals': [['Tiger', '2']]})
    ]

    validate = (groups, value) ->
      expect(value).to.be.equal 'ti'
      expect(groups.length).to.be.equal 1
      expect(groups[0].items.length).to.be.equal 1
      expect(groups[0].items[0].name).to.be.equal 'Tiger'
      expect(groups[0].items[0].value).to.be.equal '2'

    dataProvider = new DataProvider
      remote:
        url: 'api/url'
        searchKey: 'animal_name'

    dataProvider.on 'fetch', (e, groups) ->
      expect(groups.length).to.be.equal 1
    dataProvider.on 'filter', (e, groups, value) ->
      validate groups, value
      server.restore()
      done()
    dataProvider.filter 'ti', (groups, value) ->
      validate groups, value
