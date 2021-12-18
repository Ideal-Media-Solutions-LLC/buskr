// This file describes the interface between front end and back end.

import axios from 'axios';

const client = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}/api/` });

/**
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.description
 * @param {string[]} data.tags
 * @param {Date} data.starts
 * @param {Date} data.ends
 * @param {number} data.lng
 * @param {number} data.lat
 * @param {string[]} data.photos
 * @returns {Promise<number>} ID of created event
 */
export const createEvent = async function createEvent(data) {
  const { data: { id } } = await client.post('/events', data);
  return id;
};

/**
 * @param {Object} params
 * @param {number} params.lng
 * @param {number} params.lat
 * @param {Date} params.from
 * @param {Date} params.to
 * @param {number=} params.dist
 * @returns {Promise<string[]>} emails of buskers with conflicting events
 */
export const findConflicts = async function findConflicts(params) {
  const { data } = await client.get('/conflicts', { params });
  return data;
};

/**
 * @param {string} address
 * @returns {Promise<LocationData>}
 */
export const geolocate = async function geolocate(address) {
  const { data } = await client.get('/search', { params: { address } });
  return data;
};

/**
 * @param {number} id
 * @returns {Promise<Event>}
 */
export const getEvent = async function getEvent(id) {
  const { data } = await client.get(`/event/${id}`);
  return data;
};

/**
 * @param {Object} params
 * @param {number} params.lng
 * @param {number} params.lat
 * @param {('coords' | 'location' | 'tags' | 'photos')[]=} params.features
 * @param {Date=} params.from
 * @param {Date=} params.to
 * @param {number=} params.limit
 * @param {number=} params.offset
 * @param {number=} params.dist
 * @param {'distance' | 'time' | undefined} params.sort
 * @returns {Promise<GeoJSON>}
 */
export const getEvents = async function getEvents(params) {
  if (params.features) {
    params.features = params.features.join(',');
  }
  const { data } = await client.get('events', { params });
  return data;
};

/**
 * @param {number} id
 * @returns {Promise<Profile>}
 */
export const getProfile = async function getProfile(id) {
  const { data } = await client.get(`/profile/${id}`);
  return data;
};

// Typedefs

/** @typedef {{[field: string]: string}} LocationData */

/**
 * @typedef {Object} Event
 * @property {number?} distance
 * @property {'Feature'} type
 * @property {Object=} geometry
 * @property {'Point'} geometry.type
 * @property {[lng: number, lat: number]} geometry.coordinates
 * @property {Object} properties
 * @property {number} properties.id
 * @property {string} properties.name
 * @property {string} properties.description
 * @property {number} properties.buskerId
 * @property {string} properties.buskerName
 * @property {string[]=} properties.photos
 * @property {string[]=} properties.tags
 * @property {Date} properties.starts
 * @property {Date} properties.ends
 * @property {LocationData=} properties.location
 */

/**
 * @typedef {Object} GeoJSON
 * @property {'FeatureCollection'} type
 * @property {Event[]} features
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} email
 * @property {boolean} email_verified
 * @property {string?} photo
 * @property {string?} bio
 * @property {string?} paypal
 * @property {string?} cashapp
 * @property {string?} venmo
 * @property {Event[]} events
 */