import React from 'react';
import { shallow } from 'enzyme';
import Player from './Player';

describe('Player', () => {
  it('should render correctly', () => {
    const component = shallow(<Player />);

    expect(component).toMatchSnapshot();
  });
});