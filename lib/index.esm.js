import { compileTemplate } from 'vue/compiler-sfc';
import { optimize } from 'svgo';
import { readFileSync } from 'fs';

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

function movePathFillAttrToSvgNode () {
    return {
        name: 'movePathFillAttrToSvgNode',
        fn() {
            return {
                element: {
                    enter: (node) => {
                        if (node.name === 'svg') {
                            if (!node.children || node.children.length <= 0)
                                return;
                            const elements = node.children.filter((v) => v.type === 'element');
                            const pathElements = elements.filter((v) => v.name === 'path');
                            if (pathElements.length <= 0)
                                return;
                            const allPathFillValue = pathElements
                                .map((v) => v.attributes?.fill)
                                .filter((fillValue) => !!fillValue);
                            const hasPathFill = allPathFillValue.length > 0;
                            const isMonochromeSvg = hasPathFill && [...new Set(allPathFillValue)].length === 1;
                            if (isMonochromeSvg) {
                                node.attributes.fill = allPathFillValue[0];
                                pathElements.forEach((v) => {
                                    delete v.attributes.fill;
                                });
                            }
                        }
                    },
                },
            };
        },
    };
}

function responsiveSVGSize () {
    return {
        name: 'responsiveSVGSize',
        fn: () => {
            return {
                element: {
                    enter(node) {
                        if (node.name === 'svg') {
                            const { width } = node.attributes;
                            width && (node.attributes['font-size'] = width);
                            node.attributes.width = '1em';
                            delete node.attributes.height;
                        }
                    },
                },
            };
        },
    };
}

function createSvgoConfig (svgoConfig = {}, extraOptions = {}) {
    let finalSvgoConfig = {};
    finalSvgoConfig.plugins = ['preset-default'];
    if (extraOptions.movePathFillAttrToSvgNode) {
        finalSvgoConfig.plugins.push(movePathFillAttrToSvgNode());
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

const svg4VuePlugin = (options = {}) => {
    const { svgoConfig = {}, defaultExport = 'url', assetsDirName = 'icons', enableBuildCache = true, enableMonochromeSvgOptimize = true, enableSvgSizeResponsive = true, } = options;
    const cache = new Map();
    const svgRegex = new RegExp(`${assetsDirName}/.*\\.svg(?:\\?(component|url))?$`);
    let isBuild = false;
    const finalSvgoConfig = createSvgoConfig(svgoConfig, {
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
            const result = id.match(svgRegex);
            if (result) {
                const type = result[1];
                if ((defaultExport === 'url' && typeof type === 'undefined') ||
                    type === 'url') {
                    return source;
                }
                if ((defaultExport === 'component' && typeof type === 'undefined') ||
                    type === 'component') {
                    const idWithoutQuery = id.replace('.svg?component', '.svg');
                    let result = cache.get(idWithoutQuery);
                    if (!result) {
                        const code = readFileSync(idWithoutQuery, 'utf8');
                        const svg = await optimizeSvg(code, idWithoutQuery, finalSvgoConfig);
                        result = await compileSvg(svg, idWithoutQuery);
                        if (enableBuildCache && isBuild) {
                            cache.set(idWithoutQuery, result);
                        }
                    }
                    return result;
                }
            }
        },
    };
};

export { svg4VuePlugin };
