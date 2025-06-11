import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import {  DiskCacheSize, Source } from './index'



export interface Spec extends TurboModule {
    readonly getConstants: () => {}
    readonly preload: (sources: Source[]) => void
    readonly clearMemoryCache: () => Promise<void>
    readonly clearDiskCache: () => Promise<void>
    readonly getDiskCacheSize: () => Promise<DiskCacheSize>
}

export default TurboModuleRegistry.get<Spec>('FastImageView')
