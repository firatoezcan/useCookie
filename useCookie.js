import Cookies from 'js-cookie'
import { useState } from 'react'

const isUndefinedOrNull = variable => variable == null || typeof variable === 'undefined'

const booleanStringToBoolean = booleanString => {
  if (isUndefinedOrNull(booleanString)) return booleanString
  switch (booleanString.toLowerCase()) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return booleanString
  }
}

const GetCookieValue = key => booleanStringToBoolean(Cookies.get(key))

/**
 *
 * @param {string} key
 * @param {Object} attributes
 * @param {number} attributes.maxAge Number of seconds until the cookie expires.
 * A zero or negative number will expire the cookie immediately.
 * If both Expires and Max-Age are set, Max-Age has precedence.
 *
 * @param {number | Date} attributes.expires Define when the cookie will be removed. Value can be a Number
 * which will be interpreted as days from time of creation or a
 * Date instance. If omitted, the cookie becomes a session cookie.
 *
 * @param {string} attributes.path Define the path where the cookie is available. Defaults to '/'
 *
 * @param {string} attributes.domain Define the domain where the cookie is available. Defaults to
 * the domain of the page where the cookie was created.
 *
 * @param {boolean} attributes.secure A Boolean indicating if the cookie transmission requires a
 * secure protocol (https). Defaults to false.
 *
 * @param {'strict' | 'lax' | 'none'} attributes.sameSite Asserts that a cookie must not be sent with cross-origin requests,
 * providing some protection against cross-site request forgery
 * attacks (CSRF)
 *
 * @param {string} defaultValue This value is only stored in the cookie if the cookie was previously not set and is stringified
 * @typedef {string} value return [0] The value depending on either the cookie that's already set or the defaultValue
 * @typedef {Function} setCookie return [1] Sets a value with the key specified in the useCookie call
 *
 * @returns {[value, setCookie]} Array with indices declared above
 */
const useCookie = (key, attributes = {}, defaultValue) => {
  const initialCookieValue = GetCookieValue(key) ? GetCookieValue(key) : defaultValue
  const [cookieValue, setCookieValue] = useState(initialCookieValue)

  // The cookie library doesn't support Max-Age so we translate it to an expire
  const { maxAge } = attributes
  if (typeof maxAge === 'number') {
    attributes.expires = new Date(Date.now() + maxAge * 1000)
    delete attributes.maxAge
  }
  attributes.domain = window.location.host
  attributes.path = attributes.path || '/'

  /**
   * We have a seperate function for setCookie since we want to remove via setCookie({falsy Value})
   * but still want to support Booleans, empty strings and zeroes.
   */
  const setCookie = value => {
    setCookieValue(value)
    if (isUndefinedOrNull(value)) {
      Cookies.remove(key, attributes)
      return
    }
    Cookies.set(key, value, attributes)
  }

  return [cookieValue, setCookie]
}

export default useCookie
