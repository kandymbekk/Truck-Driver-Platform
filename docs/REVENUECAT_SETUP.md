# RevenueCat Entegrasyon Kılavuzu

Bu dokümanda React Native Expo uygulamanıza RevenueCat üyelik sistemini nasıl entegre edeceğiniz anlatılmaktadır.

## Gereksinimler

1. RevenueCat hesabı (https://www.revenuecat.com/)
2. Apple Developer hesabı (iOS için)
3. Google Play Console hesabı (Android için)
4. Yerel geliştirme ortamı (Bolt.new üzerinde çalışmaz)

## 1. Adım: RevenueCat SDK Kurulumu

Projeyi yerel ortamınıza (Cursor, VS Code vb.) indirdikten sonra:

```bash
npx expo install expo-dev-client
npx expo install react-native-purchases
```

## 2. Adım: RevenueCat Yapılandırması

`lib/revenuecat.ts` dosyası oluşturun:

```typescript
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'YOUR_IOS_API_KEY',
  android: 'YOUR_ANDROID_API_KEY',
});

export const initializeRevenueCat = async () => {
  if (!REVENUECAT_API_KEY) return;

  Purchases.setDebugLogsEnabled(true);
  await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
};

export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  return await Purchases.getCustomerInfo();
};

export const purchasePackage = async (packageIdentifier: string) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageIdentifier);
    return customerInfo;
  } catch (error: any) {
    if (!error.userCancelled) {
      throw error;
    }
  }
};

export const restorePurchases = async (): Promise<CustomerInfo> => {
  return await Purchases.restorePurchases();
};
```

## 3. Adım: App Layout'a Ekleme

`app/_layout.tsx` dosyasına ekleyin:

```typescript
import { initializeRevenueCat } from '@/lib/revenuecat';

useEffect(() => {
  initializeRevenueCat();
}, []);
```

## 4. Adım: Supabase Edge Function Oluşturma

RevenueCat webhook'larını dinlemek için edge function:

```bash
# Yerel geliştirmede
supabase functions new revenuecat-webhook
```

`supabase/functions/revenuecat-webhook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const body = await req.json();
    const { event, app_user_id } = body;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'INITIAL_PURCHASE' || event.type === 'RENEWAL') {
      const expirationDate = event.expiration_at_ms
        ? new Date(event.expiration_at_ms).toISOString()
        : null;

      await supabase
        .from('profiles')
        .update({
          is_plus_member: true,
          plus_expires_at: expirationDate,
        })
        .eq('id', app_user_id);
    } else if (event.type === 'CANCELLATION' || event.type === 'EXPIRATION') {
      await supabase
        .from('profiles')
        .update({
          is_plus_member: false,
        })
        .eq('id', app_user_id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
```

Deploy:

```bash
supabase functions deploy revenuecat-webhook
```

## 5. Adım: RevenueCat Dashboard Ayarları

1. RevenueCat Dashboard'a gidin
2. Project Settings > Integrations > Webhooks
3. Webhook URL'i ekleyin: `https://YOUR_PROJECT.supabase.co/functions/v1/revenuecat-webhook`
4. Authorization header ekleyin (Supabase anon key)

## 6. Adım: Subscription Plan Ekranını Güncelleme

`app/subscription-plan.tsx` dosyasını güncelleyin:

```typescript
import { getCustomerInfo, purchasePackage } from '@/lib/revenuecat';

const handleUpgrade = async () => {
  try {
    await purchasePackage('your_package_identifier');
    // Satın alma başarılı
    await refreshProfile();
    router.replace('/(tabs)');
  } catch (error) {
    alert('Satın alma başarısız: ' + error.message);
  }
};
```

## 7. Adım: Test Etme

### iOS Test:

1. Xcode ile Sandbox tester hesabı oluşturun
2. `npx expo run:ios` ile test edin

### Android Test:

1. Google Play Console'da test kullanıcısı ekleyin
2. `npx expo run:android` ile test edin

## Önemli Notlar

- RevenueCat native kod gerektirdiği için Bolt.new'de çalışmaz
- Development build oluşturmak için `expo-dev-client` kullanın
- Webhook URL'i production'da HTTPS olmalı
- Test modunda abonelikler hızlı yenilenir (5-15 dakika)

## Daha Fazla Bilgi

- RevenueCat Docs: https://www.revenuecat.com/docs
- Expo RevenueCat Guide: https://www.revenuecat.com/docs/getting-started/installation/expo
