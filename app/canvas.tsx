import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useMMKVString } from 'react-native-mmkv';
import { storage } from '../src/lib/storage';

interface Stroke {
  id: string;
  points: { x: number; y: number; pressure: number }[];
  color: string;
}

interface AgentResult {
  type: 'chart' | 'pdf' | 'text';
  content: string;
  data?: any;
}

export default function Canvas() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [uploads, setUploads] = useState<string[]>([]);
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [keys] = useMMKVString('keys', storage);

  const addStroke = useCallback((points: { x: number; y: number; pressure: number }[]) => {
    const newStroke: Stroke = {
      id: Date.now().toString(),
      points,
      color: '#ffffff',
    };
    setStrokes(prev => [...prev, newStroke]);
  }, []);

  const runGrokAgent = async () => {
    if (strokes.length === 0 && uploads.length === 0) {
      Alert.alert('Empty Canvas', 'Draw or upload something first');
      return;
    }

    setIsProcessing(true);

    // Simulate aggressive Grok agent analysis
    await new Promise(resolve => setTimeout(resolve, 1200));

    const resultCount = Math.floor(Math.random() * 2) + 2;
    const newResults: AgentResult[] = [];

    for (let i = 0; i < resultCount; i++) {
      const rType = ['chart', 'pdf', 'text'][Math.floor(Math.random() * 3)] as AgentResult['type'];
      newResults.push({
        type: rType,
        content: `Grok Agent: Generated ${rType.toUpperCase()} from ${strokes.length} strokes + ${uploads.length} files`,
        data: { strokeCount: strokes.length, fileCount: uploads.length, timestamp: Date.now() },
      });
    }

    setAgentResults(prev => [...prev, ...newResults]);
    setIsProcessing(false);
    Alert.alert('Grok Agent Complete', `${newResults.length} artifacts ready`);
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setUploads(prev => [...prev, uri]);
    }
  };

  const exportAll = async (format: string) => {
    const exportData = {
      strokes: strokes.length,
      uploads: uploads.length,
      results: agentResults.length,
      format,
      timestamp: new Date().toISOString(),
    };

    const fileUri = FileSystem.documentDirectory + `export_${Date.now()}.${format.toLowerCase()}`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2));
    await Sharing.shareAsync(fileUri);
  };

  const clearCanvas = () => {
    setStrokes([]);
    setUploads([]);
    setAgentResults([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4">
        <Text className="text-white text-3xl font-bold mb-2">Infinite Canvas</Text>
        <Text className="text-zinc-400 mb-4">Draw with pressure • Grok Agent auto-generates</Text>

        {/* Canvas Area */}
        <View className="flex-1 bg-zinc-900 rounded-3xl mb-4 border border-zinc-800 items-center justify-center">
          <Text className="text-zinc-500">Draw here (pressure supported via gesture)</Text>
          <Text className="text-xs text-zinc-600 mt-1">{strokes.length} strokes • {uploads.length} files</Text>
          <Pressable onPress={() => addStroke([{ x: 100, y: 100, pressure: 0.8 }])} className="mt-4 bg-zinc-800 px-4 py-2 rounded-xl">
            <Text className="text-white">Simulate Pencil Stroke</Text>
          </Pressable>
        </View>

        {/* Controls */}
        <View className="flex-row gap-3 mb-3">
          <Pressable onPress={runGrokAgent} disabled={isProcessing} className="flex-1 bg-emerald-600 py-4 rounded-2xl active:opacity-80">
            <Text className="text-white text-center font-semibold">{isProcessing ? 'GROK THINKING...' : 'RUN AGGRESSIVE GROK AGENT'}</Text>
          </Pressable>
          <Pressable onPress={pickFile} className="flex-1 border border-zinc-700 py-4 rounded-2xl">
            <Text className="text-white text-center font-semibold">UPLOAD FILE / IMAGE</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-3 mb-4">
          <Pressable onPress={() => exportAll('PDF')} className="flex-1 bg-white py-3 rounded-2xl">
            <Text className="text-black text-center font-semibold">Export PDF</Text>
          </Pressable>
          <Pressable onPress={() => exportAll('PNG')} className="flex-1 bg-white py-3 rounded-2xl">
            <Text className="text-black text-center font-semibold">Export PNG</Text>
          </Pressable>
          <Pressable onPress={() => exportAll('CHART')} className="flex-1 bg-white py-3 rounded-2xl">
            <Text className="text-black text-center font-semibold">Export Chart</Text>
          </Pressable>
          <Pressable onPress={clearCanvas} className="flex-1 border border-red-900 py-3 rounded-2xl">
            <Text className="text-red-400 text-center font-semibold">Clear</Text>
          </Pressable>
        </View>

        {/* Agent Results */}
        <ScrollView className="flex-1">
          {agentResults.length > 0 ? (
            agentResults.map((r, idx) => (
              <View key={idx} className="bg-zinc-900 p-4 mb-2 rounded-2xl border border-zinc-800">
                <Text className="text-emerald-400 font-semibold">{r.type.toUpperCase()}</Text>
                <Text className="text-white mt-1">{r.content}</Text>
              </View>
            ))
          ) : (
            <Text className="text-zinc-500 text-center mt-8">Agent results will appear here</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
