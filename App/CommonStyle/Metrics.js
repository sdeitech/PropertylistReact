import {
    Dimensions,
    Platform
} from 'react-native';

import NormalizeSize from './NormalizeSize'

const { width, height } = Dimensions.get('window');

const metrics = {
    cardHeight: NormalizeSize.normalize(380),
    cardImageHeight: NormalizeSize.normalize(150),
    cardSubViewHeight: NormalizeSize.normalize(20)


}

export default metrics;
