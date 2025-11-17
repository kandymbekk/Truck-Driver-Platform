import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { PlusBadge } from '@/components/PlusBadge';
import { User, Crown, LogOut, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const { profile, isPlusMember, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      alert('Çıkış yapılamadı');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <User size={28} color="#f59e0b" />
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={40} color="#9ca3af" />
          </View>
          <Text style={styles.name}>{profile?.full_name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {isPlusMember && (
            <View style={styles.badgeContainer}>
              <PlusBadge size="large" />
            </View>
          )}
        </View>

        {!isPlusMember && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={() => router.push('/subscription-plan')}>
            <View style={styles.upgradeIconContainer}>
              <Crown size={24} color="#f59e0b" />
            </View>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>PLUS'a Geçin</Text>
              <Text style={styles.upgradeDescription}>
                Tüm özelliklerin kilidini açın
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Ayarlar</Text>
          </TouchableOpacity>

          {isPlusMember && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/subscription-plan')}>
              <Crown size={20} color="#f59e0b" />
              <Text style={styles.menuItemText}>Aboneliği Yönet</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <LogOut size={20} color="#ef4444" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versiyon 1.0.0</Text>
        </View>
      </ScrollView>
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
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  badgeContainer: {
    marginTop: 8,
  },
  upgradeCard: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 2,
  },
  upgradeDescription: {
    fontSize: 13,
    color: '#78350f',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  logoutText: {
    color: '#ef4444',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
