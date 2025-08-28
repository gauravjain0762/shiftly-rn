import React, {useState, useCallback} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {colors} from '../../theme/colors';

interface ImageWithLoaderProps {
  source: {uri: string} | any;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  loaderSize?: 'small' | 'large';
  loaderColor?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  placeholder?: React.ReactNode;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  source,
  style,
  containerStyle,
  loaderSize = 'small',
  loaderColor = colors._0B3970,
  resizeMode = 'cover',
  placeholder,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  const handleLoadStart = useCallback(() => {
    console.log('🔄 ImageWithLoader: Load started');
    setIsLoading(true);
    setHasStartedLoading(true);
    setHasError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    console.log('✅ ImageWithLoader: Load ended');
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    console.log('❌ ImageWithLoader: Load error');
    setIsLoading(false);
    setHasError(true);
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasStartedLoading) {
        console.log('⏰ ImageWithLoader: Auto-hiding loader (no load events)');
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [hasStartedLoading]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={source}
        style={[style, hasError && styles.errorImage]}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />

      {isLoading && (
        <View style={[styles.loaderContainer, style]}>
          {placeholder || (
            <ActivityIndicator size={loaderSize} color={loaderColor} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorImage: {
    opacity: 0.3,
  },
});

export default ImageWithLoader;
