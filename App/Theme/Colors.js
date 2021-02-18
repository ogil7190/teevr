export const percentToHex = ( p ) => {
  const intValue = Math.round( ( p / 100 ) * 255 ); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString( 16 ); // get hexadecimal representation
  return hexValue.padStart( 2, '0' ).toUpperCase(); // format with leading 0 and upper case characters
};

export const ColorHelpers = {
  applyAlpha: ( color, alpha ) => {
    const hex = percentToHex( 1 < alpha ? alpha : alpha * 100 )
    if( color.length > 7 ) {
      return `${color.substring(0, 7)}${hex}`
    } else {
      return `${color}${hex}`
    }
  }
};

export const Colors = {
  transparent: ColorHelpers.applyAlpha( '#000000', 0 ),
  primary: '#3950a2',
  lightBlack: '#494949',
  grey: '#a5a5a5',
  lightGrey: '#e4e4e4',
  themeWhite: '#f0f0f3',
  accent: '#f5377d',
  black: '#000000',
  white: '#ffffff',
};
