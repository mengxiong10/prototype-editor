import { CommandType } from '../editor/command';
import { getComponent } from '../editor/component';

export const inlineStyle: CommandType = {
  bold: editor => {
    const selectedData = editor.getSelectedComponent();
    selectedData.forEach(v => {
      const component = getComponent(v.type);
      if (component.command && component.command.bold) {
        const data = component.command.bold(v.data);
        editor.updateComponent(v.id, data);
      }
    });
  },
};
