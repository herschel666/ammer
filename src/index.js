
'use strict';

import domEvents from '@f/dom-events';

/** @type {Number} */
const LISTENER_ELEMENT = 0;

/** @type {Number} */
const LISTENER_TYPE = 1;

/** @type {Number} */
const LISTENER_CALLBACK = 2;

/** @type {Function} */
const slice = Array.prototype.slice;

/** @type {Function} */
const concat = Array.prototype.concat;

/**
 * @param  {*} fn
 * @return {Boolean}
 */
function isFunction(fn) {
    return typeof fn === 'function';
}

/**
 * @param  {Array}       list
 * @param  {HTMLElement} element
 * @param  {String}      type
 * @return {Array}
 */
function getListeners(list, element, type) {
    return list.filter(listener => listener[LISTENER_ELEMENT] === element &&
        listener[LISTENER_TYPE] === type);
}

/**
 * @param  {Array} list
 * @param  {Array} removed
 * @return {Array}
 */
function updateListeners(list, removed) {
    return list.reduce((newList, listener) => {
        if (removed.indexOf(listener) === -1) {
            newList.push(listener);
        }
        return newList;
    }, []);
}

/**
 * @param {HTMLElement} element
 * @param {String}      type
 * @param {Function}    callback
 */
function addListener(element, type, callback) {
    element.addEventListener(type, callback);
    ammerPrivate._listeners = concat.call(ammerPrivate._listeners, arguments);
}

/**
 * @param {HTMLElement} element
 * @param {String}      type
 * @param {Function}    callback
 */
function removeListener(element, type, callback) {
    let listeners = getListeners(ammerPrivate._listeners, element, type);
    if (isFunction(callback)) {
        listeners = listeners.filter(listener => listener[LISTENER_CALLBACK] === callback);
    }
    listeners.forEach(listener => listener[LISTENER_ELEMENT].removeEventListener(
        listener[LISTENER_TYPE], listener[LISTENER_CALLBACK]));
    ammerPrivate._listeners = updateListeners(ammerPrivate._listeners, listeners);
}

/** @type {Object} */
const ammerPrivate = {
    _mode: null,
    _listeners: [],
    _addListener: addListener,
    _removeListener: removeListener
};

/** @type {Object} */
const ammerObject = {};

/** @type {Object} */
const proxyHandler = {
    get: function (obj, type) {
        if (domEvents.indexOf(type) === -1) {
            throw Error(`"${type} is not a valid DOM-event.`);
        }
        return (element, callback) => {
            if (type === 'on' && !isFunction(callback)) {
                throw Error(`Please pass in a callback-function to the ${type}-method`);
            }
            const elements = element instanceof HTMLCollection ?
                slice.call(element) :
                element instanceof HTMLElement ?
                [element] :
                [];
            elements.forEach(elem => ammerPrivate[ammerPrivate._mode](elem, type, callback));
        };
    }
};

/** @type {Proxy} */
const ammerProxy = new Proxy(ammerObject, proxyHandler);

/** @type {Object} */
const ammer = Object.create(null);

Object.defineProperty(ammer, 'on', {
    get: function () {
        ammerPrivate._mode = '_addListener';
        return ammerProxy;
    }
});

Object.defineProperty(ammer, 'off', {
    get: function () {
        ammerPrivate._mode = '_removeListener';
        return ammerProxy;
    }
});

export function create() {
    return ammer;
};
