import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { initializeRevenueCat } from '@/lib/revenuecat';

// RevenueCat'ı bir kere başlat
initializeRevenueCat();

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <AuthNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

// Auth + Navigation mantığı burada (useAuth güvenli)
function AuthNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Giriş yoksa ve auth grubunda değilse → login'e
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    // Giriş varsa ve auth grubundaysa → tabs'e
    else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  // SADECE Stack dön – Fragment yok!
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* GRUP ROUTE'LAR YAZILMAZ! Otomatik algılanır */}
      {/* <Stack.Screen name="(auth)" /> ← YASAK! */}
      {/* <Stack.Screen name="(tabs)" /> ← YASAK! */}

      {/* Sadece dosya bazlı ekranlar */}
      <Stack.Screen name="subscription-plan" />
      {/* +not-found otomatik var, yazma */}
    </Stack>
  );
}