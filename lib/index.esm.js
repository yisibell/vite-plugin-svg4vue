import { compileTemplate } from '@vue/compiler-sfc';
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

async function optimizeSvg(content, path, svgoConfig = {}) {
    const { data } = await optimize(content, {
        ...svgoConfig,
        path,
    });
    return data;
}

const svg4VuePlugin = (options = {}) => {
    const { svgoConfig = {}, defaultExport = 'url', assetsDirName = 'icons', enableBuildCache = true, } = options;
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
                        const code = readFileSync(idWithoutQuery, 'utf8');
                        const svg = await optimizeSvg(code, idWithoutQuery, svgoConfig);
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
