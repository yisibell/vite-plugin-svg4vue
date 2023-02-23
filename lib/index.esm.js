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
const createTargetElements = (nodes, targetChildElementNames, wrapperElementNames, res = []) => {
    const elements = nodes.filter((v) => v.type === 'element' &&
        (targetChildElementNames.includes(v.name) ||
            (wrapperElementNames.length > 0 &&
                wrapperElementNames.includes(v.name))));
    elements.forEach((v) => {
        if (targetChildElementNames.includes(v.name)) {
            res.push(v);
        }
        if (v.children && v.children.length > 0) {
            createTargetElements(v.children, targetChildElementNames, wrapperElementNames, res);
        }
    });
    return res;
};
function moveChildAttrToSvgElement (name = 'movePathFillAttrToSvgNode', option) {
    const finalOption = Object.assign({
        wrapperElementNames: ['g'],
        targetChildElementNames: ['path'],
        targetChildElementAttributes: ['fill', 'fill-opacity'],
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
                            const targetElements = createTargetElements(node.children, finalOption.targetChildElementNames, finalOption.wrapperElementNames);
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

const setAttr = (node, name, value) => {
    node.attributes[name] = value;
};
function responsiveSVGSize () {
    return {
        name: 'responsiveSVGSize',
        fn: () => {
            return {
                element: {
                    enter(node) {
                        if (node.name === 'svg') {
                            const { width, height, style } = node.attributes;
                            const wNumber = Number.parseFloat(width);
                            const hNumber = Number.parseFloat(height);
                            const addStyle = `--svg-origin-width: ${wNumber};--svg-origin-height: ${hNumber};--svg-origin-width--with-unit: ${wNumber}px;--svg-origin-height--with-unit: ${hNumber}px;`;
                            const styleValue = style ? `${addStyle}${style}` : addStyle;
                            setAttr(node, 'style', styleValue);
                            setAttr(node, 'data-svg-origin-width', width);
                            setAttr(node, 'data-svg-origin-height', height);
                            if (width) {
                                setAttr(node, 'font-size', width);
                            }
                            setAttr(node, 'width', '1em');
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
            targetChildElementAttributes: ['stroke', 'stroke-opacity'],
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
