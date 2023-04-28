import { compileTemplate } from 'vue/compiler-sfc';
import * as SVGO from 'svgo';
import { readFileSync } from 'fs';
import { createSvgoConfig } from 'svgo-extra';
import qs from 'node:querystring';
import * as ufo from 'ufo';

async function compileSvg(source, id) {
    const { code: renderFunctionCode, map } = compileTemplate({
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

async function optimizeSvg(content, path, finalSvgoConfig = {}) {
    const { data } = await SVGO.optimize(content, {
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
        ? ufo.withTrailingSlash(assetsDirNameString)
        : '';
    const svgRegexString = `${safeAssetsDirName}.*\\.svg(\\?.*)?$`;
    const svgRegex = new RegExp(svgRegexString);
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
    const { svgoConfig = {}, defaultExport = DEFAULT_OPTIONS.defaultExport, assetsDirName = DEFAULT_OPTIONS.assetsDirName, enableBuildCache = true, enableMonochromeSvgOptimize = true, enableSvgSizeResponsive = true, enableSvgoPresetDefaultConfig = true, } = options;
    const svgComponentCache = new Map();
    const svgRawCache = new Map();
    let isBuild = false;
    const disabledSvgo = svgoConfig === false;
    const finalSvgoConfig = disabledSvgo
        ? {}
        : createSvgoConfig(svgoConfig, {
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
                        const code = readFileSync(idWithoutQuery, 'utf8');
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
                        const code = readFileSync(idWithoutQuery, 'utf8');
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

export { svg4VuePlugin };
