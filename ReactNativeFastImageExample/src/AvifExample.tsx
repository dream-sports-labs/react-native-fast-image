import FastImage from '@d11/react-native-fast-image';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import FeatureText from './FeatureText';
import Section from './Section';
import SectionFlex from './SectionFlex';
import {useCacheBust} from './useCacheBust';

const AVIF_URL = 'https://raw.githubusercontent.com/dream-sports-labs/react-native-fast-image/248b099e54a382f58c2549796cf17ee2bd0e369a/ReactNativeFastImageExampleServer/pictures/shade.avif';

export const AvifExample = () => {
  const {url, bust} = useCacheBust(AVIF_URL);

  return (
    <View>
      <Section>
        <FeatureText text="• Remote AVIF with transparent background." />
      </Section>
      <SectionFlex onPress={bust}>
        <FastImage style={styles.image} source={{uri: url}} />
      </SectionFlex>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#ccc',
    margin: 20,
    height: 100,
    width: 100,
  },
});
