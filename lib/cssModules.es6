import fs from 'fs';
import path from 'path';
import _get from 'lodash.get';
import parseAttrs from 'posthtml-attrs-parser';

let cssModulesCache = {};

export default (cssModulesPath) => {
    return function cssModules(tree) {
        // If the plugin is used in gulp watch or another similar tool, files with CSS modules
        // might change between runs. Therefore we purge the cache before each run.
        cssModulesCache = {};
        tree.match({attrs: {'css-module': /\w+/}}, node => {
            const attrs = parseAttrs(node.attrs);
            const cssModuleName = attrs['css-module'];
            delete attrs['css-module'];

            attrs.class = attrs.class || [];
            attrs.class.push(getCssClassName(cssModulesPath, cssModuleName));
            node.attrs = attrs.compose();

            return node;
        });
    };
};


function getCssClassName(cssModulesPath, cssModuleName) {
    if (fs.lstatSync(cssModulesPath).isDirectory()) {
        let cssModulesDir = cssModulesPath;
        let cssModuleNameParts = cssModuleName.split('.');
        let cssModulesFile = cssModuleNameParts.shift();
        cssModuleName = cssModuleNameParts.join('.');
        cssModulesPath = path.join(cssModulesDir, cssModulesFile);
    }

    const cssModules = getCssModules(path.resolve(cssModulesPath));
    const cssClassName = _get(cssModules, cssModuleName);
    if (! cssClassName) {
        throw getError('CSS module "' + cssModuleName + '" is not found');
    } else if (typeof cssClassName !== 'string') {
        throw getError('CSS module "' + cssModuleName + '" is not a string');
    }

    return cssClassName;
}


function getCssModules(cssModulesPath) {
    let fullPath = require.resolve(cssModulesPath);
    if (! cssModulesCache[fullPath]) {
        delete require.cache[fullPath];
        cssModulesCache[fullPath] = require(fullPath);
    }

    return cssModulesCache[fullPath];
}


function getError(message) {
    const fullMessage = '[posthtml-css-modules] ' + message;
    return new Error(fullMessage);
}
