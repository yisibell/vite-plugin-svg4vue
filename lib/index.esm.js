import { compileTemplate } from 'vue/compiler-sfc';
import * as SVGO from 'svgo';
import { v4 } from 'uuid';
import { readFileSync } from 'node:fs';
import { createSvgoConfig } from 'svgo-extra';
import qs from 'node:querystring';
import * as ufo from 'ufo';

async function compileSvg(source, id) {
    source = source
        .replace(/<style/g, '<component is="style"')
        .replace(/<\/style/g, '</component');
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

const genUuid = () => {
    return `a-${v4().slice(0, 5)}`;
};
async function optimizeSvg(content, path, finalSvgoConfig = {}) {
    finalSvgoConfig.plugins?.push({
        name: 'prefixIds',
        params: {
            prefix: () => genUuid(),
        },
    });
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
        ? ufo.withTrailingSlash(assetsDirNameString)
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
    const { svgoConfig = {}, defaultExport = DEFAULT_OPTIONS.defaultExport, assetsDirName = DEFAULT_OPTIONS.assetsDirName, enableBuildCache = true, enableMonochromeSvgOptimize = true, enableSvgSizeResponsive = true, enableSvgoPresetDefaultConfig = true, } = options;
    const svgComponentCache = new Map();
    const svgRawCache = new Map();
    let isBuild = false;
    const disabledSvgo = svgoConfig === false;
    return {
        name: 'vite-plugin-svg4vue',
        configResolved(config) {
            isBuild = config.mode === 'production';
        },
        async transform(source, id) {
            const { idWithoutQuery, type, matchedId, skipsvgo, skipMonochrome, skipResposive, } = resolveSearchParams(id, assetsDirName);
            const finalSvgoConfig = disabledSvgo
                ? {}
                : createSvgoConfig(svgoConfig, {
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
                        const code = readFileSync(idWithoutQuery, 'utf8');
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
                        const code = readFileSync(idWithoutQuery, 'utf8');
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

export { svg4VuePlugin };
