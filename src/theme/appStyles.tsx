import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { hp } from "./fonts";

export const AppStyles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    side:{
        paddingHorizontal:20
    },
    mainSide:{
        marginHorizontal:20
    },
    mainWhiteContainer: {
        flex: 1,
        backgroundColor: colors.white
    },
})