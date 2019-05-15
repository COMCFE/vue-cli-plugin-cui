/**
 * 字体图标, 统一使用SVG Sprite矢量图标(http://www.iconfont.cn/）
 *
 * 使用:
 *  1. 在阿里矢量图标站创建一个项目, 并添加图标(这一步非必须, 创建方便项目图标管理)
 *
 *  2-1. 添加icon, 选中新增的icon图标, 复制代码 -> 下载 -> SVG下载 -> 粘贴代码(重命名)
 *  2-2. 添加icons, 下载图标库对应[iconfont.js]文件, 替换项目[./iconfont.js]文件
 *
 *  3. 组件模版中使用 [<svg-icon name="canyin"></icon-svg>]
 *
 * 注意:
 *  1. 通过2-2 添加icons, $getIcons方法无法返回对应数据
 */

import Vue from "vue";
import SvgIcon from "./svg-icon";

// 引入图标库文件
import "./iconfont.js";

// 引入 "@/icons" 文件夹中的所有 svg 文件
const svgFiles = require.context("@/icons", true, /\.svg$/);
const iconList = svgFiles.keys().map(item => svgFiles(item));

// 注册 svg-icon 组件
Vue.component(SvgIcon.name, SvgIcon);

/**
 * 获取 svg 图标列表
 */
Vue.prototype.$getIcons = () => {
  return iconList.map(i => i.default.id.split("-")[1]);
};
