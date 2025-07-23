
const { widget } = figma
const { useSyncedState, useStickable, useWidgetNodeId, useEffect } = widget

export function usePointWidget(groupingEnabled: boolean) {
  const [beforeGroupingEnabled, setBeforeGroupingEnabled] = useSyncedState<boolean>('beforeGroupingEnabled', false)
  const widgetNodId = useWidgetNodeId()
  function unGroupNode(node: BaseNode) {
    if (node.parent?.type === "GROUP") {
      figma.ungroup(node.parent);
    }
  }

  useStickable(async (e: WidgetStuckEvent) => {     
    async function getNode(id: string) {
      return await figma.getNodeByIdAsync(id);
    }

    async function handleOldHost(oldHostId: string) {
      const widgetNode = await getNode(widgetNodId);
      if (!widgetNode) return;

      const oldHost = await getNode(oldHostId);
      if (!oldHost) {
        widgetNode.remove();
        return;
      }

      if (groupingEnabled) {
        unGroupNode(widgetNode);
      }
    }

    async function handleNewHost(newHostId: string) {
      if (!groupingEnabled) return;

      const newHost = await getNode(newHostId);
      const widgetNode = await getNode(widgetNodId);
                  
      if (newHost && widgetNode) {
        const newHostParent = newHost.parent;
        if (newHostParent) {
          figma.group([newHost, widgetNode], newHostParent);
        }
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
      figma.getNodeByIdAsync(widgetNodId).then(node => {
        if(node?.type === 'WIDGET' && node.stuckTo && node.parent){
          figma.group([node.stuckTo, node], node.parent);
        }
      })
    } else {
      figma.getNodeByIdAsync(widgetNodId).then(node => {
        if(node?.parent){
          unGroupNode(node);
        }
      })
    }
  })
}
