import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { JobCard } from '@/components/JobCard';
import { Briefcase } from 'lucide-react-native';

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

export default function JobsScreen() {
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
        .order('created_at', { ascending: false });

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

    const subscription = supabase
      .channel('job_listings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_listings' },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Briefcase size={28} color="#f59e0b" />
        <Text style={styles.headerTitle}>Tüm İlanlar</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {loading ? (
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        ) : jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Briefcase size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Henüz ilan bulunmuyor</Text>
            <Text style={styles.emptyDescription}>
              İlk ilan verenlerden biri olun
            </Text>
          </View>
        ) : (
          <View style={styles.jobList}>
            {jobs.map((job) => (
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
            ))}
          </View>
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
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
  jobList: {
    padding: 20,
  },
});
