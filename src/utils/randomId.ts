/**
 * 回忆如此玄妙
 * 她总会抹去坏的
 * 放大好的
 * 正因如此
 * 我们才得以承担过去的重负
 * -- 马尔克斯
 */
export function randomId() {
  return Math.random().toString(36).substr(2, 9);
}
