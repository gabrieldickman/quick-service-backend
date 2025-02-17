const ActiveDirectory  = require('activedirectory2');
require('dotenv').config();

const config = {
  url: `ldap://${process.env.AD_IP_RANGE1}:${process.env.AD_PORT}`, 
  baseDN: `dc=${process.env.AD_DOMAIN.replace(/\./g, ",dc=")}`,
  username: `${process.env.AD_DOMAIN}\\${process.env.AD_USER}`,
  password: process.env.AD_PASSWORD,
  reconnect: true,
};

const ad = new ActiveDirectory(config);

const switchADServer = () => {
  config.url = `ldap://${process.env.AD_IP_RANGE2}:${process.env.AD_PORT}`;
  return new ActiveDirectory(config);
};

module.exports = { ad, switchADServer };