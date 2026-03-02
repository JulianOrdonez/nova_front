/**
 * Icon Mapper
 * Mapea nombres de iconos a emojis
 */

export const iconMap: Record<string, string> = {
  'globe': '🌐',
  'smartphone': '📱',
  'package': '📦',
  'cpu': '🤖',
  'building': '🏢',
  'shopping-cart': '🛒',
  'users': '👥',
  'monitor': '💻',
  'zap': '⚡',
  'headphones': '🎧',
  'default': '⭐',
};

export function getIcon(iconName: string): string {
  return iconMap[iconName.toLowerCase()] || iconMap['default'];
}
