import { Dimensions } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
export const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);
export const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);
export const STATUSBAR_HEIGHT = getStatusBarHeight()
export const BASE_URL = 'http://184.169.213.180:3000/it4788'