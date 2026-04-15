import type { Dimension } from '../types'

export const DIMENSIONS: Dimension[] = [
  { id: 'order',      publicName: '秩序欲',  technicalName: '类型与规则严格性' },
  { id: 'control',    publicName: '掌控欲',  technicalName: '底层控制权 / 抽象层级' },
  { id: 'expression', publicName: '表达欲',  technicalName: '语法表现力 / 范式自由度' },
  { id: 'teamwork',   publicName: '团队脑',  technicalName: '工程协作性 / 生态规范化' },
  { id: 'action',     publicName: '行动派',  technicalName: '反馈速度 / 原型推进效率' },
]

export const DIMENSION_IDS = DIMENSIONS.map(d => d.id)
