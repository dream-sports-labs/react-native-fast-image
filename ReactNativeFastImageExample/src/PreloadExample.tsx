import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SectionFlex from './SectionFlex';
import FastImage from '@d11/react-native-fast-image';
import Section from './Section';
import FeatureText from './FeatureText';
import Button from './Button';
// @ts-ignore
import {createImageProgress} from 'react-native-image-progress';
import {useCacheArrayBust} from './useCacheBust';


const IMAGE_URL = 'https://cdn-images-1.medium.com/max/1600/1*-CY5bU4OqiJRox7G00sftw.gif';

const IMAGE_COUNT = 3;


const Image = createImageProgress(FastImage);

export const PreloadExample = () => {
  const [show, setShow] = useState(false);
  const [preloadDone, setPreloadDone] = useState(false);
  const [totalToPreload, setTotalToPreload] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const {urls, bust} = useCacheArrayBust(Array(IMAGE_COUNT).fill(IMAGE_URL));

  const onPreloadComplete = () => {
    setPreloadDone(true);
  };

  const onProgress = (loadedCount: number, totalCount: number) => {
    setTotalToPreload(totalCount);
    setLoadedCount(loadedCount);
    console.log(`Preloading progress: ${loadedCount} / ${totalCount}`);
  };

  const onBust = () => {
    bust();
    setPreloadDone(false);
    setLoadedCount(0);
    setTotalToPreload(0);
  }

  const preload = () => {
    FastImage.preload(urls.map((url) => ({uri: url})), {onProgress, onComplete: onPreloadComplete});
  };

  return (
    <View>
      <Section>
        <FeatureText text="• Preloading." />
        <FeatureText text="• Progress indication using react-native-image-progress." />
      </Section>
      <SectionFlex style={styles.section}>
        
          <View style={styles.imageView}>
          {urls.map((url, index) => show ?(
              <Image key={index} style={styles.image} source={{uri: url}} />
            ) : (
              <View key={index} style={styles.image} />
            ))}
          </View>
        <FeatureText text={`Progress: ${loadedCount}/${totalToPreload}`} />
        <FeatureText text={preloadDone ? "Preload complete." : "Preload not run."} />
        <View style={styles.buttons}>
          <View style={styles.buttonView}>
            <Button text="Bust" onPress={onBust} />
          </View>
          <View style={styles.buttonView}>
            <Button text="Preload" onPress={preload} />
          </View>
          <View style={styles.buttonView}>
            <Button
              text={show ? 'Hide' : 'Show'}
              onPress={() => setShow(v => !v)}
            />
          </View>
        </View>
      </SectionFlex>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonView: {flex: 1},
  section: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  imageView: {
    padding: 20,
    flexDirection: 'row',
  },
  image: {
    backgroundColor: '#ddd',
    margin: 20,
    marginBottom: 10,
    height: 100,
    width: 100,
  },
});
