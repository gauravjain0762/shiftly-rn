import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {getCurrencySymbol} from './currencySymbols';
import { getJobMonthlySalaryRangeText } from './monthlySalaryRange';

export const normalizeUrl = (raw?: string) => {
  const url = (raw ?? '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  // Some backends send "www.domain.com/..." or "domain.com/..."
  return `https://${url.replace(/^\/+/, '')}`;
};

type ShareJobOptions = {
  includeImageOnAndroid?: boolean;
};

const downloadImage = async (url: string) => {
  const filePath = `${RNFS.CachesDirectoryPath}/job_${Date.now()}.jpg`;

  await RNFS.downloadFile({
    fromUrl: url,
    toFile: filePath,
  }).promise;

  return `file://${filePath}`;
};

export const shareJob = async (item: any, options?: ShareJobOptions) => {
  try {
    const title = item?.title || 'Job Opportunity';
    const companyName =
      item?.company_id?.company_name || item?.company?.company_name || item?.company?.name || '';
    const area =
      item?.address ||
      item?.area ||
      [item?.city, item?.country].filter(Boolean).join(', ') ||
      '';
    const rawDescription = String(item?.description || '').trim();
    const description =
      rawDescription.length > 200
        ? `${rawDescription.slice(0, 200).trimEnd()}...`
        : rawDescription;
    const salaryRangeText = getJobMonthlySalaryRangeText(item);
    const salary =
      salaryRangeText
        ? `Salary: ${getCurrencySymbol(item?.currency)}${salaryRangeText}`
        : '';

    const shareUrl = normalizeUrl(item?.share_url) || 'https://shiftly.ae/';
    const shareUrlText = shareUrl ? `\n\n${shareUrl}` : '';

    const companyLine = companyName ? `Company: ${companyName}` : '';
    const locationLine = area ? `📍 LOCATION: ${area}` : '';

    const message = [
      title,
      description,
      companyLine,
      locationLine,
      salary,
      shareUrl,
    ]
      .map(line => String(line || '').trim())
      .filter(Boolean)
      .join('\n\n');

    const baseShareOptions: any = {
      title: title,
      message: message,
      url: shareUrl,
    };

    // Determine the best image to share (Cover Image > Logo)
    let imageToShare = null;

    // Check for cover images
    const coverImgs =
      item?.company_id?.cover_images || item?.company?.cover_images;
    if (coverImgs && Array.isArray(coverImgs) && coverImgs.length > 0) {
      const valid = coverImgs.find(
        img => img && typeof img === 'string' && img.trim() !== '',
      );
      if (valid) imageToShare = valid;
    }

    // Fallback to logo if no cover image
    if (!imageToShare) {
      const logo = item?.company_id?.logo || item?.company?.logo;
      if (logo && typeof logo === 'string' && logo.trim() !== '') {
        imageToShare = logo;
      }
    }

    let shareOptions: any = {...baseShareOptions};
    // Android SMS and some targets often fail with local file attachments.
    // Keep Android share text/link only to avoid native "Failed to add attachment" popups.
    const shouldAttachImage =
      Platform.OS !== 'android' || Boolean(options?.includeImageOnAndroid);
    if (imageToShare && shouldAttachImage) {
      try {
        const imagePath = await downloadImage(imageToShare);
        const exists = await RNFS.exists(imagePath.replace('file://', ''));
        if (exists) {
          shareOptions = {
            ...baseShareOptions,
            url: imagePath,
            type: 'image/jpeg',
            ...(Platform.OS === 'android' ? {useInternalStorage: true} : {}),
          };
        }
      } catch (imageError) {
        console.log('❌ Image download error:', imageError);
      }
    }

    try {
      await Share.open(shareOptions);
    } catch (shareError: any) {
      // Android can fail to grant attachment access for some share targets.
      // Retry without attachment so sharing still works.
      const isAttachmentFailure =
        Platform.OS === 'android' &&
        String(shareError?.message || '')
          .toLowerCase()
          .includes('failed to share attachment');
      if (isAttachmentFailure) {
        await Share.open(baseShareOptions);
      } else {
        throw shareError;
      }
    }
  } catch (err: any) {
    if (err?.message !== 'User did not share') {
      console.log('❌ Share error:', err);
    }
  }
};
