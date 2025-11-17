import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { JobCard } from '@/components/JobCard';
import { PlusBadge } from '@/components/PlusBadge';
import { Truck } from 'lucide-react-native';

type JobListing = {
  id: string;
  title: string;
  origin_city: string;
  destination_city: string;
  cargo_type: string;
  cargo_weight: number;
  price: number;
  currency: string;
  departure_date: string;
};

export default function HomeScreen() {
  const { profile, isPlusMember } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Truck size={28} color="#f59e0b" />
            <Text style={styles.headerTitle}>TırNet</Text>
          </View>
          {isPlusMember && <PlusBadge />}
        </View>
        <Text style={styles.greeting}>Merhaba, {profile?.full_name}</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son İlanlar</Text>
          {loading ? (
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          ) : jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Henüz ilan bulunmuyor</Text>
            </View>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                originCity={job.origin_city}
                destinationCity={job.destination_city}
                cargoType={job.cargo_type}
                cargoWeight={job.cargo_weight}
                price={job.price}
                currency={job.currency}
                departureDate={job.departure_date}
                onPress={() => router.push(`/job/${job.id}`)}
              />
            ))
          )}
        </View>

        {!isPlusMember && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={() => router.push('/subscription-plan')}>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>PLUS Üyeliğe Geçin</Text>
              <Text style={styles.upgradeDescription}>
                İlan verin, mesajlaşın ve daha fazlasını yapın
              </Text>
            </View>
            <View style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Yükselt</Text>
            </View>
          </TouchableOpacity>
        )}
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  greeting: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  upgradeCard: {
    backgroundColor: '#fef3c7',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upgradeContent: {
    flex: 1,
    marginRight: 12,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 13,
    color: '#78350f',
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
