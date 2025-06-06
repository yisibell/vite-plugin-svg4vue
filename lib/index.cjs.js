'use strict';

var compilerSfc = require('vue/compiler-sfc');
var SVGO = require('svgo');
var defu = require('defu');
var ohash = require('ohash');
var node_fs = require('node:fs');
var svgoExtra = require('svgo-extra');
var qs = require('node:querystring');
var ufo = require('ufo');

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
var ufo__namespace = /*#__PURE__*/_interopNamespaceDefault(ufo);

async function compileSvg(source, id) {
    source = source
        .replace(/<style/g, '<component is="style"')
        .replace(/<\/style/g, '</component');
    const { code: renderFunctionCode, map } = compilerSfc.compileTemplate({
        id,
        filename: id,
        source,
        transformAssetUrls: false,
    });
    const code = `${renderFunctionCode}\nexport default { render };`;
    return {
        code,
        map,
    };
}

const withDefaultConfig = (source, defaults) => {
    const def = defu.createDefu((obj, key, value) => {
        if (Array.isArray(value) && Array.isArray(obj[key])) {
            obj[key] = [...obj[key], ...value];
            return true;
        }
    });
    return def(source, defaults);
};

const defaultSvgoConfig = (incommingConfig, opts, id) => {
    const hashedPrefix = `${opts?.namespacePrefix || 'a'}${ohash.hash({ id }).slice(0, 6)}`;
    const inconfig = typeof incommingConfig === 'boolean'
        ? {}
        : incommingConfig
            ? incommingConfig
            : {};
    const deConfig = {
        plugins: [
            {
                name: 'prefixIds',
                params: {
                    prefix: () => hashedPrefix,
                    prefixIds: opts?.namespaceIDs,
                    prefixClassNames: opts?.namespaceClassnames,
                },
            },
        ],
    };
    const outputConfig = withDefaultConfig(inconfig, deConfig);
    return outputConfig;
};
async function optimizeSvg(content, path, finalSvgoConfig = {}) {
    const { data } = await SVGO__namespace.optimize(content, {
        ...finalSvgoConfig,
        path,
    });
    return data;
}

function compileSvgToRaw(source) {
    const formatSource = JSON.stringify(source);
    const code = `\nexport default ${formatSource};`;
    return code;
}

const COMPONENT_COMPILE_TYPE = 'component';
const RAW_COMPILE_TYPE = 'raw';
const URL_COMPILE_TYPE = 'url';
const SKIP_SVGO_FLAG = 'skipsvgo';
const SKIP_MONOCHROME = 'skip-monochrome';
const SKIP_RESPONSIVE = 'skip-responsive';
var DEFAULT_OPTIONS;
(function (DEFAULT_OPTIONS) {
    DEFAULT_OPTIONS["defaultExport"] = "url";
    DEFAULT_OPTIONS["assetsDirName"] = "icons";
})(DEFAULT_OPTIONS || (DEFAULT_OPTIONS = {}));

const resolveSearchParams = (url, assetsDirName) => {
    const idWithoutQuery = url.replace(/\.svg\?.*/, '.svg');
    const assetsDirNameString = assetsDirName === false
        ? ''
        : assetsDirName === true
            ? DEFAULT_OPTIONS.assetsDirName
            : assetsDirName;
    const safeAssetsDirName = assetsDirNameString
        ? ufo__namespace.withTrailingSlash(assetsDirNameString)
        : '';
    const svgRegexString = `${safeAssetsDirName}.*\\.svg(\\?.*)?$`;
    const svgRegex = new RegExp(svgRegexString);
    const matchedId = url.match(svgRegex);
    const querystring = Array.isArray(matchedId) && matchedId[1]
        ? matchedId[1].replace('?', '')
        : '';
    const searchParamsKeys = Object.keys(qs.parse(querystring));
    const skipsvgo = searchParamsKeys.includes(SKIP_SVGO_FLAG);
    const skipMonochrome = searchParamsKeys.includes(SKIP_MONOCHROME);
    const skipResposive = searchParamsKeys.includes(SKIP_RESPONSIVE);
    let type = undefined;
    if (searchParamsKeys.includes(COMPONENT_COMPILE_TYPE)) {
        type = COMPONENT_COMPILE_TYPE;
    }
    else if (searchParamsKeys.includes(RAW_COMPILE_TYPE)) {
        type = RAW_COMPILE_TYPE;
    }
    else if (searchParamsKeys.includes(URL_COMPILE_TYPE)) {
        type = URL_COMPILE_TYPE;
    }
    return {
        type,
        skipsvgo,
        skipMonochrome,
        skipResposive,
        searchParamsKeys,
        matchedId,
        idWithoutQuery,
        querystring,
    };
};

