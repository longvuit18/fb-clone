import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";


function Skeleton({width, height, style}) {
    const translateX = useRef(new Animated.Value(-width)).current;

    useEffect(()=>{
        Animated.loop(
            Animated.timing(translateX, {
                toValue: width,
                useNativeDriver: true,
                duration: 1000,
            }),
        ).start();
    }, [width]);

    return ( 
        <View
            style={StyleSheet.flatten([
                {width: width, height: height, backgroundColor: "#d7d8d9", overflow: "hidden"},
                style,
            ])}
        >
            <Animated.View
                style={{
                    width: "100%",
                    height: "100%",
                    transform: [{translateX: translateX}],
                }}
            >
                
                <LinearGradient
                    style={{width: "100%", height: "100%"}}
                    colors={["transparent", "rgba(0, 0, 0, 0.1)", "transparent"]}
                    start={{x: 1, y: 1}}
                >
                    
                </LinearGradient>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
});

export default Skeleton;