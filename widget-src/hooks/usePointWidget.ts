
import { groupWidget, ungroupWidget } from '../utils/grouping';
const { widget } = figma
const { useSyncedState, useStickable, useWidgetNodeId, useEffect } = widget

export function usePointWidget(groupingEnabled: boolean) {
  const [beforeGroupingEnabled, setBeforeGroupingEnabled] = useSyncedState<boolean>('beforeGroupingEnabled', false)
  const widgetNodId = useWidgetNodeId()
  async function getWidgetNode(): Promise<WidgetNode | null> {
    const node = await figma.getNodeByIdAsync(widgetNodId);
    if(node?.type === "WIDGET"){
      return node
    }

    return null;
  }

  useStickable(async (e: WidgetStuckEvent) => {     
    async function getNode(id: string) {
      return await figma.getNodeByIdAsync(id);
    }

    async function handleOldHost(oldHostId: string) {
      const widgetNode = await getWidgetNode();
      if (!widgetNode) return;

      const oldHost = await getNode(oldHostId);
      if (!oldHost) {
        widgetNode.remove();
        return;
      }

      if (groupingEnabled) {
        ungroupWidget(widgetNode);
      }
    }

    async function handleNewHost(_newHostId: string) {
      if (!groupingEnabled) return;

      const widgetNode = await getWidgetNode();                  
      if (widgetNode) {
        groupWidget(widgetNode);
      }
    }

    if (e.oldHostId) {
      await handleOldHost(e.oldHostId);
    }
    if (e.newHostId) {
      await handleNewHost(e.newHostId);
    }
  })

  useEffect(() => {
    if(beforeGroupingEnabled === groupingEnabled) return;
    setBeforeGroupingEnabled(groupingEnabled)

    if(groupingEnabled){
      getWidgetNode().then(node => {
        if(node){
          groupWidget(node);
        }
      })
    } else {
      getWidgetNode().then(node => {
        if(node){
          ungroupWidget(node);
        }
      })
    }
  })
}
