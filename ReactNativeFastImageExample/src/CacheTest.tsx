import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';

const TEST_IMAGE_URL = 'https://picsum.photos/400/400';

export default function CacheTest() {
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [cachePath, setCachePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取缓存大小
  const getCacheSize = async () => {
    try {
      const size = await FastImage.getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error('获取缓存大小失败:', error);
    }
  };

  // 获取指定图片的缓存路径
  const getImageCachePath = async () => {
    try {
      const path = await FastImage.getCachePath({uri: TEST_IMAGE_URL});
      setCachePath(path);
    } catch (error) {
      console.error('获取缓存路径失败:', error);
    }
  };

  // 清除内存缓存
  const clearMemoryCache = async () => {
    setLoading(true);
    try {
      await FastImage.clearMemoryCache();
      await getCacheSize();
    } catch (error) {
      console.error('清除内存缓存失败:', error);
    }
    setLoading(false);
  };

  // 清除磁盘缓存
  const clearDiskCache = async () => {
    setLoading(true);
    try {
      await FastImage.clearDiskCache();
      await getCacheSize();
      await getImageCachePath();
    } catch (error) {
      console.error('清除磁盘缓存失败:', error);
    }
    setLoading(false);
  };

  // 预加载测试图片
  const preloadImage = async () => {
    setLoading(true);
    try {
      await FastImage.preload([{uri: TEST_IMAGE_URL}]);
      await getCacheSize();
      await getImageCachePath();
    } catch (error) {
      console.error('预加载图片失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCacheSize();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>缓存测试</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>缓存信息</Text>
        <Text style={styles.info}>
          当前缓存大小: {(cacheSize / (1024 * 1024)).toFixed(2)} MB
        </Text>
        <Text style={styles.info}>图片缓存路径: {cachePath || '未缓存'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>测试图片</Text>
        <FastImage source={{uri: TEST_IMAGE_URL}} style={styles.testImage} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>操作按钮</Text>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={preloadImage}
          disabled={loading}>
          <Text style={styles.buttonText}>预加载图片</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={clearMemoryCache}
          disabled={loading}>
          <Text style={styles.buttonText}>清除内存缓存</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={clearDiskCache}
          disabled={loading}>
          <Text style={styles.buttonText}>清除磁盘缓存</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  testImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
