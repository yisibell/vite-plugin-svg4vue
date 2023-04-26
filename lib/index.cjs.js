'use strict';

var compilerSfc = require('vue/compiler-sfc');
var SVGO = require('svgo');
var fs = require('fs');
var svgoExtra = require('svgo-extra');
var qs = require('node:querystring');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var SVGO__namespace = /*#__PURE__*/_interopNamespaceDefault(SVGO);

async function compileSvg(source, id) {
    let { code } = compilerSfc.compileTemplate({
        id,
        filename: id,
        source,
        transformAssetUrls: false,
    });
    code = code.replace('export function render', 'function render');
    code += `\nexport default { render };`;
    return code;
}

async function optimizeSvg(content, path, finalSvgoConfig = {}) {
    const { data } = await SVGO__namespace.optimize(content, {
        ...finalSvgoConfig,
        path,
    });
    return data;
}

function compileSvgToRaw(source) {
    const formatSource = source.replace(/"/g, `\\"`);
    const code = `\nexport default "${formatSource}";`;
    return code;
}

const resolveSearchParams = (url, assetsDirName) => {
    const idWithoutQuery = url.replace(/\.svg\?.*/, '.svg');
    const svgRegex = new RegExp(`${assetsDirName}/.*\\.svg(\\?.*)?$`);
    const matchedId = url.match(svgRegex);
    const querystring = Array.isArray(matchedId)
        ? matchedId[1].replace('?', '')
        : '';
    const searchParamsKeys = Object.keys(qs.parse(querystring));
    const skipsvgo = searchParamsKeys.includes('skipsvgo');
    const type = !skipsvgo || searchParamsKeys.length >= 2 ? searchParamsKeys[0] : undefined;
    return {
        type,
        skipsvgo,
        searchParamsKeys,
        matchedId,
        idWithoutQuery,
        querystring,
    };
};

const svg4VuePlugin = (options = {}) => {
    const { svgoConfig = {}, defaultExport = 'url', assetsDirName = 'icons', enableBuildCache = true, enableMonochromeSvgOptimize = true, enableSvgSizeResponsive = true, enableSvgoPresetDefaultConfig = true, } = options;
    const svgComponentCache = new Map();
    const svgRawCache = new Map();
    let isBuild = false;
    const disabledSvgo = svgoConfig === false;
    const finalSvgoConfig = disabledSvgo
        ? {}
        : svgoExtra.createSvgoConfig(svgoConfig, {
            moveStrokeAttrToSvgNode: enableMonochromeSvgOptimize,
            movePathFillAttrToSvgNode: enableMonochromeSvgOptimize,
            responsiveSVGSize: enableSvgSizeResponsive,
            presetDefault: enableSvgoPresetDefaultConfig,
        });
    return {
        name: 'vite-plugin-svg4vue',
        config(config, { command }) {
            isBuild = command === 'build';
            return config;
        },
        async transform(source, id) {
            const { idWithoutQuery, type, matchedId, skipsvgo } = resolveSearchParams(id, assetsDirName);
            if (matchedId) {
                if ((defaultExport === 'raw' && typeof type === 'undefined') ||
                    type === 'raw') {
                    if (disabledSvgo || skipsvgo)
                        return source;
                    let cachedSvgRawResult = svgRawCache.get(idWithoutQuery);
                    if (!cachedSvgRawResult) {
                        const code = fs.readFileSync(idWithoutQuery, 'utf8');
                        const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig);
                        cachedSvgRawResult = compileSvgToRaw(svg);
                        if (enableBuildCache && isBuild) {
                            svgRawCache.set(idWithoutQuery, cachedSvgRawResult);
                        }
                    }
                    return cachedSvgRawResult;
                }
                if ((defaultExport === 'url' && typeof type === 'undefined') ||
                    type === 'url') {
                    return source;
                }
                if ((defaultExport === 'component' && typeof type === 'undefined') ||
                    type === 'component') {
                    let cachedSvgComponentResult = svgComponentCache.get(idWithoutQuery);
                    if (!cachedSvgComponentResult) {
                        const code = fs.readFileSync(idWithoutQuery, 'utf8');
                        let svg = code;
                        if (!disabledSvgo && !skipsvgo) {
                            svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig);
                        }
                        cachedSvgComponentResult = await compileSvg(svg, idWithoutQuery);
                        if (enableBuildCache && isBuild) {
                            svgComponentCache.set(idWithoutQuery, cachedSvgComponentResult);
                        }
                    }
                    return cachedSvgComponentResult;
                }
            }
        },
    };
};

exports.svg4VuePlugin = svg4VuePlugin;
