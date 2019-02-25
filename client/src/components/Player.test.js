import React from 'react';
import { shallow, mount } from 'enzyme';
import Player from './Player';

describe('Player', () => {
  it('should render correctly', () => {
    const component = shallow(<Player />);
    expect(component).toMatchSnapshot();
  });

  it('should render metaData', () => {
    const wrap = mount(<Player />);
    wrap.update();
    expect(wrap).toMatchSnapshot();
    wrap.unmount();
  });
});

