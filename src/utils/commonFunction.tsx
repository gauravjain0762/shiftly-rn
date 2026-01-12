import Toast from 'react-native-toast-message';
import { navigationRef } from '../navigation/RootContainer';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android' ? true : false;

export const successToast = (message: string) => {
  Toast.show({ type: 'success', text1: message });
};

export const errorToast = (message: string) => {
  Toast.show({ type: 'error', text1: message });
};

export const emailCheck = (email: string) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(email.toLowerCase());
};

export const nameCheck = (name: string) => {
  let reg = /^([a-zA-Z ]){2,30}$/;
  if (reg.test(name) === false) {
    return false;
  } else {
    return true;
  }
};

export const fullNameCheck = (name: string) => {
  if (!name) return false;
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length < 2) return false;
  const reg = /^[a-zA-Z]+$/;
  return parts.every(part => reg.test(part));
};

export const companyEmailCheck = (email: string) => {
  if (!email) return false;

  const lowerEmail = email.toLowerCase();
  const freeDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'protonmail.com',
    'zoho.com',
    'mail.com',
  ];
  const domain = lowerEmail.split('@')[1];

  if (!domain) return false;

  if (freeDomains.includes(domain)) return false;

  return emailRegex.test(lowerEmail);
};


export const passwordCheck = (string: string) => {
  let reg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{9,}$/;
  return reg.test(string);
};

export const mobileNumberCheck = (mobileNo: string) => {
  let reg = /^\d*$/;
  return reg.test(mobileNo);
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export const resetNavigation = (name: string, params?: any | undefined) => {
//   navigationRef.dispatch(
//     CommonActions.reset({
//       index: 1,
//       routes: [{name: name, params: params}],
//     }),
//   );
// };

export const formatted = (isoTime: string) =>
  moment(isoTime).local().format('hh:mm A');

export const resetNavigation = (
  parentRouteName: string | undefined | any,
  childRouteName?: string | undefined | any,
  params = {},
) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [
      {
        name: parentRouteName,
        state: childRouteName
          ? {
            index: 0,
            routes: [{ name: childRouteName, params }],
          }
          : undefined,
        params: !childRouteName ? params : undefined,
      },
    ],
  });
};

export const navigateTo = (name: string, params?: any | undefined) => {
  navigationRef.navigate(name, params);
};

export const goBack = () => {
  navigationRef.goBack();
};

type ImagePickerProps = {
  params?: object;
  onSucess: (params: object) => void;
  onFail?: (params: { message: string }) => void | undefined;
};
export const openImagePicker = ({
  params,
  onSucess,
  onFail,
}: ImagePickerProps) => {
  try {
    ImagePicker.openPicker({
      multiple: false,
      cropping: false,
      mediaType: 'photo',
      freeStyleCropEnabled: false,
      ...params,
    })
      .then(image => {
        let obj = {
          ...image,
          uri: image.path,
          name: 'image_' + moment().unix() + '_' + image.path.split('/').pop(),
        };
        onSucess(obj);
      })
      .catch(err => {
        onFail?.(err);
      });
  } catch (error) { }
};

export const getImageUrl = (imagePath: string | null): string | null => {
  const BASE_IMAGE_URL = 'https://sky.devicebee.com/Shiftly/api';
  if (!imagePath) return null;

  return imagePath.startsWith('http')
    ? imagePath
    : `${BASE_IMAGE_URL}${imagePath}`;
};

export const IMAGE_URL =
  'https://images.unsplash.com/photo-1750912228794-92ec92276a50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D';

export const getPostedTime = (isoDate: string) => {
  if (!isoDate) return '';

  const now = moment();
  const postDate = moment(isoDate);

  const diffInDays = now.diff(postDate, 'days');

  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} month${diffInDays >= 60 ? 's' : ''} ago`;

  return `${Math.floor(diffInDays / 365)} year${diffInDays >= 730 ? 's' : ''} ago`;
};

export const getTimeAgo = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  if (diffMinutes > 0) return `${diffMinutes}m`;
  return `${diffSeconds}s`;
};

export const getInitials = (name?: string) => {
  if (!name) return '?';

  const words = name.trim().split(' ').filter(Boolean);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export const hasValidImage = (imageUri?: string | null) => {
  return (
    typeof imageUri === 'string' &&
    imageUri.trim().length > 0 &&
    !imageUri.toLowerCase().includes('blank')
  );
};

export const passwordRules = [
  { label: 'Minimum 8 characters', test: (pw: string | any[]) => pw.length >= 8 },
  {
    label: 'At least 1 uppercase letter',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: 'At least 1 lowercase letter',
    test: (pw: string) => /[a-z]/.test(pw),
  },
  { label: 'At least 1 number', test: (pw: string) => /\d/.test(pw) },
  {
    label: 'At least 1 special character (e.g. @, #, $, !)',
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
];

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return moment(dateString).local().format('MMMM DD, YYYY, h:mm A');
};

export const formatDateWithoutTime = (dateString: string) => {
  if (!dateString) return '';
  return moment(dateString).local().format('MMMM DD, YYYY.');
};
