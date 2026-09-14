import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const hapticImpactLight = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {}
};

export const hapticImpactMedium = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {}
};

export const hapticSuccess = async () => {
  try {
    await Haptics.notification({ type: 'SUCCESS' });
  } catch (e) {}
};

export const hapticSelection = async () => {
  try {
    await Haptics.selectionStart();
  } catch (e) {}
};
