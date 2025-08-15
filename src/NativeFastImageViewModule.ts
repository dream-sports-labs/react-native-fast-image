import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import { Source } from './index'

export interface Spec extends TurboModule {
    addListener(eventName: string): void
    removeListeners(count: number): void
    preload: (
        sources: Source[],
        onComplete?: (finished: number, skipped: number) => void,
    ) => void
    clearMemoryCache: () => Promise<void>
    clearDiskCache: () => Promise<void>
}

export default TurboModuleRegistry.getEnforcing<Spec>('FastImageViewModule')
