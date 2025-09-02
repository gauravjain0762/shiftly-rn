import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const years = Array.from({length: 2050 - 1975 + 1}, (_, i) => 1975 + i);

const CustomDatePicker = ({label, onChange, dateValue}: any) => {
  const [openPicker, setOpenPicker] = useState<'Month' | 'Year' | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (dateValue) {
      if (label === 'Start Date') {
        setSelectedMonth(dateValue.startDate_month || '');
        setSelectedYear(dateValue.startDate_year || '');
      } else if (label === 'End Date') {
        setSelectedMonth(dateValue.endDate_month || '');
        setSelectedYear(dateValue.endDate_year || '');
      }
    }
  }, [dateValue, label]);

  const flatListRef = useRef<FlatList<any>>(null);

  const Dropdown = ({label, value, onPress}: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.dropdown}
      activeOpacity={0.8}>
      <Text style={value ? styles.inputStyle : styles.placeholderStyle}>
        {value || label}
      </Text>
      <Image
        source={IMAGES.down1}
        style={{width: 12, height: 13, resizeMode: 'contain'}}
      />
    </TouchableOpacity>
  );

  const handleSelect = (item: string | number) => {
    if (openPicker === 'Month') {
      setSelectedMonth(item as string);
      setOpenPicker(null);
      onChange?.({month: item, year: selectedYear});
    } else if (openPicker === 'Year') {
      setSelectedYear(item.toString());
      setOpenPicker(null);
      onChange?.({month: selectedMonth, year: item});
    }
  };

  const getData = () => (openPicker === 'Month' ? months : years);

  useEffect(() => {
    if (openPicker && flatListRef.current) {
      const data = getData();
      let index = -1;

      if (openPicker === 'Month' && selectedMonth) {
        index = months.indexOf(selectedMonth);
      } else if (openPicker === 'Year' && selectedYear) {
        index = years.indexOf(Number(selectedYear));
      }

      if (index >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({index, animated: true});
        }, 100);
      }
    }
  }, [openPicker]);

  return (
    <View style={{flex: 1}}>
      <Text style={styles.label}>{label}</Text>

      <View style={{flexDirection: 'row', alignItems: 'center', gap: wp(16)}}>
        <Dropdown
          label={'Month'}
          value={selectedMonth}
          onPress={() => setOpenPicker('Month')}
        />
        <Dropdown
          label={'Year'}
          value={selectedYear}
          onPress={() => setOpenPicker('Year')}
        />
      </View>

      {/* Modal Picker */}
      <Modal visible={!!openPicker} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <FlatList
              ref={flatListRef}
              data={getData()}
              keyExtractor={(_, i) => i.toString()}
              getItemLayout={(_, index) => ({
                length: 48,
                offset: 48 * index,
                index,
              })}
              renderItem={({item}) => {
                const isSelected =
                  (openPicker === 'Month' && item === selectedMonth) ||
                  (openPicker === 'Year' && item.toString() === selectedYear);

                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.itemSelected]}
                    onPress={() => handleSelect(item)}>
                    <Text
                      style={[
                        styles.itemText,
                        isSelected && styles.itemTextSelected,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setOpenPicker(null)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    paddingHorizontal: wp(16),
    borderRadius: 20,
    height: 59,
    borderWidth: 1.5,
    borderColor: '#225797',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginTop: 20,
    marginBottom: 12,
    ...commonFontStyle(400, 18, '#DADADA'),
  },
  inputStyle: {
    ...commonFontStyle(400, 18, '#F4E2B8'),
    flex: 1,
  },
  placeholderStyle: {
    flex: 1,
    marginHorizontal: wp(3),
    ...commonFontStyle(400, 18, '#969595'),
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '60%',
    padding: 10,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  itemSelected: {
    backgroundColor: '#22579733',
  },
  itemText: {
    ...commonFontStyle(400, 18, '#333'),
    textAlign: 'center',
  },
  itemTextSelected: {
    color: '#225797',
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#225797',
    borderRadius: 8,
  },
  closeText: {
    textAlign: 'center',
    ...commonFontStyle(600, 16, '#fff'),
  },
});
