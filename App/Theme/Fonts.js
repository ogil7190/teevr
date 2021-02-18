import { Dimensions, Platform, PixelRatio } from 'react-native';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  fontScale
} = Dimensions.get('window');

const WIDTH_FACTOR_IOS = 414;
const HEIGHT_FACTOR_IOS = 896;

const WIDTH_FACTOR_ANDROID = 412;
const HEIGHT_FACTOR_ANDROID = 790;

const scaleWidth = SCREEN_WIDTH / ( Platform.OS === 'ios' ? WIDTH_FACTOR_IOS : WIDTH_FACTOR_ANDROID );
const scaleHeight = SCREEN_HEIGHT / ( Platform.OS === 'ios' ? HEIGHT_FACTOR_IOS : HEIGHT_FACTOR_ANDROID );

export const normalizeFont = (size) => {
  const newSize = size * scaleWidth
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const normalizeWidth = ( width ) => {
  const newSize = scaleWidth * width;
  return newSize;
  // return normalizeHeight(width);
}

export const normalizeHeight = ( height ) =>{
  // const newSize = scaleHeight *  height;
  // console.log( height, newSize );
  // return newSize;
  return normalizeWidth(height);
}

export const nh = ( height ) => normalizeHeight( height );
export const nw = ( width ) => normalizeWidth( width );

export const calc = ( operation, forHeight = false ) => {
  const factor = operation.indexOf('-') !== -1 ? -1 : 1;
  const values = operation.split(/[x^+-]/);
  let val = 0;
  values.forEach( ( value ) => {
    if( value.indexOf('%') !== -1 ){
      	val = val + parseFloat( value ) / 100 * ( forHeight ? SCREEN_HEIGHT : SCREEN_WIDTH );
    } else {
      	val = val + ( factor * parseFloat( value ) );
    }
  });
  return val;
}

const FONT_SIZE_10 = normalizeFont(10);
const FONT_SIZE_11 = normalizeFont(11);
const FONT_SIZE_12 = normalizeFont(12);
const FONT_SIZE_14 = normalizeFont(14);
const FONT_SIZE_15 = normalizeFont(15);
const FONT_SIZE_16 = normalizeFont(16);
const FONT_SIZE_18 = normalizeFont(18);
const FONT_SIZE_20 = normalizeFont(20);
const FONT_SIZE_50 = normalizeFont(50);

const FONT_TYPE_PUBLIC_SANS_THIN = 'PublicSans-Thin';
const FONT_TYPE_PUBLIC_SANS_LIGHT = 'PublicSans-Light';
const FONT_TYPE_PUBLIC_SANS_REGULAR = 'PublicSans-Regular';
const FONT_TYPE_PUBLIC_SANS_MEDIUM = 'PublicSans-Medium';
const FONT_TYPE_PUBLIC_SANS_BOLD = 'PublicSans-Bold';
const FONT_TYPE_PUBLIC_SANS_BLACK = 'PublicSans-Black';

export const Fonts = {
  FONT_SIZE_10,
  FONT_SIZE_11,
	FONT_SIZE_12,
	FONT_SIZE_14,
	FONT_SIZE_15,
	FONT_SIZE_16,
	FONT_SIZE_18,
	FONT_SIZE_20,
	FONT_SIZE_50,
	
	FONT_TYPE_PUBLIC_SANS_THIN,
	FONT_TYPE_PUBLIC_SANS_LIGHT,
	FONT_TYPE_PUBLIC_SANS_REGULAR,
	FONT_TYPE_PUBLIC_SANS_MEDIUM,
	FONT_TYPE_PUBLIC_SANS_BOLD,
	FONT_TYPE_PUBLIC_SANS_BLACK
}

export const Screen = {
  	SCREEN_HEIGHT,
  	SCREEN_WIDTH
};