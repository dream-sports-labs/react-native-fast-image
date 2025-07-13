import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import { DiskCacheSize, Source } from './index'



export interface Spec extends TurboModule {
    preload: (sources: Source[]) => void
    clearMemoryCache: () => Promise<void>
    clearDiskCache: () => Promise<void>
    getDiskCacheSize: () => Promise<DiskCacheSize>
}

export default TurboModuleRegistry.get<Spec>('FastImageView')
