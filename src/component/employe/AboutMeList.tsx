import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import CustomInput from '../common/CustomInput';
import GradientButton from '../common/GradientButton';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CustomDropdownMulti from '../common/CustomDropdownMulti';
import CustomSwitch from '../common/CustomSwitch';

type MessageItem = {
  id: string;
  logo: string;
  title: string;
  sender: string;
  preview: string;
  date: string;
  unreadCount?: number;
};

const languages = [
  'English',
  'French',
  'Arabic',
  'Spanish',
  'German',
  'Italian',
  'Russian',
  'Urdu',
  'Hindi',
  'Turkish',
  'Chinese',
  'Japanese',
];

type Props = {
  aboutEdit: any;
  experienceList: any;
  item: MessageItem[];
  setAboutEdit: any;
  onNextPress: () => void;
  onPressMessage: (item: MessageItem) => void;
};

const getDotColor = (level: string) => {
  switch (level) {
    case 'Native':
      return '#F4E2B8';
    case 'Fluent':
      return '#CBC194';
    case 'Intermediate':
      return '#7390B1';
    case 'Basic':
      return '#024AA1';
    default:
      return '#999';
  }
};

const proficiencyLevels = ['Native', 'Fluent', 'Intermediate', 'Basic'];

const AboutMeList: FC<Props> = ({
  aboutEdit,
  setAboutEdit,
  onNextPress,
  experienceList,
}: any) => {
  return (
    <View style={styles.containerWrapper}>
      {/* <Text style={styles.headerTitle}>{experienceList[0]?.title}</Text> */}

      <View style={styles.optionWrapper}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => {
            setAboutEdit({...aboutEdit, open_for_jobs: true});
          }}>
          <View
            style={[
              styles.iconContainer,
              {
                borderColor:
                  aboutEdit?.open_for_jobs === true
                    ? colors.coPrimary
                    : colors._104686,
              },
            ]}>
            <Image source={IMAGES.check} style={styles.checkIcon} />
          </View>
          <Text style={styles.iconWrapperText}>
            Yes, I’m open to better opportunities
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => {
            setAboutEdit({...aboutEdit, open_for_jobs: false});
          }}>
          <View
            style={[
              styles.iconContainer,
              {
                borderColor:
                  aboutEdit?.open_for_jobs === false
                    ? colors.coPrimary
                    : colors._104686,
              },
            ]}>
            <Image source={IMAGES.close} style={styles.closeIcon} />
          </View>
          <Text style={styles.iconWrapperText}>
            No, I’m not currently looking
          </Text>
        </TouchableOpacity>
      </View>

      <CustomInput
        label="Location"
        placeholder={'Enter Location'}
        value={aboutEdit.location}
        onChange={(text: any) => {
          setAboutEdit({...aboutEdit, location: text});
        }}
      />

      <CustomInput
        label="Key Responsibilities"
        placeholder={'Enter Key Responsibilities'}
        value={aboutEdit.responsibilities}
        onChange={(text: any) =>
          setAboutEdit({...aboutEdit, responsibilities: text})
        }
      />

      <Text style={styles.headerText}>Select your language</Text>

      <CustomDropdownMulti
        disable={false}
        data={languages.map(lang => ({label: lang, value: lang}))}
        placeholder={'Select more than one'}
        value={aboutEdit?.selectedLanguages}
        container={styles.multiDropdownContainer}
        selectedStyle={styles.selectedStyle}
        onChange={(selectedItems: any) => {
          setAboutEdit({
            ...aboutEdit,
            selectedLanguages: selectedItems,
          });
        }}
      />

      {!!aboutEdit.selectedLanguages?.length && (
        <View style={styles.languageListContainer}>
          {aboutEdit.selectedLanguages.map((name: string) => (
            <View key={name} style={styles.languageChip}>
              <Text style={styles.languageChipText}>{name}</Text>
            </View>
          ))}
        </View>
      )}

      {aboutEdit.selectedLanguages.map((lang: any) => (
        <View style={styles.row} key={lang}>
          <Text style={styles.language}>{lang}</Text>
          {proficiencyLevels.map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.dot,
                aboutEdit.proficiency[lang] === level && styles.selectedDot,
                {backgroundColor: getDotColor(level)},
              ]}
              onPress={() => {
                setAboutEdit({
                  ...aboutEdit,
                  proficiency: {
                    ...aboutEdit.proficiency,
                    [lang]: level,
                  },
                });
              }}
            />
          ))}
        </View>
      ))}

      {/* <CustomSwitch isOn={aboutEdit?.open_for_jobs} setIsOn={setAboutEdit}  /> */}

      <GradientButton
        style={styles.btn}
        title={'Update'}
        onPress={onNextPress}
      />
    </View>
  );
};

export default AboutMeList;

const styles = StyleSheet.create({
  containerWrapper: {
    marginTop: hp(16),
    paddingHorizontal: 29,
  },
  headerTitle: {
    ...commonFontStyle(700, 18, '#F4E2B8'),
    marginTop: hp(15),
    marginBottom: hp(12),
  },
  optionWrapper: {
    gap: 11,
    borderBottomWidth: 1,
    paddingBottom: 28,
    borderBottomColor: '#FFF8E6',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: wp(40),
    height: hp(40),
    borderWidth: hp(1.5),
    borderRadius: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 18,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors._F4E2B8,
  },
  closeIcon: {
    width: 15,
    height: 13,
    resizeMode: 'contain',
    tintColor: colors._F4E2B8,
  },
  iconWrapperText: {
    ...commonFontStyle(400, 18, '#DADADA'),
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  multiDropdownContainer: {
    // marginBottom: 15,
  },
  headerText: {
    ...commonFontStyle(400, 18, '#DADADA'),
    marginBottom: 8,
    marginTop: 20,
  },
  subTitle: {
    ...commonFontStyle(700, 18, '#F4E2B8'),
    marginBottom: 10,
    marginTop: 20,
  },
  selectedStyle: {
    height: 0,
    opacity: 0,
    padding: 0,
    margin: 0,
  },
  placeholderStyle: {
    ...commonFontStyle(400, 18, '#F4E2B8'),
  },
  languageListContainer: {
    gap: wp(4),
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: hp(5),
  },
  languageChip: {
    borderWidth: 1,
    borderColor: '#FBE7BD',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  languageChipText: {
    ...commonFontStyle(400, 14, '#F4E2B8'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    marginBottom: 12,
  },
  language: {
    ...commonFontStyle(400, 18, '#DADADA'),
    flex: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 24,
    marginHorizontal: 16,
  },
  selectedDot: {
    borderWidth: 2,
    borderColor: 'white',
  },
  legend: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendText: {
    ...commonFontStyle(400, 13, '#DADADA'),
    marginTop: 6,
  },
  btn: {
    marginHorizontal: wp(4),
    marginTop: 40,
  },
});
