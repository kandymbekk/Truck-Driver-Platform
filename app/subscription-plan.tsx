// app/subscription-plan.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Crown, Check, MessageCircle, MapPin, FileText, TrendingUp } from 'lucide-react-native';
import { purchasePackage, getCustomerInfo } from '@/lib/revenuecat';

export default function SubscriptionPlanScreen() {
  const router = useRouter();

  // TEK VE DOĞRU handleUpgrade
  const handleUpgrade = async () => {
    try {
      // Burada RevenueCat dashboard'daki gerçek identifier'ı yaz!
      // Örnek: "$rc_monthly" veya "plus_monthly_299"
      const customerInfo = await purchasePackage('$rc_monthly'); // ← BURAYI DEĞİŞTİR

      if (customerInfo?.entitlements.active['plus']) {
        Alert.alert('Başarılı!', 'PLUS üyeliğiniz aktif oldu');
        // Opsiyonel: kullanıcı bilgisini yenile
        // await refreshUserData(); // varsa ekle
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      if (error.userCancelled) {
        Alert.alert('İptal edildi', 'Satın alma iptal edildi');
      } else {
        console.error('Satın alma hatası:', error);
        Alert.alert('Hata', error.message || 'Bir hata oluştu');
      }
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Crown size={56} color="#f59e0b" />
          </View>
          <Text style={styles.title}>PLUS Üyeliğe Geçin</Text>
          <Text style={styles.subtitle}>
            Tüm özelliklerin kilidi açılsın, işinizi büyütün
          </Text>
        </View>

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>PLUS Üyelik</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₺299</Text>
              <Text style={styles.period}>/ay</Text>
            </View>
          </View>

          <View style={styles.features}>
            <FeatureItem icon={FileText} text="Sınırsız ilan yayınlama" />
            <FeatureItem icon={MessageCircle} text="Diğer şoförlerle mesajlaşma" />
            <FeatureItem icon={MapPin} text="Araç takibi (GPS)" />
            <FeatureItem icon={TrendingUp} text="İlanlara teklif verme" />
            <FeatureItem icon={Check} text="Yakındaki tırlarla etkileşim" />
            <FeatureItem icon={Check} text="Öncelikli destek" />
          </View>

          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>PLUS'a Geç</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.freeCard}>
          <Text style={styles.freeTitle}>Ücretsiz Hesap</Text>
          <Text style={styles.freeDescription}>
            İlanları görüntüleyebilir ve platformu keşfedebilirsiniz
          </Text>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Ücretsiz Devam Et</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          İstediğiniz zaman üyeliğinizi iptal edebilirsiniz
        </Text>
      </View>
    </ScrollView>
  );
}

// FeatureItem component
function FeatureItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Icon size={20} color="#10b981" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

// StyleSheet (aynı kaldı, sadece ufak temizlik)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', lineHeight: 24 },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 16, marginBottom: 20 },
  planName: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 36, fontWeight: '700', color: '#f59e0b' },
  period: { fontSize: 16, color: '#6b7280', marginLeft: 4 },
  features: { gap: 16, marginBottom: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { fontSize: 16, color: '#374151', flex: 1 },
  upgradeButton: { backgroundColor: '#f59e0b', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  upgradeButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  freeCard: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20 },
  freeTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  freeDescription: { fontSize: 14, color: '#6b7280', marginBottom: 16, lineHeight: 20 },
  skipButton: { backgroundColor: '#f3f4f6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  skipButtonText: { color: '#374151', fontSize: 14, fontWeight: '600' },
  note: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
});