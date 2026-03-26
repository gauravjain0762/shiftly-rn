import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { commonFontStyle, hp, wp } from '../../../theme/fonts';
import { colors } from '../../../theme/colors';
import { Plus } from 'lucide-react-native';
import {
  goBack,
  errorToast,
  successToast,
} from '../../../utils/commonFunction';
import { navigationRef } from '../../../navigation/RootContainer';
import { useRoute } from '@react-navigation/native';
import { useSendInterviewInvitesMutation } from '../../../api/dashboardApi';
import BottomModal from '../../../component/common/BottomModal';
import LottieView from 'lottie-react-native';
import { animation } from '../../../assets/animation';
import { SCREENS } from '../../../navigation/screenNames';
import { useAppSelector } from '../../../redux/hooks';
import { selectJobForm } from '../../../features/companySlice';
import useJobFormUpdater from '../../../hooks/useJobFormUpdater';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateQuestion = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { jobId, invitePayload, jobData } = route.params || {};
  const [questionText, setQuestionText] = useState('');
  const existingQuestionsRaw: string[] = jobData?.interview_questions || [];
  const existingQuestions: string[] = existingQuestionsRaw
    .filter((q: any) => typeof q === 'string' && q.trim().length > 0)
    .map((q: string) => q.trim());

  const [addedQuestions, setAddedQuestions] = useState<string[]>(existingQuestions);
  const [sendInvites, { isLoading }] = useSendInterviewInvitesMutation({});
  const { updateJobForm } = useJobFormUpdater();
  const { isSuccessModalVisible } = useAppSelector((state: any) =>
    selectJobForm(state),
  );
  const [showQuestionInput, setShowQuestionInput] = useState<boolean>(
    existingQuestions.length === 0,
  );
  const handleAddQuestion = () => {
    if (questionText.trim()) {
      const next = questionText.trim();
      setAddedQuestions([...addedQuestions, next]);
      setQuestionText('');
      // If job already has questions, hide the input again after adding.
      if (existingQuestions.length > 0) {
        setShowQuestionInput(false);
      }
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = addedQuestions.filter((_, i) => i !== index);
    setAddedQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (!jobId || !invitePayload) {
      errorToast(t('Missing invite information. Please try again.'));
      return;
    }

    if (addedQuestions.length === 0) {
      errorToast(t('Please add at least one question'));
      return;
    }

    console.log("🔥 ~ handleSubmit ~ jobId:", jobId);

    // Backend expects multipart form-data for this endpoint.
    const formData = new FormData();
    const inviteTo = invitePayload.invite_to === 'all' ? 'all' : 'specific';
    formData.append('job_id', jobId);
    formData.append('invite_to', inviteTo);

    // Add user_ids based on invite_to type
    if (inviteTo === 'specific' && Array.isArray(invitePayload.user_ids)) {
      const filteredIds = invitePayload.user_ids.filter((id: string | null) => !!id);
      if (!filteredIds.length) {
        errorToast(t('Please select at least one employee'));
        return;
      }
      // API expects comma-separated IDs in single user_ids field.
      formData.append('user_ids', filteredIds.join(','));
    } else if (inviteTo === 'specific' && invitePayload.user_ids) {
      const ids = Array.isArray(invitePayload.user_ids)
        ? invitePayload.user_ids.filter((id: string | null) => !!id)
        : [invitePayload.user_ids];
      if (!ids.length) {
        errorToast(t('Please select at least one employee'));
        return;
      }
      formData.append('user_ids', ids.join(','));
    }

    // questions[0], questions[1], ...
    addedQuestions.forEach((question, index) => {
      formData.append(`questions[${index}]`, question);
    });

    console.log('🔥 ~ handleSubmit ~ invite payload:', {
      job_id: jobId,
      invite_to: inviteTo,
      user_ids:
        inviteTo === 'specific' && Array.isArray(invitePayload.user_ids)
          ? invitePayload.user_ids.filter((id: string | null) => !!id).join(',')
          : undefined,
      questions: addedQuestions,
    });

    try {
      const response = await sendInvites(formData).unwrap();
      console.log("🔥 ~ handleSubmit ~ response:", response);

      if (response?.status) {
        successToast(response?.message || t('Invites sent successfully'));
        updateJobForm({ isSuccessModalVisible: true });
        setQuestionText('');
        setAddedQuestions([]);
      } else {
        errorToast(response?.message || t('Failed to send invites'));
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        t('Something went wrong. Please try again.');
      errorToast(errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
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
            {existingQuestions.length === 0 && (
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
            )}

            {existingQuestions.length === 0 && <TouchableOpacity
              style={styles.addQuestionButton}
              onPress={() => {
                if (!showQuestionInput && existingQuestions.length > 0) {
                  setShowQuestionInput(true);
                  return;
                }
                handleAddQuestion();
              }}
              activeOpacity={0.7}>
              <View style={styles.addButtonIcon}>
                <Plus size={20} color={colors.black} />
              </View>
              <Text style={styles.addButtonText}>{t('Add New Question')}</Text>
            </TouchableOpacity>}

            {addedQuestions.length > 0 && (
              <View style={styles.addedSection}>
                <Text style={styles.sectionTitle}>{t('Added Questions')}</Text>
                {addedQuestions.map((question, index) => (
                  <View key={index} style={styles.addedQuestionCard}>
                    <Text style={styles.addedQuestionText}>{question}</Text>
                    {index >= existingQuestions.length && (
                      <TouchableOpacity
                        onPress={() => handleRemoveQuestion(index)}
                        style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    )}
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
            title={t('Proceed to AI Interview')}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </View>

        <BottomModal
          visible={isSuccessModalVisible}
          backgroundColor={colors.white}
          onClose={() => { }}>
          <View style={styles.modalIconWrapper}>
            <LottieView
              source={animation.success_check}
              autoPlay
              loop={false}
              style={styles.modalCheckIcon}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.modalTitle}>
            {t('AI interviews successfully sent')}
          </Text>
          <Text style={styles.modalSubtitle}>
            {t('Candidates will be automatically analyzed and scored')}
          </Text>
          <GradientButton
            style={[styles.modalPrimaryButton, styles.modalButtonSpacing]}
            type="Company"
            title={t('View pending interviews')}
            onPress={() => {
              updateJobForm({ isSuccessModalVisible: false });
              navigationRef.reset({
                index: 1,
                routes: [
                  {
                    name: SCREENS.CoTabNavigator,
                    state: {
                      routes: [{ name: SCREENS.CoJob }],
                    },
                  },
                  {
                    name: SCREENS.SuggestedEmployee,
                    params: {
                      jobId: jobId,
                      isFromJobCard: true,
                      fromPendingInterview: true,
                    },
                  },
                ],
              });
            }}
          />
          <GradientButton
            style={[styles.modalPrimaryButton, styles.modalButtonSpacing]}
            type="Company"
            title={t('Back to dashboard')}
            onPress={() => {
              updateJobForm({ isSuccessModalVisible: false });
              navigationRef.reset({
                index: 0,
                routes: [{ name: SCREENS.CoTabNavigator }],
              });
            }}
          />
        </BottomModal>
      </LinearContainer>
    </SafeAreaView>
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
    paddingTop: hp(10),
    paddingBottom: hp(40),
    paddingHorizontal: wp(35),
  },
  submitButton: {
    marginVertical: 0,
  },
  modalIconWrapper: {
    alignItems: 'center',
    marginBottom: hp(16),
  },
  modalCheckIcon: {
    width: wp(90),
    height: wp(90),
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: hp(25),
    ...commonFontStyle(700, 20, colors.black),
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: hp(25),
    ...commonFontStyle(400, 14, colors._4A4A4A),
  },
  modalPrimaryButton: {
    marginVertical: 0,
  },
  modalButtonSpacing: {
    marginVertical: hp(12),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});
