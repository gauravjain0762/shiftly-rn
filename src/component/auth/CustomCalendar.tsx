import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import moment from 'moment';
import {IMAGES} from '../../assets/Images'; // Use correct image icons for arrow
import {colors} from '../../theme/colors'; // Ensure `colors.white` is defined

const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            setCurrentMonth(prev => moment(prev).subtract(1, 'months'))
          }>
          <Image
            source={IMAGES.arrowLeft}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentMonth.format('MMMM, YYYY')}
        </Text>
        <TouchableOpacity
          onPress={() =>
            setCurrentMonth(prev => moment(prev).add(1, 'months'))
          }>
          <Image
            source={IMAGES.arrowRight}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekDays = () => {
    const days = moment.weekdaysShort();
    return (
      <View style={styles.weekRow}>
        {days.map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const generateCalendar = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const days = [];
    const date = startDate.clone();

    while (date.isBefore(endDate, 'day')) {
      days.push(date.clone());
      date.add(1, 'day');
    }

    return days;
  };

  const renderDateCell = (day: moment.Moment) => {
    const isSelected = selectedDate.isSame(day, 'day');
    const isCurrentMonth = day.isSame(currentMonth, 'month');

    const circleStyle = isSelected
      ? styles.selectedCircle
      : isCurrentMonth
      ? null
      : styles.outsideMonth;

    const textStyle = [
      styles.dateText,
      !isCurrentMonth && styles.outsideText,
      isSelected && styles.selectedText,
    ];

    return (
      <TouchableOpacity
        key={day.toString()}
        style={styles.dateCell}
        onPress={() => setSelectedDate(day)}
        disabled={!isCurrentMonth}>
        <View style={circleStyle}>
          <Text style={textStyle}>{day.date()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarBox}>
        {renderHeader()}
        {renderWeekDays()}
        <View style={styles.datesGrid}>
          {generateCalendar().map(day => renderDateCell(day))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#03386E',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  calendarBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
    resizeMode: 'contain',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    height: 40,
  },
  selectedCircle: {
    backgroundColor: '#F6E2B8',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outsideMonth: {
    opacity: 0.4,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  outsideText: {
    color: '#ccc',
  },
});

export default CustomCalendar;
