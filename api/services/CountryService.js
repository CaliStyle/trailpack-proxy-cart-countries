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
        .replace(/\-/g, ' ')
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
    else if (type === 'ISO3' || type === 'IS03') {
      return _.find(countryList, function (thiscountry) {
        return thiscountry.ISO.alpha3 === country
      })
    }
    else if (type === 'ISO2' || type === 'IS02') {
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
        addToStateIndex(state.code)
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

  /**
   *
   */
  all() {
    return countryList
  }

  /**
   *
   * @param country
   * @param type
   */
  name(country, type) {
    const ret = this._returnCountry(country, type)
    if (ret) {
      return ret.name
    }
  }

  /**
   *
   * @param country
   * @param type
   * @returns {CountryService.states}
   */
  states(country, type) {
    const ret = this._returnCountry(country, type)
    if (ret) {
      return ret.states
    }
  }

  /**
   *
   * @param country
   * @param type
   * @returns {CountryService.states}
   */
  provinces(country, type) {
    return this.states(country, type)
  }

  /**
   *
   * @param country
   * @param type
   * @returns {CountryService.altSpellings}
   */
  altSpellings(country, type) {
    const ret = this._returnCountry(country, type)
    if (ret) {
      return ret.altSpellings
    }
  }

  /**
   *
   * @param country
   * @param type
   * @returns {*}
   */
  state(country, type) {
    return this._returnCountry(country, type)
  }

  /**
   *
   * @param country
   * @param type
   * @returns {*}
   */
  province(country, type) {
    return this._returnCountry(country, type)
  }
}
