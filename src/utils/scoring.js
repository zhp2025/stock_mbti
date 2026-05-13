/**
 * 股商测试MBTI — 评分引擎
 *
 * 计算逻辑:
 * 1. 每题得分1-5
 * 2. reverse=true 的题目需反向计分: 6 - score
 * 3. 按维度汇总得分
 * 4. 每维度得分 >= 阈值(18分)判定倾向右侧，否则倾向左侧
 * 5. 组合4维度得到16型人格代码
 */

import questions, { dimensionKeys } from '../data/questions'

/** 计算每个维度的得分和倾向 */
export function calculateScores(answers) {
  // answers: { [questionId]: score (1-5) }
  const dimensions = { D1: 0, D2: 0, D3: 0, D4: 0 }
  const dimensionCounts = { D1: 0, D2: 0, D3: 0, D4: 0 }

  questions.forEach((q) => {
    const rawScore = answers[q.id] || 3 // 未作答默认3分（中性）
    const effectiveScore = q.reverse ? 6 - rawScore : rawScore
    dimensions[q.dimension] += effectiveScore
    dimensionCounts[q.dimension]++
  })

  // 归一化到百分比 (每维度6题，最高30分，最低6分)
  const normalized = {}
  const tendencies = {}
  const percentages = {}

  Object.keys(dimensions).forEach((dim) => {
    const raw = dimensions[dim]
    const min = 6   // 最低可能得分
    const max = 30  // 最高可能得分
    // 百分比: 0% = 完全倾向左侧, 100% = 完全倾向右侧
    const pct = Math.round(((raw - min) / (max - min)) * 100)
    percentages[dim] = pct

    // >= 50% 倾向右侧
    if (pct >= 50) {
      tendencies[dim] = dimensionKeys[dim].right
    } else {
      tendencies[dim] = dimensionKeys[dim].left
    }

    normalized[dim] = raw
  })

  // 生成人格代码
  const typeCode = Object.values(tendencies).join('')

  return {
    rawScores: normalized,
    percentages,   // { D1: 65, D2: 40, ... }  每个维度的右侧倾向百分比
    tendencies,    // { D1: 'I', D2: 'V', ... }
    typeCode,       // 'IVDS'
  }
}

/** 获取各维度得分用于雷达图 (0-100 统一尺度) */
export function getRadarData(percentages) {
  return [
    { dimension: '独立分析', value: 100 - percentages.D1, fullMark: 100 },
    { dimension: '技术博弈', value: percentages.D2, fullMark: 100 },
    { dimension: '纪律至上', value: 100 - percentages.D3, fullMark: 100 },
    { dimension: '长期主义', value: percentages.D4, fullMark: 100 },
  ]
}
