import React from "react";
import {
    
    
    Text,TouchableOpacity,
View,
StyleSheet,
Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Btn({ bgColor, btnLabel, textColor, press }) {
return (
 <TouchableOpacity
onPress={press}
style={[styles.button, { backgroundColor: bgColor }]}
 >
<Text style={[styles.label, { color: textColor }]}>{btnLabel}</Text>
</TouchableOpacity>
 );
}

const styles = StyleSheet.create({
 button: {
borderRadius: 10,
alignItems: "center",
paddingVertical: height * 0.015,
paddingHorizontal: width * 0.05,
marginVertical: height * 0.015,
},
label: {
fontSize: width * 0.035,
 fontFamily: "Roboto",
},
});

