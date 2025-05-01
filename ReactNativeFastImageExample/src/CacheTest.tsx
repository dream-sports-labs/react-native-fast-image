import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';

// 使用随机参数确保不受CDN缓存影响
const getRandomImageUrl = () =>
  `https://picsum.photos/400/400?rand=${Math.random()}`;
const TEST_IMAGE_URL = 'https://picsum.photos/400/400';

export default function CacheTest() {
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [cachePath, setCachePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // CacheKey测试状态
  const [testImageUrl, setTestImageUrl] = useState(getRandomImageUrl());
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

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

  // 重新加载测试cacheKey的图片
  const reloadCacheKeyTestImages = () => {
    setIsLoading1(true);
    setIsLoading2(true);
    setIsLoading3(true);
    setTestImageUrl(getRandomImageUrl());
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

      {/* 添加 CacheKey 测试部分 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CacheKey 测试</Text>
        <Text style={styles.info}>
          相同URL不同cacheKey的图片会分别缓存。可观察三张图片在刷新时的加载情况。
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.reloadButton]}
          onPress={reloadCacheKeyTestImages}>
          <Text style={styles.buttonText}>重新加载测试图片</Text>
        </TouchableOpacity>

        <View style={styles.imageRow}>
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>默认缓存键(URI)</Text>
            <View style={styles.imageWrapper}>
              {isLoading1 && (
                <ActivityIndicator
                  style={styles.loader}
                  size="large"
                  color="#2196F3"
                />
              )}
              <FastImage
                style={styles.cacheKeyTestImage}
                source={{
                  uri: testImageUrl,
                  // 未指定cacheKey，默认使用URI作为缓存键
                }}
                onLoadStart={() => setIsLoading1(true)}
                onLoad={() => setIsLoading1(false)}
                onLoadEnd={() => setIsLoading1(false)}
              />
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>自定义缓存键1</Text>
            <View style={styles.imageWrapper}>
              {isLoading2 && (
                <ActivityIndicator
                  style={styles.loader}
                  size="large"
                  color="#2196F3"
                />
              )}
              <FastImage
                style={styles.cacheKeyTestImage}
                source={{
                  uri: testImageUrl,
                  cacheKey: 'custom-cache-key-1',
                }}
                onLoadStart={() => setIsLoading2(true)}
                onLoad={() => setIsLoading2(false)}
                onLoadEnd={() => setIsLoading2(false)}
              />
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>自定义缓存键2</Text>
            <View style={styles.imageWrapper}>
              {isLoading3 && (
                <ActivityIndicator
                  style={styles.loader}
                  size="large"
                  color="#2196F3"
                />
              )}
              <FastImage
                style={styles.cacheKeyTestImage}
                source={{
                  uri: testImageUrl,
                  cacheKey: 'custom-cache-key-2',
                }}
                onLoadStart={() => setIsLoading3(true)}
                onLoad={() => setIsLoading3(false)}
                onLoadEnd={() => setIsLoading3(false)}
              />
            </View>
          </View>
        </View>

        <Text style={styles.description}>
          验证方法：{'\n'}
          1. 点击"重新加载测试图片"，三张图片会同时加载{'\n'}
          2. 所有图片加载完成后，点击"清除磁盘缓存"{'\n'}
          3. 再次点击"重新加载测试图片"{'\n'}
          4.
          观察三张图片是否同时显示加载状态，若使用不同的缓存键，则应该同时显示加载状态
        </Text>
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
    marginBottom: 10,
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
  reloadButton: {
    backgroundColor: '#4CAF50',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
    width: '30%',
  },
  imageLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  cacheKeyTestImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e1e4e8',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  description: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: '#666',
  },
});
