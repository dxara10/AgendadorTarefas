import '@testing-library/jest-dom'

// Mock ResizeObserver para os gráficos
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}