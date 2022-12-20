import {debounce} from 'lodash';
import React, { PureComponent } from 'react'
import { TouchableOpacity } from 'react-native'
const withPreventDoubleClick = (WrappedComponent: any) => {
    class PreventDoubleClick extends PureComponent<{onPress: any, children: any, style: any}> {
        debouncedOnPress = () => {
            this.props.onPress && this.props.onPress();
        }
        onPress = debounce(this.debouncedOnPress, 500, { leading: true, trailing: false });
        render() {
            return <WrappedComponent activeOpacity={0.6} {...this.props} onPress={this.onPress}>{this.props.children}</WrappedComponent>;
        }
    }
    (PreventDoubleClick as any).displayName = `withPreventDoubleClick(${WrappedComponent.displayName || WrappedComponent.name})`
    return PreventDoubleClick;
}
export default withPreventDoubleClick(TouchableOpacity)