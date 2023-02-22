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

async function optimizeSvg(content, path, finalSvgoConfig = {}) {
    const { data } = await svgo.optimize(content, {
        ...finalSvgoConfig,
        path,
    });
    return data;
}

const moveAttrToSvgNode = (svgNode, targetElements, targetAttribute) => {
    if (targetElements.length <= 0)
        return;
    const allTargetElementAttrValues = targetElements
        .map((v) => v.attributes[targetAttribute])
        .filter((attrValue) => !!attrValue);
    const hasTargetAttr = allTargetElementAttrValues.length > 0;
    const isMonochromeAttr = hasTargetAttr && [...new Set(allTargetElementAttrValues)].length === 1;
    if (isMonochromeAttr) {
        svgNode.attributes[targetAttribute] = allTargetElementAttrValues[0];
        targetElements.forEach((v) => {
            delete v.attributes[targetAttribute];
        });
    }
};
function moveChildAttrToSvgElement (name = 'movePathFillAttrToSvgNode', option) {
    const finalOption = Object.assign({
        targetChildElementNames: ['path'],
        targetChildElementAttributes: ['fill'],
    }, option);
    return {
        name,
        fn() {
            return {
                element: {
                    enter: (node) => {
                        if (node.name === 'svg') {
                            if (!node.children || node.children.length <= 0)
                                return;
                            const elements = node.children.filter((v) => v.type === 'element');
                            const targetElements = elements.filter((v) => finalOption.targetChildElementNames.includes(v.name));
                            finalOption.targetChildElementAttributes.forEach((attrName) => {
                                moveAttrToSvgNode(node, targetElements, attrName);
                            });
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
    if (extraOptions.moveStrokeAttrToSvgNode) {
        finalSvgoConfig.plugins.push(moveChildAttrToSvgElement('moveStrokeAttrToSvgNode', {
            targetChildElementNames: ['path'],
            targetChildElementAttributes: ['stroke'],
        }));
    }
    if (extraOptions.movePathFillAttrToSvgNode) {
        finalSvgoConfig.plugins.push(moveChildAttrToSvgElement());
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

exports.svg4VuePlugin = svg4VuePlugin;
