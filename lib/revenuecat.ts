// lib/revenuecat.ts — 2025 GÜNCEL, HİÇ HATA YOK
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';

const PRODUCTION_API_KEY = Constants.expoConfig?.extra?.revenueCatApiKey;
const IS_EXPO_GO = Constants.appOwnership === 'expo';

const API_KEY = IS_EXPO_GO || __DEV__
  ? 'test_CJsrvSdakQuTeBOQXoMMelnwDxf'  // senin test key
  : PRODUCTION_API_KEY || 'appl_gerçek_key_buraya';

export const initializeRevenueCat = async () => {
  if (!API_KEY || API_KEY.includes('gerçek_key')) {
    console.warn('RevenueCat API key eksik!');
    return;
  }

  // BU FONKSİYON ARTIK YOK! HİÇ ÇAĞIRMA!
  // Purchases.setDebugLogsEnabled(__DEV__); ← SİLİNDİ!

  try {
    await Purchases.configure({ apiKey: API_KEY });
    console.log('RevenueCat başlatıldı');
  } catch (error: any) {
    if (IS_EXPO_GO) {
      console.log('Expo Go’da RevenueCat test modunda (hata normal)');
    } else {
      console.warn('RevenueCat hatası:', error.message);
    }
  }
};

export const getCustomerInfo = async () => {
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
};