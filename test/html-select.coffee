DataProvider = require '../src/models/data-provider'
HtmlSelect = require '../src/html-select'
expect = chai.expect

describe 'Html Select', ->

  dataProvider = null
  htmlSelect = null

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

    htmlSelect = new HtmlSelect
      el: $ '<select>'
      groups: dataProvider.getGroups()

  afterEach ->
    dataProvider = null
    htmlSelect = null

  it 'accepts element and groups as options', ->
    expect(htmlSelect.el.is('select')).to.be.true
    expect(htmlSelect.groups.length).to.be.equal 2

  it 'should render after setGroups', ->
    expect(htmlSelect.el.find('optgroup').length).to.be.equal 2
    expect(htmlSelect.el.find('option').length).to.be.equal 4

    htmlSelect.setGroups []
    expect(htmlSelect.el.html()).to.be.equal '<option></option>'

  it 'can get blank option element', ->
    $option = htmlSelect.getBlankOption()
    expect($option).to.be.false

    htmlSelect.setGroups []
    $option = htmlSelect.getBlankOption()
    expect($option).to.be.not.false
    expect($option.is('option')).to.be.true

  it 'can get/set value', ->
    htmlSelect.setValue '1'
    expect(htmlSelect.getValue()).to.be.equal '1'

    htmlSelect.setValue ['2']
    expect(htmlSelect.getValue()).to.be.equal '2'

    htmlSelect.el.attr 'multiple', ''
    htmlSelect.setValue '3'
    expect(JSON.stringify htmlSelect.getValue()).to.be.equal '["3"]'
    htmlSelect.setValue ['3', '4']
    expect(JSON.stringify htmlSelect.getValue()).to.be.equal '["3","4"]'
