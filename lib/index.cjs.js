'use strict';

var compilerSfc = require('vue/compiler-sfc');
var svgo = require('svgo');
var fs = require('fs');

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
                            const pathElements = node.children.filter((v) => v.name === 'path');
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

async function optimizeSvg(content, path, svgoConfig = {}, extraOptions = {}) {
    let finalSvgoConfig = {};
    finalSvgoConfig.plugins = ['preset-default'];
    if (extraOptions.movePathFillAttrToSvgNode) {
        finalSvgoConfig.plugins.push(movePathFillAttrToSvgNode());
    }
    if (svgoConfig.plugins && svgoConfig.plugins.length > 0) {
        finalSvgoConfig.plugins = [
            ...finalSvgoConfig.plugins,
            ...svgoConfig.plugins,
        ];
    }
    delete svgoConfig.plugins;
    finalSvgoConfig = { ...finalSvgoConfig, ...svgoConfig };
    const { data } = await svgo.optimize(content, {
        ...finalSvgoConfig,
        path,
    });
    return data;
}

const svg4VuePlugin = (options = {}) => {
    const { svgoConfig = {}, defaultExport = 'url', assetsDirName = 'icons', enableBuildCache = true, enableMonochromeSvgOptimize = true, } = options;
    const cache = new Map();
    const svgRegex = new RegExp(`${assetsDirName}/.*\\.svg(?:\\?(component|url))?$`);
    let isBuild = false;
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
                        const code = fs.readFileSync(idWithoutQuery, 'utf8');
                        const svg = await optimizeSvg(code, idWithoutQuery, svgoConfig, {
                            movePathFillAttrToSvgNode: enableMonochromeSvgOptimize,
                        });
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

exports.svg4VuePlugin = svg4VuePlugin;
