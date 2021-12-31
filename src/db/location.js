import axios from 'axios';
import cache from './cache';

const { EXPIRE_ADDRESS, EXPIRE_IP } = process.env;
const expireAddress = Number(EXPIRE_ADDRESS) || undefined;
const expireIP = Number(EXPIRE_IP) || undefined;

const geocodeAPI = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/json',
  params: {
    key: process.env.GOOGLE_KEY,
  },
});

const ipAPI = axios.create({
  baseURL: 'https://ipapi.co/',
});

const lookupIP = async function lookupIP(ip) {
  const { data: { longitude: lng, latitude: lat } } = await ipAPI.get(`/${ip}/json/`);
  return typeof lng === 'number' && typeof lat === 'number' ? { lng, lat } : null;
};

export const locateIP = async function locateIP(ip) {
  return cache(`ip:${ip}`, async () => lookupIP(ip), expireIP);
};

const reverseGeocodeOne = async function reverseGeocodeOne([lng, lat]) {
  const latlng = `${lat},${lng}`;
  const { data: { results: [address] } } = await geocodeAPI.get('/', { params: { latlng } });

  if (address === undefined) {
    return {};
  }

  const condensed = Object.values(address.address_components)
    .map(({ short_name, types: [type] }) => [type, short_name]);
  const location = Object.fromEntries(condensed);

  const { street_number, route } = location;
  if (street_number !== undefined && route !== undefined) {
    delete location.street_number;
    delete location.route;
    location.address = `${street_number} ${route}`;
  }

  return location;
};

const reverseGeocodeCached = function geocache(id, [lng, lat]) {
  return cache(`loc:${id}`, async () => reverseGeocodeOne([lng, lat]), expireAddress);
};

export const reverseGeocode = async function reverseGeocode(rows) {
  return Promise.all(rows.map(async (row) => {
    row.properties.location = await reverseGeocodeCached(
      row.properties.id,
      row.geometry.coordinates,
    );
  }));
};

export const geocode = async function geocode(address) {
  const { data: { results: [result] } } = await geocodeAPI.get('/', { params: { address } });
  return result === undefined ? null : result.geometry.location;
};
