
const { widget } = figma
const { useSyncedState, AutoLayout, Input, useStickable, useWidgetNodeId, useEffect } = widget
import { Size } from '../types'

export function PointWidget({ size, backgroundColor, textColor, width, groupingEnabled }: { size: Size; backgroundColor: string; textColor: string; width: number; groupingEnabled: boolean }) {
  const [point, setPoint] = useSyncedState<number>('point', 0)
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

  // サイズ設定を定義
  const sizeConfig: Record<Size, {
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

  const config = sizeConfig[size]

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      padding={config.padding}
      cornerRadius={config.cornerRadius}
      fill={backgroundColor}
      stroke={'#000000'}
      strokeWidth={1}
    >
      <Input
        value={point.toString()}
        placeholder="0"
        onTextEditEnd={(e) => {
          const newValue = parseFloat(e.characters)
          if (!isNaN(newValue)) {
            setPoint(newValue)
          }
        }}
        fontSize={config.fontSize}
        width={width}
        horizontalAlignText={'center'}
        fill={textColor}
      />
    </AutoLayout>
  )
}
