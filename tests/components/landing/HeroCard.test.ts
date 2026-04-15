// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroCard from '../../../src/components/landing/HeroCard.vue'

describe('HeroCard', () => {
  it('renders the repository link in the footer area', () => {
    const wrapper = mount(HeroCard, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    const actions = wrapper.get('.hero-actions')
    const repoLink = wrapper.get('a[href="https://github.com/ColdeZhang/CLTI"]')

    expect(actions.classes()).toContain('hero-actions')
    expect(repoLink.text()).toBe('查看仓库 / GitHub')
    expect(actions.find('.hero-btn').exists()).toBe(true)
    expect(actions.find('.hero-repo-link').exists()).toBe(true)
  })
})
