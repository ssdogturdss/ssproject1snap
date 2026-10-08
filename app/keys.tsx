import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Link } from 'expo-router';

type KeyType = 'PROMO' | 'PAID' | 'API';
type Key = { id: string; type: KeyType; value: string; status: string; created: string };

export default function Keys() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [prefix, setPrefix] = useState('SYN-');
  const [length, setLength] = useState('16');

  const generateKey = (type: KeyType) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let val = prefix;
    for (let i = 0; i < parseInt(length) - prefix.length; i++) {
      val += chars[Math.floor(Math.random() * chars.length)];
    }
    const newKey: Key = {
      id: Date.now().toString(),
      type,
      value: val,
      status: 'active',
      created: new Date().toISOString(),
    };
    setKeys([newKey, ...keys]);
  };

  const revoke = (id: string) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Key Generator</Text>
      <TextInput style={styles.input} value={prefix} onChangeText={setPrefix} placeholder="Prefix" />
      <TextInput style={styles.input} value={length} onChangeText={setLength} placeholder="Length" keyboardType="numeric" />

      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12 }}>
        <Pressable style={styles.keyBtn} onPress={() => generateKey('PROMO')}><Text style={styles.btnText}>Promo Key</Text></Pressable>
        <Pressable style={styles.keyBtn} onPress={() => generateKey('PAID')}><Text style={styles.btnText}>Paid Key</Text></Pressable>
        <Pressable style={styles.keyBtn} onPress={() => generateKey('API')}><Text style={styles.btnText}>API Key</Text></Pressable>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {keys.map(k => (
          <View key={k.id} style={styles.keyRow}>
            <Text style={styles.keyVal}>{k.value}</Text>
            <Text style={{ color: '#888' }}>{k.type} • {k.status}</Text>
            <Pressable onPress={() => revoke(k.id)}><Text style={{ color: '#f55' }}>Revoke</Text></Pressable>
          </View>
        ))}
      </ScrollView>

      <Link href="/" style={styles.back}>Back</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#111' },
  header: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  keyBtn: { flex: 1, backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '700' },
  keyRow: { backgroundColor: '#222', padding: 12, borderRadius: 8, marginBottom: 6 },
  keyVal: { color: '#fff', fontFamily: 'monospace', fontSize: 16 },
  back: { color: '#3b82f6', marginTop: 20, textAlign: 'center' },
});
