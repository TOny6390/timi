/*
 * drpy 规则示例 —— 源站: 新版6v (xb6v.com)
 * 类型: 纯 HTML 网页站(WordPress 主题)，最简单档，无签名无加密。
 * 结构均来自实测抓取的页面，逐字段见下方注释。
 * 挂载方式: 你的 jar(含 csp_Drpy) 配置里
 *   { "key":"csp_Xb6v","name":"6v磁力","type":3,
 *     "api":"csp_Drpy","ext":"https://你自己托管/xb6v.js" }
 */

var rule = {
    title: '新版6v',                    // 显示名
    host: 'https://www.xb6v.com',       // 实测 200，HTML 结构清晰
    // 分类：站点用目录区分(对应实测首页 /dianshiju/oumeiju/ 等)
    // {cateId} 由 分类表 填入，{catePg} 为页码占位
    url: '/vodshow/{cateId}________{catePg}___.html',
    url_enc: 0,                          // 关键词不二次编码

    // 一级(列表页 -> 卡片)。格式: 列表容器;标题;图片;副标题;链接
    // 实测卡片: <a href="/xxx/N.html" class="zoom" rel="bookmark" title="片名">
    一级: 'body&&a[rel="bookmark"];a&&title;.list img&&src;;a&&href',

    // 二级(详情页)。实测: <h1>片名</h1>，选集是详情页内 magnet:/网盘 链接
    二级: {
        // 列表(选集名; 选集链接)。这里把磁力链接当"集"
        列表: 'body&&a[href^="magnet:"];a&&title;;a&&href',
        // 也可直接用函数处理更精细
    },

    // 搜索。实测 ?s= 返回需按站点确认是否真过滤(见正文说明)
    searchUrl: '/?s=**',
    searchable: 1,
    // 搜索用一级同款选择器(WordPress 搜索结果是列表卡片)
    搜索: 'body&&a[rel="bookmark"];a&&title;.list img&&src;;a&&href',

    // 分类表(实测首页出现的目录)
    filterable: 0,
};

// ---- 首页/分类(一级)与详情(二级)之间：play 取址 ----
// 本站播放地址 = 详情页里的 magnet 链接，无需 lazy 二次请求。
// 若换成 m3u8 需懒加载的站，才写下面这种 lazy()：
/*
function lazy(obj) {
    let html = request(obj.url);              // 再请求一次
    let m3u8 = pdfa(html, 'body&&video')[0].src || '';
    return { parse: 0, url: m3u8, header: rule.headers };
}
*/

// ---- 分类(实测目录，按需增删) ----
rule.class = '电影_电视剧#动漫_纪录片#综艺';
rule.oid = 'dianying_dianshiju#donghuapian_jilupian#zongyi';
// 一级 url 里的 {cateId} 会被 oid 替换。
// xb6v 真实目录形如 /dianshiju/oumeiju/ ，若上面 url 模板不匹配，
// 改为直接分类目录: url:'/list/{cateId}/index_{catePg}.html' 并按站点实测校准。
