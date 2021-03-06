import getConfig from './config';
import * as parse from './parse/index';
import {filterDanmaku, mergeDanmaku, layoutDanmaku, assign} from './util/index';
import ass from './ass/create';

export default (text, configOverrides, {source, filename}) => {
    let result = parse[source](text);
    // 配置一切看当前设置的为优先
    let config = assign(result.config || {}, getConfig(configOverrides));
    // 上下文信息是解析出来的优先，因为要恢复最初的文件名等
    let context = assign({source, filename}, result.context || {});
    let filteredList = filterDanmaku(result.list, config.block);
    let mergedList = mergeDanmaku(filteredList, config.mergeIn);
    let layoutList = layoutDanmaku(mergedList, config);
    let content = ass(layoutList, result.list, config, {filename: context.filename});

    return content;
};
