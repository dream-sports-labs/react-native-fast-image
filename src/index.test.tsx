import { StyleSheet, Platform, NativeModules } from 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'
import FastImage from './index'

const style = StyleSheet.create({ image: { width: 44, height: 44 } })

describe('FastImage (iOS)', () => {
    beforeAll(() => {
        Platform.OS = 'ios'
        NativeModules.FastImageView = {
            preload: Function.prototype,
            clearMemoryCache: Function.prototype,
            clearDiskCache: Function.prototype,
        }
    })

    it('renders', () => {
        const { toJSON } = render(
            <FastImage
                source={{
                    uri: 'https://facebook.github.io/react/img/logo_og.png',
                    headers: {
                        token: 'someToken',
                    },
                    priority: FastImage.priority.high,
                }}
                style={style.image}
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('renders a normal Image when not passed a uri', () => {
        const { toJSON } = render(
            <FastImage
                source={require('../ReactNativeFastImageExampleServer/pictures/jellyfish.gif')}
                style={style.image}
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('renders Image with fallback prop', () => {
        const { toJSON } = render(
            <FastImage
                source={require('../ReactNativeFastImageExampleServer/pictures/jellyfish.gif')}
                style={style.image}
                fallback
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('renders defaultSource', () => {
        const { toJSON } = render(
            <FastImage
                defaultSource={require('../ReactNativeFastImageExampleServer/pictures/jellyfish.gif')}
                style={style.image}
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })
})

describe('FastImage (Android)', () => {
    beforeAll(() => {
        Platform.OS = 'android'
    })

    it('renders a normal defaultSource', () => {
        const { toJSON } = render(
            <FastImage
                defaultSource={require('../ReactNativeFastImageExampleServer/pictures/jellyfish.gif')}
                style={style.image}
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('renders a normal defaultSource when fails to load source', () => {
        const { toJSON } = render(
            <FastImage
                defaultSource={require('../ReactNativeFastImageExampleServer/pictures/jellyfish.gif')}
                source={{
                    uri: 'https://www.google.com/image_does_not_exist.png',
                }}
                style={style.image}
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('renders a non-existing defaultSource', () => {
        const { toJSON } = render(
            <FastImage defaultSource={12345} style={style.image} />,
        )
        expect(toJSON()).toMatchSnapshot()
    })
})
