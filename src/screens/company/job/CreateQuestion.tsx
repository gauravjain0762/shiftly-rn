import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  BackHeader,
  GradientButton,
  LinearContainer,
} from '../../../component';
import {useTranslation} from 'react-i18next';
import {commonFontStyle, hp, wp} from '../../../theme/fonts';
import {colors} from '../../../theme/colors';
import {Plus} from 'lucide-react-native';
import {goBack} from '../../../utils/commonFunction';

const CreateQuestion = () => {
  const {t} = useTranslation();
  const [questionText, setQuestionText] = useState('');
  const [addedQuestions, setAddedQuestions] = useState<string[]>([]);

  const predefinedQuestions = [
    'Describe your previous job experience relevant to this role?',
    'Can you share an example of a project you successfully completed?',
    'Describe a challenge you faced at work and how you solved it.',
    'What kind of work environment helps you perform your best?',
  ];

  const handleAddQuestion = () => {
    if (questionText.trim()) {
      setAddedQuestions([...addedQuestions, questionText.trim()]);
      setQuestionText('');
    }
  };

  const handleSelectPredefinedQuestion = (question: string) => {
    setAddedQuestions([...addedQuestions, question]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = addedQuestions.filter((_, i) => i !== index);
    setAddedQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    // TODO: Handle submit action
    console.log('Submitted questions:', addedQuestions);
    goBack();
  };

  return (
    <LinearContainer colors={[colors.coPrimary, colors.white]}>
      <View style={styles.header}>
        <BackHeader
          type="company"
          onBackPress={() => goBack()}
          title={t('Create Question')}
          isRight={false}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Question Input Field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={t('Write your question here...')}
              placeholderTextColor={colors.greyOpacity}
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Add New Question Button */}
          <TouchableOpacity
            style={styles.addQuestionButton}
            onPress={handleAddQuestion}
            activeOpacity={0.7}>
            <View style={styles.addButtonIcon}>
              <Plus size={20} color={colors.black} />
            </View>
            <Text style={styles.addButtonText}>{t('Add New Question')}</Text>
          </TouchableOpacity>

          {/* Predefined Questions */}
          <View style={styles.predefinedSection}>
            {predefinedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.questionCard}
                onPress={() => handleSelectPredefinedQuestion(question)}
                activeOpacity={0.7}>
                <Text style={styles.questionCardText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Added Questions List */}
          {addedQuestions.length > 0 && (
            <View style={styles.addedSection}>
              <Text style={styles.sectionTitle}>{t('Added Questions')}</Text>
              {addedQuestions.map((question, index) => (
                <View key={index} style={styles.addedQuestionCard}>
                  <Text style={styles.addedQuestionText}>{question}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveQuestion(index)}
                    style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <GradientButton
          style={styles.submitButton}
          type="Company"
          title={t('Submit')}
          onPress={handleSubmit}
        />
      </View>
    </LinearContainer>
  );
};

export default CreateQuestion;

const styles = StyleSheet.create({
  header: {
    paddingTop: hp(24),
    paddingHorizontal: wp(35),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(20),
  },
  container: {
    paddingHorizontal: wp(35),
    paddingTop: hp(20),
  },
  inputContainer: {
    marginBottom: hp(30),
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: wp(20),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    minHeight: hp(120),
    ...commonFontStyle(400, 16, colors.black),
    textAlignVertical: 'top',
  },
  addQuestionButton: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(50),
    backgroundColor: colors.white,
    borderColor: '#E8E8E8',
    paddingHorizontal: wp(30),
    paddingVertical: hp(14),
    marginBottom: hp(30),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    width: wp(24),
    height: hp(24),
    borderRadius: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(10),
    borderColor: '#E8E8E8',
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  addButtonText: {
    ...commonFontStyle(400, 16, colors.black),
  },
  predefinedSection: {
    marginBottom: hp(30),
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: wp(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    marginBottom: hp(12),
  },
  questionCardText: {
    ...commonFontStyle(400, 16, colors.black),
    lineHeight: hp(24),
  },
  addedSection: {
    marginTop: hp(20),
  },
  sectionTitle: {
    marginBottom: hp(12),
    ...commonFontStyle(700, 20, colors._4A4A4A),
  },
  addedQuestionCard: {
    backgroundColor: colors.white,
    borderRadius: wp(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    marginBottom: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addedQuestionText: {
    flex: 1,
    lineHeight: hp(24),
    marginRight: wp(10),
    ...commonFontStyle(400, 16, colors.black),
  },
  removeButton: {
    width: wp(28),
    height: hp(28),
    borderRadius: wp(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
  },
  removeButtonText: {
    lineHeight: hp(20),
    ...commonFontStyle(600, 20, '#FF4444'),
  },
  buttonContainer: {
    paddingHorizontal: wp(35),
    paddingBottom: hp(30),
    paddingTop: hp(10),
  },
  submitButton: {
    marginVertical: 0,
  },
});
