/**
 * 前端分析追踪工具
 *
 * 双重上报：
 * 1. Vercel Analytics（自动页面浏览 + 自定义事件）
 * 2. /api/track 自定义后端（详细事件 + KV存储）
 *
 * 同时维护 localStorage 中的个人测试记录。
 */

const API_BASE = '/api'

// 生成 session ID
function getSessionId() {
  let sid = sessionStorage.getItem('gushang_sid')
  if (!sid) {
    sid = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    sessionStorage.setItem('gushang_sid', sid)
  }
  return sid
}

/** 发送事件到后端 API */
async function sendToApi(event, data = {}) {
  try {
    await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: Date.now(),
        sessionId: getSessionId(),
      }),
      // 不阻塞页面卸载
      keepalive: true,
    })
  } catch {
    // 静默失败，不影响用户体验
  }
}

/** 使用 navigator.sendBeacon 发送（更可靠，用于页面卸载时） */
function sendBeacon(event, data = {}) {
  try {
    const blob = new Blob([JSON.stringify({
      event,
      data,
      timestamp: Date.now(),
      sessionId: getSessionId(),
    })], { type: 'application/json' })
    navigator.sendBeacon(`${API_BASE}/track`, blob)
  } catch {
    // 静默失败
  }
}

// ==================== 公开 API ====================

/** 页面浏览 */
export function trackPageView() {
  sendToApi('page_view')
}

/** 测试开始 */
export function trackTestStart() {
  sendToApi('test_start')
}

/** 测试完成 */
export function trackTestComplete(typeCode, typeName, durationSeconds) {
  const data = {
    typeCode,
    typeName,
    duration: Math.round(durationSeconds),
  }
  // 使用 sendBeacon 更可靠（可能在页面跳转时调用）
  sendBeacon('test_complete', data)

  // 同时保存到 localStorage（个人记录）
  saveLocalResult(typeCode, typeName, durationSeconds)
}

// ==================== localStorage 个人记录 ====================

const LOCAL_KEY = 'gushang_results'

function saveLocalResult(typeCode, typeName, durationSeconds) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    existing.push({
      typeCode,
      typeName,
      duration: Math.round(durationSeconds),
      timestamp: Date.now(),
      date: new Date().toISOString(),
    })
    // 只保留最近 20 条
    if (existing.length > 20) existing.splice(0, existing.length - 20)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(existing))
  } catch {
    // 静默失败
  }
}

/** 获取个人测试历史 */
export function getLocalResults() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

/** 获取全局统计数据（从服务端 API） */
export async function fetchGlobalStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`)
    if (!res.ok) throw new Error('Failed to fetch')
    return await res.json()
  } catch {
    return null
  }
}
