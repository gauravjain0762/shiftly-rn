import React, {FC, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IMAGES} from '../../assets/Images';
import CustomInput from '../common/CustomInput';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CustomDropdownMulti from '../common/CustomDropdownMulti';

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
  skillsList: any[];
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

const AboutMeList: FC<Props> = ({aboutEdit, setAboutEdit, skillsList}: any) => {
  return (
    <View style={styles.containerWrapper}>
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
        value={aboutEdit?.location}
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

      <View>
        <Text style={[styles.headerText, {marginTop: hp(20)}]}>
          Select your skills
        </Text>
        <CustomDropdownMulti
          disable={false}
          data={(skillsList || []).map((skill: any) => ({
            label: skill?.title,
            value: skill?._id,
          }))}
          placeholder={'Select more than one'}
          value={aboutEdit?.selectedSkills}
          selectedStyle={styles.selectedStyle}
          container={styles.multiDropdownContainer}
          onChange={(selectedItems: any) => {
            setAboutEdit({
              ...aboutEdit,
              selectedSkills: selectedItems,
            });
          }}
        />
      </View>

      {aboutEdit?.selectedSkills?.length > 0 && (
        <View style={styles.languageListContainer}>
          {aboutEdit?.selectedSkills?.map((id: string) => {
            const skill = skillsList.find(
              (s: any) => s._id === id || s._id === id?._id,
            );
            return (
              <View key={id} style={styles.languageChip}>
                <Text style={styles.languageChipText}>
                  {skill?.title || id}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <View>
        <Text style={[styles.headerText, {marginTop: 0}]}>
          Select your language
        </Text>
        <CustomDropdownMulti
          disable={false}
          data={languages.map(lang => ({label: lang, value: lang}))}
          placeholder={'Select more than one'}
          value={aboutEdit?.selectedLanguages.map((l: any) => l.name)} // dropdown expects array of strings
          container={styles.multiDropdownContainer}
          selectedStyle={styles.selectedStyle}
          onChange={(selectedItems: string[]) => {
            const updatedLanguages = selectedItems.map(name => {
              // keep level if exists, otherwise empty
              const existing = (aboutEdit?.selectedLanguages || []).find(
                (l: any) => l.name === name,
              );
              return existing || {name, level: ''};
            });

            setAboutEdit({
              ...aboutEdit,
              selectedLanguages: updatedLanguages,
            });
          }}
        />
      </View>

      {aboutEdit?.selectedLanguages?.length > 0 && (
        <>
          {/* Chips */}
          <View style={styles.languageListContainer}>
            {aboutEdit.selectedLanguages.map((lang: any, index: number) => (
              <View key={`${lang.name}-${index}`} style={styles.languageChip}>
                <Text style={styles.languageChipText}>{lang.name}</Text>
              </View>
            ))}
          </View>

          {/* Language proficiency selector */}
          {aboutEdit.selectedLanguages.map((lang: any, index: number) => (
            <View style={styles.row} key={`${lang.name}-${index}`}>
              <Text style={styles.language}>{lang.name}</Text>
              {proficiencyLevels.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.dot,
                    lang.level === level && styles.selectedDot,
                    {backgroundColor: getDotColor(level)},
                  ]}
                  onPress={() => {
                    const updatedLanguages = aboutEdit.selectedLanguages.map(
                      l => (l.name === lang.name ? {...l, level} : l),
                    );

                    setAboutEdit({
                      ...aboutEdit,
                      selectedLanguages: updatedLanguages,
                    });
                  }}
                />
              ))}
            </View>
          ))}
        </>
      )}

      {/* <CustomSwitch isOn={aboutEdit?.open_for_jobs} setIsOn={setAboutEdit}  /> */}
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
    // marginBottom: 20,
  },
  multiDropdownContainer: {
    // marginBottom: 15,
    marginTop: 0,
  },
  headerText: {
    ...commonFontStyle(400, 18, '#DADADA'),
    marginBottom: 8,
  },
  skillsText: {
    marginTop: hp(20),
    ...commonFontStyle(400, 18, '#DADADA'),
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
