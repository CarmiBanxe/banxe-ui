import '@testing-library/jest-dom'
import '@testing-library/react/pure'

// jsdom doesn't implement scrollIntoView — mock it
Element.prototype.scrollIntoView = () => {}

// recharts (used by Tremor) requires ResizeObserver — mock it in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
