import { describe, expect, it } from 'vitest'
import viteConfig from '../../vite.config'

describe('deployment config', () => {
  it('uses a relative base path for production builds', async () => {
    const configFactory = viteConfig as (env: { command: 'build'; mode: string }) => { base?: string }
    const config = configFactory({ command: 'build', mode: 'production' })

    expect(config.base).toBe('./')
  })
})