
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
  function unGroupNode(node: BaseNode) {
    const parent = node.parent
    
    if (parent?.type !== "GROUP") return;
    // グループの子要素がウィジェットとそれ以外のNodeが1つずつではない場合のみグループを解除する
    // グループの子要素が3つ以上ある場合、この機能でグループ化したのか、元々グループ化していたのか判断つかないため、解除せずそのままにする
    if (parent.children.length !== 2) return;

    figma.ungroup(parent);
  }

  function groupWidgetNode(widgetNode: WidgetNode) {
    const widgetParent = widgetNode.parent
    if(!widgetParent) return
    if(widgetParent.type === "GROUP") return;
    
    const widgetStuckTo = widgetNode.stuckTo
    if(!widgetStuckTo) return

    figma.group([widgetNode, widgetStuckTo], widgetNode.parent);
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
        unGroupNode(widgetNode);
      }
    }

    async function handleNewHost(newHostId: string) {
      if (!groupingEnabled) return;

      const widgetNode = await getWidgetNode();                  
      if (widgetNode) {
        groupWidgetNode(widgetNode);
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
          groupWidgetNode(node);
        }
      })
    } else {
      getWidgetNode().then(node => {
        if(node){
          unGroupNode(node);
        }
      })
    }
  })
}
