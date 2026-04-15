import type { Question } from '../types'

export const questions: Question[] = [
  {
    id: 'q01',
    text: '你搬进新家，第一件事是什么？',
    options: [
      { emoji: '📋', title: '制定整理计划', description: '每件家具的位置都必须有讲究', scores: { order: 3, teamwork: 1 } },
      { emoji: '🔌', title: '先把网线接好', description: '其他的慢慢来，先保证在线', scores: { action: 3, control: 1 } },
      { emoji: '🎨', title: '按心情随意摆放', description: '感觉对了就行，不需要规划', scores: { expression: 3 } },
      { emoji: '📐', title: '研究最优利用方案', description: '每个房间的面积都不该浪费', scores: { control: 3, order: 1 } },
    ],
  },
  {
    id: 'q02',
    text: '做菜的时候，你倾向于？',
    options: [
      { emoji: '📖', title: '严格按照菜谱来', description: '比例精确到克，火候精确到秒', scores: { order: 3 } },
      { emoji: '🍳', title: '菜谱只是参考', description: '随手发挥才有灵魂', scores: { expression: 3 } },
      { emoji: '⚡', title: '做最简单的', description: '能吃就行，速度第一', scores: { action: 3 } },
      { emoji: '🔬', title: '研究食材搭配原理', description: '先搞懂美拉德反应再下锅', scores: { control: 3, order: 1 } },
    ],
  },
  {
    id: 'q03',
    text: '朋友约你一起做一个小项目，你的第一反应是？',
    options: [
      { emoji: '📝', title: '先定好规则和分工', description: '没有计划的项目注定翻车', scores: { teamwork: 3, order: 1 } },
      { emoji: '🚀', title: '先做个原型看看', description: '聊再多不如动手试试', scores: { action: 3 } },
      { emoji: '🔍', title: '我需要理解底层逻辑', description: '在动手之前，先搞清楚为什么要做', scores: { control: 3 } },
      { emoji: '✨', title: '我负责让它酷起来', description: '创意和体验是我最关心的', scores: { expression: 3 } },
    ],
  },
  {
    id: 'q04',
    text: '如果代码能闻到味道，你觉得好代码应该闻起来像？',
    options: [
      { emoji: '👔', title: '刚洗完的衣服', description: '干净、整洁、一丝不苟', scores: { order: 3 } },
      { emoji: '🔧', title: '机油味', description: '精密运转的机器', scores: { control: 3 } },
      { emoji: '🌸', title: '香水', description: '优雅且有个性', scores: { expression: 3 } },
      { emoji: '☕', title: '咖啡', description: '提神且实用', scores: { action: 3 } },
    ],
  },
  {
    id: 'q05',
    text: '你在图书馆看书，有人坐在旁边大声打电话，你会？',
    options: [
      { emoji: '🎧', title: '戴上耳机继续专注', description: '解决自己的问题比改变别人容易', scores: { control: 3, action: 1 } },
      { emoji: '🤝', title: '礼貌提醒对方', description: '公共场所有公共场所的规则', scores: { teamwork: 3 } },
      { emoji: '🚶', title: '换个位置', description: '动作比生气更有效', scores: { action: 3 } },
      { emoji: '📜', title: '内心起草行为规范', description: '这个图书馆需要一份更好的规则', scores: { order: 3 } },
    ],
  },
  {
    id: 'q06',
    text: '面对一个复杂任务，你更倾向于？',
    options: [
      { emoji: '🧩', title: '拆解成小步骤', description: '把大问题变成一堆小问题', scores: { order: 3, action: 1 } },
      { emoji: '🎯', title: '找到核心问题', description: '从根本入手，不做表面工夫', scores: { control: 3 } },
      { emoji: '💡', title: '找巧妙的方式', description: '一个好的抽象可以一步到位', scores: { expression: 3 } },
      { emoji: '👥', title: '找同伴一起讨论', description: '两个脑子比一个好', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q07',
    text: '你被分配了一个不太喜欢的任务，你会？',
    options: [
      { emoji: '✅', title: '照做并建议改进', description: '完成任务是第一位的，改进是附赠的', scores: { teamwork: 3, order: 1 } },
      { emoji: '🔄', title: '用自己的方式重新定义', description: '如果必须做，就做出我的风格', scores: { expression: 3 } },
      { emoji: '⏩', title: '快速完成然后闪人', description: '别浪费时间在不重要的事上', scores: { action: 3 } },
      { emoji: '🔎', title: '研究任务的设计逻辑', description: '搞清楚为什么是这样设计的', scores: { control: 3, order: 1 } },
    ],
  },
  {
    id: 'q08',
    text: '你最受不了的队友行为是？',
    options: [
      { emoji: '🚫', title: '不遵守约定', description: '说好的规则为什么你不遵守', scores: { order: 3 } },
      { emoji: '🤷', title: '不愿深入理解问题', description: '表面解决问题迟早会翻车', scores: { control: 3 } },
      { emoji: '😑', title: '做事没有创意', description: '千篇一律的方案让人窒息', scores: { expression: 3 } },
      { emoji: '🐢', title: '效率太低拖后腿', description: '进度是会传染的', scores: { action: 3, teamwork: 1 } },
    ],
  },
  {
    id: 'q09',
    text: '你获得了一台全新电脑，第一步做什么？',
    options: [
      { emoji: '⚙️', title: '配置开发环境', description: '编译器、终端、快捷键一步到位', scores: { control: 3, order: 1 } },
      { emoji: '📁', title: '定义文件夹结构', description: '命名规范和目录层级是一切的基础', scores: { order: 3 } },
      { emoji: '🎮', title: '装几个好玩的试试', description: '新电脑当然要先玩一下', scores: { action: 3, expression: 1 } },
      { emoji: '🔗', title: '同步到团队配置', description: '和大家保持一致最重要', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q10',
    text: '如果编程语言是宠物，你想养什么样的？',
    options: [
      { emoji: '🐕‍🦺', title: '训练有素的导盲犬', description: '可靠、守规矩、值得信赖', scores: { order: 3, teamwork: 1 } },
      { emoji: '🐱', title: '独立优雅的猫', description: '不黏人，但每个动作都有美感', scores: { expression: 3, control: 1 } },
      { emoji: '🐹', title: '小巧灵活的仓鼠', description: '体型小但跑得飞快', scores: { action: 3 } },
      { emoji: '🐍', title: '冷血但精准的蛇', description: '安静、高效、目标明确', scores: { control: 3 } },
    ],
  },
  {
    id: 'q11',
    text: '你写文章（或做 PPT）时的风格是？',
    options: [
      { emoji: '📑', title: '先列大纲再填内容', description: '结构清晰是好内容的基础', scores: { order: 3 } },
      { emoji: '🌊', title: '想到哪写到哪', description: '灵感不能被框架束缚', scores: { expression: 3, action: 1 } },
      { emoji: '✏️', title: '反复打磨每一句话', description: '好作品是改出来的', scores: { control: 3, expression: 1 } },
      { emoji: '📋', title: '参考模板快速完成', description: '没必要每次都从零开始', scores: { teamwork: 3, action: 1 } },
    ],
  },
  {
    id: 'q12',
    text: '旅行时你更喜欢？',
    options: [
      { emoji: '🗺️', title: '做详细行程规划', description: '每个时间段都安排好才安心', scores: { order: 3 } },
      { emoji: '🎒', title: '有个方向就出发', description: '最好的风景往往在计划之外', scores: { action: 3 } },
      { emoji: '🏝️', title: '选小众路线', description: '人少的地方才有独特体验', scores: { expression: 3 } },
      { emoji: '👫', title: '和朋友商量着来', description: '旅行的快乐在于分享', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q13',
    text: '如果你必须教一个完全的新手做某件事，你会？',
    options: [
      { emoji: '📃', title: '给一份完整步骤清单', description: '按步骤来就不会出错', scores: { order: 3, teamwork: 1 } },
      { emoji: '🤸', title: '让他先试，遇到问题再帮', description: '自己踩坑学得最快', scores: { action: 3, expression: 1 } },
      { emoji: '🧠', title: '从原理讲起', description: '理解了为什么，才算真的会了', scores: { control: 3 } },
      { emoji: '📚', title: '推荐标准教程', description: '好的教程比我讲得好', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q14',
    text: '你在一个魔法世界，你的咒语风格是？',
    options: [
      { emoji: '📜', title: '长咒语，每个字严格', description: '一个音节都不能错', scores: { order: 3 } },
      { emoji: '🤫', title: '默念即可生效', description: '我要直接控制魔力', scores: { control: 3 } },
      { emoji: '🎶', title: '用自创的诗歌施法', description: '魔法应该是一种艺术', scores: { expression: 3 } },
      { emoji: '🤝', title: '和同伴组合大招', description: '合体技才是最强的', scores: { teamwork: 3, action: 1 } },
    ],
  },
  {
    id: 'q15',
    text: '你发现了一个有趣的新领域，你会？',
    options: [
      { emoji: '📖', title: '找权威入门书系统学习', description: '基础打好了再动手', scores: { order: 3, control: 1 } },
      { emoji: '🛠️', title: '马上做个小项目试试', description: '实践出真知', scores: { action: 3 } },
      { emoji: '💬', title: '找社区讨论交流', description: '和同好聊聊效率更高', scores: { teamwork: 3 } },
      { emoji: '🧭', title: '用自己的方式探索', description: '走自己的路才有惊喜', scores: { expression: 3, control: 1 } },
    ],
  },
]
