import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { PlusLock } from '@/components/PlusLock';
import { PlusCircle } from 'lucide-react-native';

export default function CreateJobScreen() {
  const { isPlusMember } = useAuth();
  const router = useRouter();
  const [showLock, setShowLock] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originCity: '',
    originLat: '',
    originLng: '',
    destinationCity: '',
    destinationLat: '',
    destinationLng: '',
    cargoType: '',
    cargoWeight: '',
    price: '',
    departureDate: '',
  });

  const handleSubmit = async () => {
    if (!isPlusMember) {
      setShowLock(true);
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.originCity ||
      !formData.destinationCity ||
      !formData.cargoType ||
      !formData.cargoWeight ||
      !formData.price ||
      !formData.departureDate
    ) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('job_listings').insert({
        title: formData.title,
        description: formData.description,
        origin_city: formData.originCity,
        origin_lat: parseFloat(formData.originLat) || 0,
        origin_lng: parseFloat(formData.originLng) || 0,
        destination_city: formData.destinationCity,
        destination_lat: parseFloat(formData.destinationLat) || 0,
        destination_lng: parseFloat(formData.destinationLng) || 0,
        cargo_type: formData.cargoType,
        cargo_weight: parseFloat(formData.cargoWeight),
        price: parseFloat(formData.price),
        currency: 'TRY',
        departure_date: formData.departureDate,
        status: 'open',
      });

      if (error) throw error;

      alert('İlan başarıyla oluşturuldu');
      router.push('/(tabs)/jobs');
    } catch (error: any) {
      alert(error.message || 'İlan oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  if (!isPlusMember) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <PlusCircle size={28} color="#f59e0b" />
          <Text style={styles.headerTitle}>İlan Ver</Text>
        </View>
        <View style={styles.lockedContent}>
          <View style={styles.lockIconContainer}>
            <PlusCircle size={64} color="#d1d5db" />
          </View>
          <Text style={styles.lockedTitle}>Bu özellik kilitli</Text>
          <Text style={styles.lockedDescription}>
            İlan vermek için PLUS üyeliğe geçmeniz gerekiyor
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => router.push('/subscription-plan')}>
            <Text style={styles.upgradeButtonText}>PLUS'a Geç</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PlusCircle size={28} color="#f59e0b" />
        <Text style={styles.headerTitle}>Yeni İlan Oluştur</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>İlan Başlığı *</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: İstanbul - Ankara arası taşıma"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Açıklama *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="İlan detayları..."
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Başlangıç Şehri *</Text>
            <TextInput
              style={styles.input}
              placeholder="İstanbul"
              value={formData.originCity}
              onChangeText={(text) =>
                setFormData({ ...formData, originCity: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Varış Şehri *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ankara"
              value={formData.destinationCity}
              onChangeText={(text) =>
                setFormData({ ...formData, destinationCity: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yük Tipi *</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Gıda, Elektronik, İnşaat Malzemesi"
              value={formData.cargoType}
              onChangeText={(text) =>
                setFormData({ ...formData, cargoType: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yük Ağırlığı (ton) *</Text>
            <TextInput
              style={styles.input}
              placeholder="20"
              value={formData.cargoWeight}
              onChangeText={(text) =>
                setFormData({ ...formData, cargoWeight: text })
              }
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fiyat (TRY) *</Text>
            <TextInput
              style={styles.input}
              placeholder="5000"
              value={formData.price}
              onChangeText={(text) =>
                setFormData({ ...formData, price: text })
              }
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Çıkış Tarihi (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              placeholder="2025-01-20"
              value={formData.departureDate}
              onChangeText={(text) =>
                setFormData({ ...formData, departureDate: text })
              }
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Oluşturuluyor...' : 'İlanı Yayınla'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PlusLock
        visible={showLock}
        onClose={() => setShowLock(false)}
        onUpgrade={() => {
          setShowLock(false);
          router.push('/subscription-plan');
        }}
        feature="İlan verme"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  lockedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  lockedDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
