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
import {errorToast} from '../../utils/commonFunction';

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

type DateProps = {
  type: 'Education' | 'Experience';
  label: string;
  dateValue: any;
  onChange: (date: any) => void;
};

const CustomDatePicker = ({label, onChange, dateValue, type}: DateProps) => {
  const [openPicker, setOpenPicker] = useState<'Month' | 'Year' | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (dateValue) {
      if (type === 'Experience') {
        if (label === 'Start Date') {
          setSelectedMonth(dateValue.jobStart_month || '');
          setSelectedYear(dateValue.jobStart_year || '');
        } else if (label === 'End Date') {
          setSelectedMonth(dateValue.jobEnd_month || '');
          setSelectedYear(dateValue.jobEnd_year || '');
        }
      } else {
        if (label === 'Start Date') {
          setSelectedMonth(dateValue.startDate_month || '');
          setSelectedYear(dateValue.startDate_year || '');
        } else if (label === 'End Date') {
          setSelectedMonth(dateValue.endDate_month || '');
          setSelectedYear(dateValue.endDate_year || '');
        }
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
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (openPicker === 'Month') {
      newMonth = item as string;
      setSelectedMonth(newMonth);
    } else if (openPicker === 'Year') {
      newYear = item.toString();
      setSelectedYear(newYear);
    }

    // ✅ Validation for End Date
    if (type === 'Experience' || type === 'Education') {
      if (label === 'End Date') {
        const startMonth =
          type === 'Experience'
            ? dateValue?.jobStart_month
            : dateValue?.startDate_month;
        const startYear =
          type === 'Experience'
            ? dateValue?.jobStart_year
            : dateValue?.startDate_year;

        if (startYear && newYear) {
          const start = new Date(
            Number(startYear),
            months.indexOf(startMonth || 'January'),
          );
          const end = new Date(
            Number(newYear),
            months.indexOf(newMonth || 'January'),
          );

          if (end < start) {
            errorToast('End Date cannot be earlier than Start Date');
            return;
          }
        }
      }
    }

    setOpenPicker(null);
    onChange?.({month: newMonth, year: newYear});
  };

  // ✅ Filter years for End Date to prevent selecting years less than start year
  const getFilteredYears = () => {
    if (
      label === 'End Date' &&
      (type === 'Education' || type === 'Experience')
    ) {
      const startYear =
        type === 'Experience'
          ? dateValue?.jobStart_year
          : dateValue?.startDate_year;

      if (startYear) {
        return years.filter(year => year >= Number(startYear));
      }
    }
    return years;
  };

  // ✅ Filter months for End Date in the same year as start date
  const getFilteredMonths = () => {
    if (
      label === 'End Date' &&
      (type === 'Education' || type === 'Experience')
    ) {
      const startMonth =
        type === 'Experience'
          ? dateValue?.jobStart_month
          : dateValue?.startDate_month;
      const startYear =
        type === 'Experience'
          ? dateValue?.jobStart_year
          : dateValue?.startDate_year;

      // If end year is same as start year, filter months
      if (
        startYear &&
        selectedYear &&
        Number(selectedYear) === Number(startYear) &&
        startMonth
      ) {
        const startMonthIndex = months.indexOf(startMonth);
        return months.slice(startMonthIndex);
      }
    }
    return months;
  };

  const getData = () => {
    if (openPicker === 'Month') {
      return getFilteredMonths();
    } else if (openPicker === 'Year') {
      return getFilteredYears();
    }
    return [];
  };

  useEffect(() => {
    if (openPicker && flatListRef.current) {
      const data = getData();
      let index = -1;

      if (openPicker === 'Month' && selectedMonth) {
        index = data.indexOf(selectedMonth);
      } else if (openPicker === 'Year' && selectedYear) {
        index = data.indexOf(Number(selectedYear));
      }

      if (index >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({index, animated: true});
        }, 100);
      }
    }
  }, [openPicker, selectedYear]); // Added selectedYear dependency

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
