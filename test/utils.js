import React from 'react/addons';

const {TestUtils} = React.addons;

export function shallowlyRenderedOutput(Component) {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(Component);

  return shallowRenderer.getRenderOutput();
}
