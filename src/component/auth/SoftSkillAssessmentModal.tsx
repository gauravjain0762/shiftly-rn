import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import { animation } from '../../assets/animation';
import { commonFontStyle, hp} from '../../theme/fonts';
import { colors } from '../../theme/colors';
import BottomModal from '../common/BottomModal';
import GradientButton from '../common/GradientButton';

type Props = {
  visible: boolean;
  onContinue: () => void;
};

const SoftSkillAssessmentModal = ({ visible, onContinue }: Props) => {
  const { t } = useTranslation();

  return (
    <BottomModal
      visible={visible}
      onClose={onContinue}
      backgroundColor={colors.white}
      style={styles.modalContent}>
      <LottieView
        source={animation.success_check}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={styles.title}>{t('Soft Skill Assessment')}</Text>
      <Text style={styles.description}>
        {t("You'll receive an email from our partner, \"AssessFirst.\" Please follow the instructions to complete your soft skill assessment.")}
      </Text>
      <GradientButton
        type="Company"
        title={t('Continue')}
        style={styles.continueBtn}
        onPress={onContinue}
      />
    </BottomModal>
  );
};

export default SoftSkillAssessmentModal;

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
  },
  lottie: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: hp(16),
  },
  title: {
    ...commonFontStyle(600, 22, colors._050505),
    textAlign: 'center',
    marginBottom: hp(16),
  },
  description: {
    ...commonFontStyle(400, 16, colors._4A4A4A),
    textAlign: 'center',
    lineHeight: hp(24),
    marginBottom: hp(24),
  },
  continueBtn: {
    width: '100%',
  },
});
