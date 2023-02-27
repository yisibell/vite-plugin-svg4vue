import { compileTemplate } from 'vue/compiler-sfc';
import { optimize } from 'svgo';
import { readFileSync } from 'fs';
import { moveChildAttrToSVGElement, responsiveSVGSize } from 'svgo-extra';

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

function createSvgoConfig (svgoConfig = {}, extraOptions = {}) {
    let finalSvgoConfig = {};
    finalSvgoConfig.plugins = ['preset-default'];
    if (extraOptions.moveStrokeAttrToSvgNode) {
        finalSvgoConfig.plugins.push(moveChildAttrToSVGElement('moveStrokeAttrToSVGNode', {
            targetChildElementNames: ['path'],
            targetChildElementAttributes: ['stroke', 'stroke-opacity'],
        }));
    }
    if (extraOptions.movePathFillAttrToSvgNode) {
        finalSvgoConfig.plugins.push(moveChildAttrToSVGElement());
    }
    if (responsiveSVGSize) {
        finalSvgoConfig.plugins.push(responsiveSVGSize());
    }
    if (svgoConfig.plugins && svgoConfig.plugins.length > 0) {
        finalSvgoConfig.plugins = [
            ...finalSvgoConfig.plugins,
            ...svgoConfig.plugins,
        ];
    }
    delete svgoConfig.plugins;
    finalSvgoConfig = { ...finalSvgoConfig, ...svgoConfig };
    return finalSvgoConfig;
}

function compileSvgToRaw(source) {
    const formatSource = source.replace(/"/g, `\\"`);
    const code = `\nexport default "${formatSource}";`;
    return code;
}

const svg4VuePlugin = (options = {}) => {
    const { svgoConfig = {}, defaultExport = 'url', assetsDirName = 'icons', enableBuildCache = true, enableMonochromeSvgOptimize = true, enableSvgSizeResponsive = true, } = options;
    const svgComponentCache = new Map();
    const svgRawCache = new Map();
    const svgRegex = new RegExp(`${assetsDirName}/.*\\.svg(?:\\?(component|url|raw))?$`);
    let isBuild = false;
    const finalSvgoConfig = createSvgoConfig(svgoConfig, {
        moveStrokeAttrToSvgNode: enableMonochromeSvgOptimize,
        movePathFillAttrToSvgNode: enableMonochromeSvgOptimize,
        responsiveSVGSize: enableSvgSizeResponsive,
    });
    return {
        name: 'vite-plugin-svg4vue',
        config(config, { command }) {
            isBuild = command === 'build';
            return config;
        },
        async transform(source, id) {
            const matchedId = id.match(svgRegex);
            const idWithoutQuery = id.replace(/\.svg\?.*/, '.svg');
            if (matchedId) {
                const type = matchedId[1];
                if ((defaultExport === 'raw' && typeof type === 'undefined') ||
                    type === 'raw') {
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
                        const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig);
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