const svg4VuePlugin = (options = {}) => {
    const { svgoConfig = {}, defaultExport = DEFAULT_OPTIONS.defaultExport, assetsDirName = DEFAULT_OPTIONS.assetsDirName, enableBuildCache = true, enableMonochromeSvgOptimize = true, enableSvgSizeResponsive = true, enableSvgoPresetDefaultConfig = true, namespaceClassnames = true, namespaceIDs = true, namespacePrefix = 'a', enforce = 'pre', } = options;
    const svgComponentCache = new Map();
    const svgRawCache = new Map();
    let isBuild = false;
    const disabledSvgo = svgoConfig === false;
    return {
        name: 'vite-plugin-svg4vue',
        enforce,
        configResolved(config) {
            isBuild = config.mode === 'production';
        },
        async transform(source, id) {
            const { idWithoutQuery, type, matchedId, skipsvgo, skipMonochrome, skipResposive, } = resolveSearchParams(id, assetsDirName);
            const finalSvgoConfig = svgoExtra.createSvgoConfig(defaultSvgoConfig(svgoConfig, {
                namespaceClassnames,
                namespaceIDs,
                namespacePrefix,
            }, idWithoutQuery), {
                moveStrokeAttrToSvgNode: enableMonochromeSvgOptimize && !skipMonochrome,
                movePathFillAttrToSvgNode: enableMonochromeSvgOptimize && !skipMonochrome,
                responsiveSVGSize: enableSvgSizeResponsive && !skipResposive,
                presetDefault: enableSvgoPresetDefaultConfig,
            });
            if (matchedId) {
                if ((defaultExport === RAW_COMPILE_TYPE && typeof type === 'undefined') ||
                    type === RAW_COMPILE_TYPE) {
                    if (disabledSvgo || skipsvgo)
                        return source;
                    let cachedSvgRawResult = svgRawCache.get(id);
                    if (!cachedSvgRawResult) {
                        const code = node_fs.readFileSync(idWithoutQuery, 'utf8');
                        const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig);
                        cachedSvgRawResult = compileSvgToRaw(svg);
                        if (enableBuildCache && isBuild) {
                            svgRawCache.set(id, cachedSvgRawResult);
                        }
                    }
                    return cachedSvgRawResult;
                }
                if ((defaultExport === URL_COMPILE_TYPE && typeof type === 'undefined') ||
                    type === URL_COMPILE_TYPE) {
                    return source;
                }
                if ((defaultExport === COMPONENT_COMPILE_TYPE &&
                    typeof type === 'undefined') ||
                    type === COMPONENT_COMPILE_TYPE) {
                    let cachedSvgComponentResult = svgComponentCache.get(id);
                    if (!cachedSvgComponentResult) {
                        const code = node_fs.readFileSync(idWithoutQuery, 'utf8');
                        let svg = code;
                        if (!disabledSvgo && !skipsvgo) {
                            svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig);
                        }
                        cachedSvgComponentResult = await compileSvg(svg, idWithoutQuery);
                        if (enableBuildCache && isBuild) {
                            svgComponentCache.set(id, cachedSvgComponentResult);
                        }
                    }
                    return cachedSvgComponentResult;
                }
            }
        },
    };
};

exports.svg4VuePlugin = svg4VuePlugin;
