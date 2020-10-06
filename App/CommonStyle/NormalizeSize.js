import {
    Dimensions
} from 'react-native';

const base_unit_height = 592;
const base_unit_width = 360;

const { width, height } = Dimensions.get('window');

class NormalizeSize {
    constructor() {
        this.normalize = this.normalize.bind(this)
    }

    normalize(size) {
        return (size / base_unit_height) * height
    }
}

module.exports = new NormalizeSize()
