import { Size } from './types'

// サイズ設定を定義
export const sizeConfig: Record<Size, {
  fontSize: number
  padding: number
  cornerRadius: number
}> = {
  small: {
    fontSize: 16,
    padding: 6,
    cornerRadius: 4
  },
  medium: {
    fontSize: 24,
    padding: 8,
    cornerRadius: 8
  },
  large: {
    fontSize: 32,
    padding: 12,
    cornerRadius: 10
  }
}
