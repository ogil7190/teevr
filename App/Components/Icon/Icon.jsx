import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Icons } from 'App/Constants';
import { PropTypes } from 'prop-types';
import { Colors } from 'Theme/Colors';
import { normalizeHeight, normalizeWidth } from 'Theme/Fonts';

export const Icon = (props) => {
  const width = normalizeWidth( props.width );
  const height = normalizeHeight( props.height );

  return <SvgXml {...props} xml={Icons[props.name]} width={width} height={height} />;
};

Icon.propTypes = {
  viewBox: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  name: PropTypes.string,
};

Icon.defaultProps = {
  fill: Colors.lightBlack,
  stroke: null,
  fillRule: null,
  height: 30,
  width: 30
};
