import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {getCurrencySymbol} from './currencySymbols';
import {IMAGES} from '../assets/Images';

const downloadImage = async (url: string) => {
  const filePath = `${RNFS.CachesDirectoryPath}/job_${Date.now()}.jpg`;

  await RNFS.downloadFile({
    fromUrl: url,
    toFile: filePath,
  }).promise;

  return `file://${filePath}`;
};

export const shareJob = async (item: any) => {
  try {
    const title = item?.title || 'Job Opportunity';
    const area = item?.address || item?.area || '';
    const description = item?.description || '';
    const salary =
      item?.monthly_salary_from || item?.monthly_salary_to
        ? `Salary: ${getCurrencySymbol(
            item?.currency,
          )}${item?.monthly_salary_from?.toLocaleString()} - ${item?.monthly_salary_to?.toLocaleString()}`
        : '';

    const shareUrl = item?.share_url || 'https://shiftly.ae/'; // Fallback if needed, or leave empty
    const shareUrlText = shareUrl ? `\n\n${shareUrl}` : '';

    const message = `${title}
${area}

${description}

${salary}${shareUrlText}`;

    const shareOptions: any = {
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

    if (imageToShare) {
      try {
        const imagePath = await downloadImage(imageToShare);
        shareOptions.url = imagePath;
        shareOptions.type = 'image/jpeg';
      } catch (imageError) {
        console.log('❌ Image download error:', imageError);
      }
    }

    await Share.open(shareOptions);
  } catch (err: any) {
    if (err?.message !== 'User did not share') {
      console.log('❌ Share error:', err);
    }
  }
};
