import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Package, Calendar, TrendingUp } from 'lucide-react-native';

type JobCardProps = {
  title: string;
  originCity: string;
  destinationCity: string;
  cargoType: string;
  cargoWeight: number;
  price: number;
  currency: string;
  departureDate: string;
  onPress: () => void;
};

export function JobCard({
  title,
  originCity,
  destinationCity,
  cargoType,
  cargoWeight,
  price,
  currency,
  departureDate,
  onPress,
}: JobCardProps) {
  const formattedDate = new Date(departureDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.route}>
        <View style={styles.routeItem}>
          <MapPin size={16} color="#10b981" />
          <Text style={styles.routeText}>{originCity}</Text>
        </View>
        <View style={styles.arrow}>
          <TrendingUp size={16} color="#6b7280" />
        </View>
        <View style={styles.routeItem}>
          <MapPin size={16} color="#ef4444" />
          <Text style={styles.routeText}>{destinationCity}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Package size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {cargoType} ({cargoWeight} ton)
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#6b7280" />
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>
          {price.toLocaleString('tr-TR')} {currency}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrow: {
    marginHorizontal: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
  },
});
