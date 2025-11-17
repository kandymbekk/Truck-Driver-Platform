import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin } from 'lucide-react-native';

export default function TrackingScreen() {
  const { isPlusMember } = useAuth();
  const router = useRouter();

  if (!isPlusMember) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MapPin size={28} color="#f59e0b" />
          <Text style={styles.headerTitle}>Araç Takip</Text>
        </View>
        <View style={styles.lockedContent}>
          <View style={styles.lockIconContainer}>
            <MapPin size={64} color="#d1d5db" />
          </View>
          <Text style={styles.lockedTitle}>Bu özellik kilitli</Text>
          <Text style={styles.lockedDescription}>
            Araçları takip etmek için PLUS üyeliğe geçmeniz gerekiyor
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
        <MapPin size={28} color="#f59e0b" />
        <Text style={styles.headerTitle}>Araç Takip</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <MapPin size={48} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Henüz araç eklenmemiş</Text>
          <Text style={styles.emptyDescription}>
            Araçlarınızı ekleyerek takip etmeye başlayın
          </Text>
        </View>
      </View>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
