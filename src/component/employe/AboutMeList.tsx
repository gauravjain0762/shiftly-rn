import React, { FC, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../theme/colors';
import { IMAGES } from '../../assets/Images';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import CustomDropdownMulti from '../common/CustomDropdownMulti';
import Tooltip from '../common/Tooltip';
import { navigateTo } from '../../utils/commonFunction';
import { SCREENS } from '../../navigation/screenNames';

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
      return colors._0B3970;
    case 'Fluent':
      return colors._4A4A4A;
    case 'Conversational':
      return colors._7B7878;
    case 'Basic':
      return colors._D9D9D9;
    default:
      return '#999';
  }
};

const proficiencyLevels = ['Basic', 'Conversational', 'Fluent', 'Native'];

const proficiencyLabels: { [key: string]: string } = {
  'Basic': 'Basic',
  'Conversational': 'Conversational',
  'Fluent': 'Fluent',
  'Native': 'Native',
};

const AboutMeList: FC<Props> = ({ aboutEdit, setAboutEdit, skillsList }: any) => {
  const [pressedDot, setPressedDot] = useState<{ langName: string; level: string } | null>(null);

  return (
    <View style={[styles.containerWrapper, { overflow: 'visible' }]}>
      <View style={styles.optionWrapper}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => {
            setAboutEdit({ ...aboutEdit, open_for_jobs: true });
          }}>
          <View
            style={[
              styles.iconContainer,
              {
                borderWidth:
                  aboutEdit?.open_for_jobs === true ? hp(1.5) : 0,
                borderColor:
                  aboutEdit?.open_for_jobs === true
                    ? colors._0B3970
                    : 'transparent',
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
            setAboutEdit({ ...aboutEdit, open_for_jobs: false });
          }}>
          <View
            style={[
              styles.iconContainer,
              {
                borderWidth:
                  aboutEdit?.open_for_jobs === false ? hp(1.5) : 0,
                borderColor:
                  aboutEdit?.open_for_jobs === false
                    ? colors._0B3970
                    : 'transparent',
              },
            ]}>
            <Image source={IMAGES.close} style={styles.closeIcon} />
          </View>
          <Text style={styles.iconWrapperText}>
            No, I’m not currently looking
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ overflow: 'visible' }}>
        <View style={[styles.fieldHeader, { overflow: 'visible' }]}>
          <Text style={styles.fieldLabel}>Location</Text>
          <Tooltip
            message="Choose your current location. This helps us match you with nearby employers."
            position="bottom"
            containerStyle={styles.tooltipIcon}
            tooltipBoxStyle={{
              left: wp(-29),
              top: hp(28),
              width: wp(280),
              maxWidth: wp(280),
              zIndex: 1000
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log('📍 Navigating to location screen');
            navigateTo(SCREENS.EmpLocation);
          }}
          style={styles.locationInputContainer}
          activeOpacity={0.7}>
          <Text
            style={aboutEdit?.location ? styles.locationText : styles.locationPlaceholder}
            numberOfLines={2}>
            {aboutEdit?.location || 'Select your location'}
          </Text>
          <Image
            source={IMAGES.rightArrow}
            style={styles.arrowIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* <CustomInput
        label="Key Responsibilities"
        placeholder={'Enter Key Responsibilities'}
        value={aboutEdit.responsibilities}
        onChange={(text: any) =>
          setAboutEdit({ ...aboutEdit, responsibilities: text })
        }
      /> */}

      <View>
        <Text style={[styles.headerText, { marginTop: hp(20) }]}>
          Select your skills
        </Text>
        <CustomDropdownMulti
          disable={false}
          data={(skillsList || []).map((skill: any) => ({
            label: skill?.title,
            value: skill?._id,
          }))}
          placeholder={'Add your skills'}
          value={aboutEdit?.selectedSkills}
          selectedStyle={styles.selectedStyle}
          dropdownStyle={{
            marginBottom: hp(6),
          }}
          container={styles.multiDropdownContainer}
          hideSelectedItems
          onChange={(selectedItems: any) => {
            setAboutEdit({
              ...aboutEdit,
              selectedSkills: selectedItems,
            });
          }}
        />
        {aboutEdit?.selectedSkills?.length > 0 && (
          <View style={[styles.languageListContainer, styles.skillsListContainer]}>
            {aboutEdit?.selectedSkills?.map((id: any) => {
              const skill = skillsList?.find(
                (s: any) => s._id === id || s._id === id?._id,
              );
              return (
                <View key={id} style={styles.languageChip}>
                  <Text style={[styles.languageChipText, { fontSize: 16 }]}>
                    {skill?.title || id}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={{ marginTop: hp(0), overflow: 'visible', zIndex: 1 }}>
        <View style={[styles.fieldHeader, { overflow: 'visible' }]}>
          <Text style={styles.fieldLabel}>Select your language</Text>
          <Tooltip
            message="Choose all languages you can work in. Add your proficiency level (Basic / Fluent / Native)."
            position="bottom"
            containerStyle={styles.tooltipIcon}
            tooltipBoxStyle={{ left: '-250%', top: hp(28), width: wp(280), maxWidth: wp(280), zIndex: 1000 }}
          />
        </View>
        <CustomDropdownMulti
          disable={false}
          dropdownPosition="auto"
          data={languages.map(lang => ({ label: lang, value: lang }))}
          placeholder={'Add your languages'}
          value={aboutEdit?.selectedLanguages.map((l: any) => l.name)}
          container={[styles.multiDropdownContainer, { overflow: 'visible', marginBottom: hp(15) }]}
          selectedStyle={styles.selectedStyle}
          hideSelectedItems
          onChange={(selectedItems: string[]) => {
            const updatedLanguages = selectedItems.map(name => {
              const existing = (aboutEdit?.selectedLanguages || []).find(
                (l: any) => l.name === name,
              );
              return existing || { name, level: '' };
            });

            setAboutEdit({
              ...aboutEdit,
              selectedLanguages: updatedLanguages,
            });
          }}
        />
      </View>

      {aboutEdit?.selectedLanguages?.length > 0 && (
        <View style={styles.languageListContainer}>
          {aboutEdit.selectedLanguages.map((lang: any, index: number) => (
            <View key={`${lang.name}-${index}`} style={styles.languageChipWithDots}>
              <View style={styles.languageRow}>
                <Text style={[styles.languageName, { fontSize: 16 }]}>{lang.name}</Text>
                <View style={styles.dotsContainer}>
                  {proficiencyLevels.map(level => {
                    const isSelected = lang.level === level;
                    return (
                      <TouchableOpacity
                        key={level}
                        onPress={() => {
                          const updatedLanguages = [...aboutEdit.selectedLanguages];
                          updatedLanguages[index] = { ...updatedLanguages[index], level: level };
                          setAboutEdit({
                            ...aboutEdit,
                            selectedLanguages: updatedLanguages,
                          });
                          setPressedDot({ langName: lang.name, level });
                          setTimeout(() => setPressedDot(null), 2000);
                        }}
                        style={[
                          styles.dotWrapper,
                          isSelected && {
                            borderWidth: 2,
                            borderColor: getDotColor(level),
                            borderRadius: 16, // Increased radius to half of 32
                            width: 32, // Increased size
                            height: 32, // Increased size
                            justifyContent: 'center',
                            alignItems: 'center',
                          }
                        ]}
                      >
                        <View
                          style={[
                            styles.dot,
                            { backgroundColor: getDotColor(level) },
                          ]}
                        />
                        {pressedDot?.langName === lang.name && pressedDot?.level === level && (
                          <View style={styles.dotLabelContainer}>
                            <Text style={styles.dotLabel} numberOfLines={1}>
                              {proficiencyLabels[level]}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* <CustomSwitch isOn={aboutEdit?.open_for_jobs} setIsOn={setAboutEdit}  /> */}
    </View>
  );
};

export default AboutMeList;

const styles = StyleSheet.create({
  containerWrapper: {
    marginTop: hp(16),
    overflow: 'visible',
    paddingHorizontal: 29,
    paddingBottom: hp(20)
  },
  headerTitle: {
    ...commonFontStyle(700, 18, colors._0B3970),
    marginTop: hp(15),
    marginBottom: hp(12),
  },
  optionWrapper: {
    gap: 11,
    borderBottomWidth: 1,
    paddingBottom: 28,
    borderBottomColor: '#E6E6E6',
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
    borderRadius: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 18,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  closeIcon: {
    width: 15,
    height: 13,
    resizeMode: 'contain',
    tintColor: colors._0B3970,
  },
  iconWrapperText: {
    ...commonFontStyle(400, 18, colors._050505),
  },
  dropdownContainer: {
    // marginBottom: 20,
  },
  multiDropdownContainer: {
    marginTop: hp(5),
    marginBottom: 0,
  },
  headerText: {
    marginBottom: 8,
    ...commonFontStyle(600, 18, colors._050505),
  },
  skillsText: {
    marginTop: hp(20),
    ...commonFontStyle(400, 18, colors._050505),
  },
  selectedStyle: {
    height: 0,
    opacity: 0,
    padding: 0,
    margin: 0,
  },
  placeholderStyle: {
    ...commonFontStyle(400, 18, colors._0B3970),
  },
  languageListContainer: {
    gap: wp(4),
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: hp(0),
    marginBottom: 0,
  },
  skillsListContainer: {
    marginTop: hp(8),
  },
  languageChip: {
    borderWidth: 1,
    borderColor: '#E0D7C8',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  languageChipWithDots: {
    borderWidth: 1,
    borderColor: '#E0D7C8',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    marginRight: wp(6),
    marginBottom: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  languageChipText: {
    ...commonFontStyle(400, 14, colors._0B3970),
  },
  separator: {
    ...commonFontStyle(400, 14, colors._050505),
    marginHorizontal: wp(4),
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  proficiencyRowContainer: {
    marginBottom: hp(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    marginBottom: 12,
  },
  language: {
    ...commonFontStyle(400, 18, colors._050505),
    flex: 1,
  },
  dotContainer: {
    position: 'relative',
    marginHorizontal: 8,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  selectedDot: {
    borderWidth: 2,
    borderColor: 'white',
  },
  dotLabelContainer: {
    position: 'absolute',
    bottom: hp(32),
    backgroundColor: colors._0B3970,
    paddingVertical: hp(4),
    borderRadius: hp(6),
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp(100),
    maxWidth: wp(150),
    marginLeft: wp(-33),
    width: '100%'
  },
  dotLabel: {
    ...commonFontStyle(500, 12, colors.white),
    textAlign: 'center',
    flexShrink: 0,
  },
  btn: {
    marginHorizontal: wp(4),
    marginTop: 40,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    // gap: wp(8),
    overflow: 'visible',
  },
  fieldLabel: {
    ...commonFontStyle(600, 18, colors._050505),
  },
  tooltipIcon: {
    marginTop: hp(0),
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    minHeight: hp(65),
    borderRadius: wp(20),
    backgroundColor: colors.white,
    borderWidth: wp(1.5),
    borderColor: '#225797',
  },
  locationText: {
    flex: 1,
    ...commonFontStyle(400, 18, colors._050505),
  },
  locationPlaceholder: {
    flex: 1,
    ...commonFontStyle(400, 18, '#969595'),
  },
  arrowIcon: {
    width: wp(20),
    height: hp(20),
    tintColor: colors._0B3970,
    marginLeft: wp(8),
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  languageName: {
    ...commonFontStyle(400, 16, colors._050505),
    flex: 1,
  },
  dotWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
});
