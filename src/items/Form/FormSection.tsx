import React from 'react';
import { Tabs } from 'antd';
import { CompositeWrapper, CompositeDropZone, ComponentOptions, CompositeData } from 'src/editor';
import type { FormTabProps } from './FormTab';

export interface FormSectionProps {
  children: CompositeData<FormTabProps>[];
}

const { TabPane } = Tabs;

function FormSection({ children }: FormSectionProps) {
  return (
    <CompositeDropZone match="r-form.tab">
      <Tabs defaultActiveKey={children[0].id}>
        {children.map((tab, i) => (
          <TabPane tab={<CompositeWrapper {...tab} index={i} />} key={tab.id}>
            <CompositeDropZone match="r-form.group" path={`children.${i}.children`}>
              {(tab.children || []).map((group, j) => (
                <CompositeWrapper {...group} key={group.id} index={`${i}.children.${j}`} />
              ))}
            </CompositeDropZone>
          </TabPane>
        ))}
      </Tabs>
    </CompositeDropZone>
  );
}

export const formSectionOptions: ComponentOptions<Omit<FormSectionProps, 'children'>> = {
  component: FormSection,
  children: ['r-form.tab'],
  defaultData: {},
};
