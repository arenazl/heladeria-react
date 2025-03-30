const fs = require('fs');
const path = require('path');

// Ruta al archivo problemático
const registryPath = path.join(
  __dirname,
  '../node_modules/@react-native/assets-registry/registry.js'
);

// Nuevo contenido sin sintaxis Flow
const newContent = `/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * @typedef {Object} PackagerAsset
 * @property {boolean} __packager_asset
 * @property {string} fileSystemLocation
 * @property {string} httpServerLocation
 * @property {number|null} width
 * @property {number|null} height
 * @property {Array<number>} scales
 * @property {string} hash
 * @property {string} name
 * @property {string} type
 */

const assets = [];

/**
 * Register an asset in the asset registry.
 */
function registerAsset(asset) {
  // \`push\` returns new array length, so the first asset will
  // get id 1 (not 0) to make the value truthy
  return assets.push(asset);
}

/**
 * Get an asset by id.
 */
function getAssetByID(assetId) {
  return assets[assetId - 1];
}

module.exports = {registerAsset, getAssetByID};
`;

// Verificar si el archivo existe
if (fs.existsSync(registryPath)) {
  // Sobreescribir el archivo con el nuevo contenido
  fs.writeFileSync(registryPath, newContent);
  console.log('React Native assets registry file fixed successfully!');
} else {
  console.error('Could not find the React Native assets registry file!');
  process.exit(1);
}