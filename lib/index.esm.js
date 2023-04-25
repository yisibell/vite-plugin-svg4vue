import { compileTemplate } from 'vue/compiler-sfc';
import { optimize } from 'svgo';
import { readFileSync } from 'fs';
import { createSvgoConfig } from 'svgo-extra';
import qs from 'node:querystring';

async function compileSvg(source, id) {
    let { code } = compileTemplate({
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
    const { data } = await optimize(content, {
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
