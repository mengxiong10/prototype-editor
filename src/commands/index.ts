import { registerCommand } from '../editor/command';
import { inlineStyle } from './inlineStyle';

Object.keys(inlineStyle).forEach(name => {
  registerCommand(name, inlineStyle[name]);
});
