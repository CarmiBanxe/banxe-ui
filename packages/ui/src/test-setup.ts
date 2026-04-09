import '@testing-library/jest-dom'
import '@testing-library/react/pure'

// jsdom doesn't implement scrollIntoView — mock it
Element.prototype.scrollIntoView = () => {}
