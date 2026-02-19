import React from 'react';
import { View, StyleSheet } from 'react-native';
import { hp, wp } from '../../theme/fonts';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const PostGridSkeleton = () => {
    const shimmerColors = ['#E1E9EE', '#F8FAFB', '#E1E9EE'];

    return (
        <View style={styles.gridContainer}>
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                <View key={`post-grid-skeleton-${idx}`} style={styles.card}>
                    <ShimmerPlaceholder
                        style={styles.image}
                        shimmerColors={shimmerColors}
                    />
                    <View style={styles.textContainer}>
                        <ShimmerPlaceholder
                            style={styles.text}
                            shimmerColors={shimmerColors}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: hp(10),
    },
    card: {
        width: '48%',
        marginBottom: hp(10),
        borderRadius: hp(12),
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E6F0',
    },
    image: {
        width: '100%',
        height: hp(140),
    },
    textContainer: {
        padding: hp(10),
        minHeight: hp(45),
        justifyContent: 'center',
    },
    text: {
        width: '80%',
        height: hp(14),
        borderRadius: 4,
    },
});

export default PostGridSkeleton;
