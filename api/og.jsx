/**
 * Vercel OG Image API — 动态生成社交媒体分享卡片
 *
 * GET /api/og
 * 返回 1200×630 PNG，用于微信/小红书/微博等平台的链接预览。
 */

import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url)
    const typeCode = searchParams.get('type') || ''
    const typeName = searchParams.get('name') || ''

    // 加载字体
    const fontData = await fetch(
      'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_EnYxNbPzS5HE.woff'
    ).then((res) => res.arrayBuffer())

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            fontFamily: '"Noto Sans SC", sans-serif',
            color: 'white',
            padding: 60,
          }}
        >
          {/* Background decorations */}
          <div style={{ position: 'absolute', top: 30, left: 60, fontSize: 48, opacity: 0.15 }}>📈</div>
          <div style={{ position: 'absolute', top: 30, right: 60, fontSize: 48, opacity: 0.15 }}>📉</div>
          <div style={{ position: 'absolute', bottom: 30, left: 60, fontSize: 36, opacity: 0.1 }}>🐂</div>
          <div style={{ position: 'absolute', bottom: 30, right: 60, fontSize: 36, opacity: 0.1 }}>🐻</div>

          {/* Main title */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              marginBottom: 16,
              background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            股商测试 MBTI
          </h1>

          <p
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#F8FAFC',
              marginBottom: 40,
            }}
          >
            测测你的投资人格
          </p>

          {/* Feature tags */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
            {[
              { emoji: '🧠', text: '独立↔跟风', color: '#F59E0B' },
              { emoji: '📊', text: '技术↔价值', color: '#3B82F6' },
              { emoji: '⚔️', text: '纪律↔情绪', color: '#EF4444' },
              { emoji: '⚡', text: '短线↔长期', color: '#10B981' },
            ].map((tag) => (
              <div
                key={tag.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  borderRadius: 20,
                  border: `1.5px solid ${tag.color}40`,
                  fontSize: 16,
                  color: tag.color,
                }}
              >
                {tag.emoji} {tag.text}
              </div>
            ))}
          </div>

          {/* Type-specific result (if type/name provided) */}
          {typeCode && typeName ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
              <p style={{ fontSize: 18, color: '#64748B', marginBottom: 8 }}>我的投资人格是</p>
              <p style={{ fontSize: 48, fontWeight: 900, color: '#F59E0B' }}>{typeName}</p>
              <p style={{ fontSize: 20, color: '#475569', marginTop: 4 }}>{typeCode}</p>
            </div>
          ) : (
            <p style={{ fontSize: 22, color: '#64748B', marginBottom: 30 }}>
              看看你是「巴菲特分特」还是「韭菜特种兵」？
            </p>
          )}

          {/* Bottom bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#475569', fontSize: 16 }}>
            <span>4大维度</span>
            <span>·</span>
            <span>16型人格</span>
            <span>·</span>
            <span>24道高能题目</span>
            <span>·</span>
            <span>大约3-5分钟</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans SC',
            data: fontData,
            style: 'normal',
            weight: 900,
          },
        ],
      }
    )
  } catch (e) {
    console.error('[OG Error]', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
