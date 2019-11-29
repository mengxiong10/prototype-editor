import Editor from './Editor';

export type ExecuteCallback = (editor: Editor) => void;

export type CommandType = { [key: string]: ExecuteCallback };

const commands: CommandType = {};

export function registerCommand(name: string, callback: ExecuteCallback) {
  commands[name] = callback;
}

export function execute(editor: Editor) {
  return (name: string) => {
    if (!commands[name]) {
      console.warn(`${name} 未注册!!!`);
      return;
    }
    commands[name](editor);
  };
}
