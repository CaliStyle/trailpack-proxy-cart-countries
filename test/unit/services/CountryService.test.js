'use strict'
/* global describe, it */
const assert = require('assert')

describe('CountryService', () => {
  let CountryService
  before((done) => {
    CountryService = global.app.services.CountryService
    done()
  })

  it('should exist', () => {
    assert(global.app.api.services['CountryService'])
  })
  it('should get all available info using approximate string matching', (done) => {
    const searches = {
      'CA': 'Canada',
      'U.S.A.': 'United States',
      'THE GREAT BRITAIN': 'United Kingdom'
    }
    Object.keys(searches).forEach(function (search) {
      const tester = CountryService.name(search, 'name')
      // console.log('term:', searches[search])
      // console.log('result:', tester)
      assert(typeof tester == 'string')
      assert.equal(tester, searches[search])
    })
    done()
  })
  it('should get list of states for United States', (done) => {
    const tester = CountryService.states('US')
    assert(typeof tester == 'object') // Array
    assert.equal(tester.length, 57)
    assert(typeof tester[0] == 'object')
    done()
  })
  it('should get list of states for United States', (done) => {
    const tester = CountryService.provinces('US')
    assert(typeof tester == 'object') // Array
    assert.equal(tester.length, 57)
    assert(typeof tester[0] == 'object')
    done()
  })
  it('should get name for United States', function (done) {
    const tester = CountryService.name('US')
    assert(typeof tester == 'string')
    assert.equal(tester, 'United States')
    done()
  })
  it('should get alternate spellings for United States', function (done) {
    const tester = CountryService.altSpellings('US')
    assert(typeof tester == 'object') // Array
    assert.equal(tester.length, 3)
    assert(typeof tester[0] == 'string')
    done()
  })
  it('should get state object for Indiana United States', function (done) {
    const tester = CountryService.name('US', 'IN')
    assert(typeof tester == 'string')
    assert.equal(tester, 'Indiana')
    done()
  })
  it('should get state object for Indiana United States', function (done) {
    const tester = CountryService.state('USA', 'Indiana')
    assert(typeof tester == 'object')
    assert.equal(tester.abbreviation, 'IN')
    assert.equal(tester.name, 'Indiana')
    done()
  })
  it('should get state object for IN US', function (done) {
    const tester = CountryService.state('US', 'IN')
    assert(typeof tester == 'object')
    assert.equal(tester.abbreviation, 'IN')
    assert.equal(tester.name, 'Indiana')
    done()
  })
  it('should undefined for a mismatched country identifier', function (done) {
    const tester = CountryService.states('UX')
    assert(typeof tester == 'undefined')
    done()
  })
  it('should undefined for a mismatched country identifier (other methods)', function (done) {
    const methods = [
      'states',
      'provinces',
      'name',
      'altSpellings'
    ]
    methods.forEach(function (method) {
      const tester = CountryService[method]('UX')
      assert(typeof tester == 'undefined')
    })
    done()
  })
})