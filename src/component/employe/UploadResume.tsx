import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import {colors} from '../../theme/colors';
import BaseText from '../common/BaseText';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {IMAGES} from '../../assets/Images';
import ImagePickerModal from '../common/ImagePickerModal';
import CustomImage from '../common/CustomImage';
import {errorToast, successToast} from '../../utils/commonFunction';
import {useRemoveResumeMutation} from '../../api/dashboardApi';

type ResumeProps = {
  resumes: any;
  setResumes: any;
};

const MAX_RESUMES = 5;

const UploadResume = ({resumes, setResumes}: ResumeProps) => {
  const [isImageModal, setImageModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<any[]>([]);
  const [removeResume] = useRemoveResumeMutation();

  const canUploadMore = resumes.length < MAX_RESUMES;

  const handleDeleteResume = async (doc_id: string) => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete this resume?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await removeResume(doc_id).unwrap();
              if (res?.status) {
                successToast(res?.message);
                setResumes(resumes.filter((doc: any) => doc._id !== doc_id));
                setSelectedDocs(prev =>
                  prev.filter(item => item._id !== doc_id),
                );
              } else {
                errorToast(res?.message);
              }
            } catch (error) {
              console.error('Error deleting resume:', error);
              errorToast('Failed to delete resume');
            }
          },
        },
      ],
    );
  };

  const handleDocumentSelection = (doc: any) => {
    if (doc._id) {
      return;
    }

    const isSelected = selectedDocs.some(
      item => item.file_name === doc.file_name,
    );

    if (isSelected) {
      setSelectedDocs(prev =>
        prev.filter(item => item.file_name !== doc.file_name),
      );
    } else {
      setSelectedDocs(prev => [...prev, doc]);
    }
  };

  const isDocSelected = (doc: any) => {
    return selectedDocs.some(item => item.file_name === doc.file_name);
  };

  const clearAllSelections = () => {
    setSelectedDocs([]);
  };

  const removeLocalDocument = (doc: any) => {
    setResumes((prev: any[]) =>
      prev.filter((item: any) => item?.file_name !== doc?.file_name),
    );
    setSelectedDocs(prev =>
      prev.filter(item => item.file_name !== doc.file_name),
    );
  };

  const newDocuments = resumes.filter((doc: any) => !doc._id);
  const uploadedDocuments = resumes.filter((doc: any) => doc._id);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <BaseText style={styles.titleText}>{'Upload your CV '}</BaseText>

          {/* Counter */}
          <View style={styles.counterContainer}>
            <BaseText style={styles.counterText}>
              {resumes.length} / {MAX_RESUMES} documents
            </BaseText>
            {resumes.length > 0 && (
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${(resumes.length / MAX_RESUMES) * 100}%`},
                  ]}
                />
              </View>
            )}
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (!canUploadMore) {
              errorToast(`You can't upload more than ${MAX_RESUMES} resumes`);
              return;
            }
            setImageModal(true);
          }}
          style={[
            styles.uploadButton,
            !canUploadMore && styles.uploadButtonDisabled,
          ]}>
          <BaseText
            style={[
              styles.uploadText,
              !canUploadMore && styles.uploadTextDisabled,
            ]}>
            {canUploadMore ? 'Upload CV' : 'Limit Reached'}
          </BaseText>
        </Pressable>

        <BaseText style={styles.noteText}>
          {'PDF or word document up to 5MB'}
        </BaseText>

        {!canUploadMore && (
          <BaseText style={styles.limitWarning}>
            Maximum {MAX_RESUMES} documents allowed. Remove some to upload new
            ones.
          </BaseText>
        )}

        {/* Selection Controls - Only show if there are new documents */}
        {newDocuments.length > 0 && (
          <View style={styles.selectionControls}>
            <BaseText style={styles.selectionText}>
              {selectedDocs.length > 0
                ? `${selectedDocs.length} document${
                    selectedDocs.length > 1 ? 's' : ''
                  } selected`
                : 'Select documents to apply with'}
            </BaseText>
            {selectedDocs.length > 0 && (
              <TouchableOpacity
                onPress={clearAllSelections}
                style={styles.clearButton}>
                <BaseText style={styles.clearButtonText}>Clear All</BaseText>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.documentsContainer}>
          {/* Already Uploaded Documents */}
          {uploadedDocuments.length > 0 && (
            <View style={styles.section}>
              <BaseText style={styles.sectionTitle}>Already Uploaded</BaseText>
              {uploadedDocuments.map((doc: any, index: number) => (
                <View
                  key={`uploaded-${doc._id || index}`}
                  style={styles.docRow}>
                  {/* No radio button for uploaded documents */}
                  <View style={styles.uploadedIndicator}>
                    <Image source={IMAGES.check} style={styles.uploadedIcon} />
                  </View>

                  <View style={styles.docInfo}>
                    <BaseText style={styles.docLabel} numberOfLines={1}>
                      {doc.file_name}
                    </BaseText>
                    <BaseText style={styles.uploadedText}>Uploaded</BaseText>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteResume(doc._id)}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <CustomImage
                      size={wp(20)}
                      source={IMAGES.delete}
                      tintColor="#FF4444"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* New Documents (Selectable) */}
          {newDocuments.length > 0 && (
            <View style={styles.section}>
              <BaseText style={styles.sectionTitle}>New Documents</BaseText>
              {newDocuments.map((doc: any, index: number) => {
                const isSelected = isDocSelected(doc);
                return (
                  <TouchableOpacity
                    key={`new-${doc.file_name}-${index}`}
                    style={[styles.docRow, isSelected && styles.docRowSelected]}
                    onPress={() => handleDocumentSelection(doc)}>
                    {/* Radio button for new documents */}
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}>
                      {isSelected && (
                        <View style={styles.check}>
                          <Image source={IMAGES.check} style={styles.checked} />
                        </View>
                      )}
                    </View>

                    <View style={styles.docInfo}>
                      <BaseText style={styles.docLabel} numberOfLines={1}>
                        {doc.file_name}
                      </BaseText>
                      <BaseText style={styles.newDocText}>
                        Ready to upload
                      </BaseText>
                    </View>

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeLocalDocument(doc)}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                      <CustomImage
                        size={wp(18)}
                        source={IMAGES.close}
                        tintColor={colors._0B3970}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Empty State */}
          {resumes.length === 0 && (
            <View style={styles.emptyState}>
              <Image source={IMAGES.document} style={styles.emptyIcon} />
              <BaseText style={styles.emptyText}>
                No documents uploaded yet
              </BaseText>
              <BaseText style={styles.emptySubtext}>
                Upload your CV to get started
              </BaseText>
            </View>
          )}
        </View>
      </View>

      <ImagePickerModal
        actionSheet={isImageModal}
        setActionSheet={setImageModal}
        onUpdate={(image: any) => {
          setImageModal(false);

          const newResume = {
            file_name: image?.name || image?.filename || `CV_${Date.now()}`,
            file: image?.path || image?.uri,
            type: image?.type,
          };

          const isDuplicate = resumes.some(
            (resume: any) => resume.file_name === newResume.file_name,
          );
          if (isDuplicate) {
            newResume.file_name = `${newResume.file_name}_${Date.now()}`;
          }

          setResumes((prev: any) => [newResume, ...prev]);
          setSelectedDocs(prev => [...prev, newResume]);
        }}
        allowDocument={true}
      />
    </>
  );
};

export default UploadResume;

const styles = StyleSheet.create({
  container: {
    marginTop: hp(40),
    marginVertical: hp(20),
    paddingHorizontal: wp(25),
  },
  headerSection: {
    marginBottom: hp(20),
  },
  titleText: {
    ...commonFontStyle(400, 22, colors._0B3970),
    marginBottom: hp(10),
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: hp(10),
  },
  counterText: {
    ...commonFontStyle(400, 14, colors._050505),
    marginBottom: hp(8),
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: '#E6E6E6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors._0B3970,
    borderRadius: 2,
  },
  uploadButton: {
    width: '90%',
    height: hp(55),
    marginTop: hp(10),
    borderWidth: hp(2),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: hp(50),
    justifyContent: 'center',
    borderColor: colors._0B3970,
    backgroundColor: colors.white,
  },
  uploadButtonDisabled: {
    borderColor: colors._D9D9D9,
    backgroundColor: colors._F7F7F7,
  },
  uploadText: {
    ...commonFontStyle(400, 22, colors._0B3970),
  },
  uploadTextDisabled: {
    color: colors._7B7878,
  },
  noteText: {
    marginTop: hp(8),
    textAlign: 'center',
    paddingHorizontal: wp(20),
    ...commonFontStyle(400, 12, colors._7B7878),
  },
  limitWarning: {
    marginTop: hp(8),
    textAlign: 'center',
    paddingHorizontal: wp(20),
    ...commonFontStyle(400, 12, '#FFB84D'),
  },
  selectionControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(20),
    marginBottom: hp(10),
    paddingHorizontal: wp(10),
  },
  selectionText: {
    ...commonFontStyle(400, 14, colors._050505),
  },
  clearButton: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: hp(15),
    borderWidth: 1,
    borderColor: colors._0B3970,
    backgroundColor: colors.white,
  },
  clearButtonText: {
    ...commonFontStyle(400, 12, colors._0B3970),
  },
  documentsContainer: {
    marginTop: hp(10),
  },
  section: {
    marginBottom: hp(25),
  },
  sectionTitle: {
    ...commonFontStyle(500, 16, colors._0B3970),
    marginBottom: hp(15),
    paddingHorizontal: wp(5),
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(12),
    paddingVertical: hp(12),
    paddingHorizontal: wp(12),
    borderRadius: hp(8),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E0D7C8',
  },
  docRowSelected: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors._0B3970,
  },
  radioCircle: {
    height: wp(24),
    width: wp(24),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors._D9D9D9,
    justifyContent: 'center',
    marginRight: wp(12),
    overflow: 'hidden',
  },
  radioCircleSelected: {
    borderColor: colors._0B3970,
  },
  uploadedIndicator: {
    height: wp(24),
    width: wp(24),
    borderRadius: 100,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(12),
  },
  uploadedIcon: {
    width: wp(12),
    height: wp(12),
    tintColor: 'white',
    resizeMode: 'contain',
  },
  check: {
    backgroundColor: colors._0B3970,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
  },
  docInfo: {
    flex: 1,
    marginRight: wp(10),
  },
  docLabel: {
    ...commonFontStyle(500, 16, colors._0B3970),
    marginBottom: hp(2),
  },
  uploadedText: {
    ...commonFontStyle(400, 12, '#4CAF50'),
  },
  newDocText: {
    ...commonFontStyle(400, 12, colors._7B7878),
  },
  deleteButton: {
    padding: wp(8),
    borderRadius: wp(15),
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  removeButton: {
    padding: wp(8),
    borderRadius: wp(15),
    backgroundColor: 'rgba(244, 226, 184, 0.1)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(40),
  },
  emptyIcon: {
    width: wp(40),
    height: wp(40),
    tintColor: colors._7B7878,
    marginBottom: hp(10),
  },
  emptyText: {
    ...commonFontStyle(500, 16, colors._050505),
    marginBottom: hp(5),
  },
  emptySubtext: {
    ...commonFontStyle(400, 14, colors._7B7878),
  },
});
