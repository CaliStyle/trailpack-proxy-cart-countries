'use strict'

const Service = require('trails/service')
const _ = require('lodash')
const countryList = require('../../lib/countries')()

/**
 * @module CountryService
 * @description Country Service
 */
module.exports = class CountryService extends Service {

  /**
   *
   * @param country
   * @param type
   * @returns {*}
   * @private
   */
  _returnCountry(country, type) {
    const normalizeName = (name) =>{
      return _.deburr(name)
        .toLowerCase()
        // .replace(/\-/g, ' ')
        .replace(/(\.|\b(the|and|of|de|des|du|di|del|y|da|und|die) \b)/g, '')
        .trim()
    }
    const findIndex = _.transform(countryList, function (index, country, key) {
      const addToIndex = (name) => {
        if (name) {
          index[normalizeName(name)] = key
        }
      }
      addToIndex(country.name)
      _.forEach(country.altSpellings, addToIndex)
    })

    let key
    if (type === 'name') {
      key = findIndex[normalizeName(country)]
      return countryList[key]
    }
    else if (type === 'ISO3') {
      return _.find(countryList, function (thiscountry) {
        return thiscountry.ISO.alpha3 === country
      })
    }
    else if (type === 'IS02') {
      return _.find(countryList, function (thiscountry) {
        return thiscountry.ISO.alpha2 === country
      })
    }
    else if (typeof type === 'undefined') {
      return _.find(countryList, function (thiscountry) {
        return thiscountry.ISO.alpha2 === country
      })
    }
    else if (typeof type === 'string') {
      key = findIndex[normalizeName(country)]
      let stateKey
      const statesList = countryList[key].states
      const findStateIndex = _.transform(statesList, function (index, state, key) {
        const addToStateIndex = function (name) {
          if (name) {
            index[normalizeName(name)] = key
          }
        }
        addToStateIndex(state.name)
        addToStateIndex(state.abbreviation)
        _.forEach(state.altSpellings, addToStateIndex)
      })
      stateKey = findStateIndex[normalizeName(type)]
      return statesList[stateKey]
    }
    else {
      return _.find(countryList, function (thiscountry) {
        return thiscountry.ISO.alpha2 === country
      })
    }
  }

  all() {
    return countryList
  }
  name(country, type) {
    const ret = this._returnCountry(country, type)
    if (ret) {
      return ret.name
    }
  }
  states(country, type) {
    const ret = this._returnCountry(country, type)
    if (ret) {
      return ret.states
    }
  }
  provinces(country, type) {
    return this.states(country, type)
  }
  altSpellings(country, type) {
    const ret = this._returnCountry(country, type)
    if (ret) {
      return ret.altSpellings
    }
  }
  state(country, type) {
    return this._returnCountry(country, type)
  }
  province(country, type) {
    return this._returnCountry(country, type)
  }
}
