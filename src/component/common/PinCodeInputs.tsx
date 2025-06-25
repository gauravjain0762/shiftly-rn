// PinCodeInputs.tsx
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

interface Props {
  onPinChange?: (pin: string) => void;
}

const PIN_LENGTH = 8;

const PinCodeInputs: React.FC<Props> = ({onPinChange}) => {
  const [values, setValues] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (onPinChange) {
      onPinChange(values.join(''));
    }
  }, [values]);

  const handleChange = (text: string, index: number) => {
    if (!/^[0-9]$/.test(text)) return;
    const updated = [...values];
    updated[index] = text;
    setValues(updated);
    if (index < PIN_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      const updated = [...values];
      console.log('>>>>>>>', updated, index);
      if (updated[index]) {
        updated[index] = '';
        setValues(updated);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({length: PIN_LENGTH}).map((_, i) => (
        <View key={i} style={styles.cell}>
          <Text style={styles.asterisk}>{values[i] ? '＊' : ' '}</Text>
          <TextInput
            ref={ref => (inputs.current[i] = ref)}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={values[i]}
            onChangeText={text => handleChange(text, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            autoFocus={i === 0}
          />
          <View style={styles.underline} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 100,
  },
  cell: {
    alignItems: 'center',
  },
  asterisk: {
    fontSize: 24,
    color: '#F4E2B8',
    marginBottom: 4,
  },
  input: {
    position: 'absolute',
    opacity: 0,
    width: 30,
    height: 40,
  },
  underline: {
    width: 20,
    height: 2,
    backgroundColor: '#F4E2B8',
  },
});

export default PinCodeInputs;
