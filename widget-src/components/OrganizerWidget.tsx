
const { widget } = figma;
const { AutoLayout, Text, SVG, useSyncedState } = widget;
import { useOrganizerWidget } from '../hooks/useOrganizerWidget';

export function OrganizerWidget() {
  const { groupSelectedItems, ungroupSelectedItems } = useOrganizerWidget();
  const [isForceMode, setIsForceMode] = useSyncedState('isForceMode', false);

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      horizontalAlignItems={'center'}
      spacing={8}
      padding={12}
      cornerRadius={12}
      fill={'#FFFFFF'}
      stroke={'#E0E0E0'}
      strokeWidth={1}
      direction="vertical"
      width={240}
    >
      <AutoLayout horizontalAlignItems={'center'} spacing={8}>
        <Text fontSize={24} fontWeight={700} fill={'#1A1A1A'}>Point Organizer</Text>
        <SVG
          src={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="#6C757D"/></svg>`}
          width={20}
          height={20}
          tooltip="Batch group/ungroup selected Point Widgets attached to a host, mirroring the Point Widget's auto-grouping behavior."
        />
      </AutoLayout>

      <AutoLayout
        verticalAlignItems={'center'}
        horizontalAlignItems={'center'}
        spacing={8}
        padding={{ vertical: 4, horizontal: 8 }}
        cornerRadius={100}
        width={160}
      >
        <Text fontSize={12} fontWeight={500}>Force Ungroup</Text>
        <AutoLayout
          width={32}
          height={20}
          cornerRadius={100}
          fill={isForceMode ? '#007BFF' : '#BDBDBD'}
          verticalAlignItems="center"
          horizontalAlignItems={isForceMode ? 'end' : 'start'}
          padding={2}
          onClick={() => setIsForceMode(!isForceMode)}
          hoverStyle={{ opacity: 0.9 }}
        >
          <AutoLayout
            width={16}
            height={16}
            cornerRadius={100}
            fill={'#FFFFFF'}
          />
        </AutoLayout>
      </AutoLayout>

      <AutoLayout
        onClick={groupSelectedItems}
        fill="#007BFF"
        cornerRadius={8}
        padding={8}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        hoverStyle={{ opacity: 0.9 }}
        width={160}
        height={36}
      >
        <Text fill="#FFFFFF" fontSize={14} fontWeight={600}>Group Selected</Text>
      </AutoLayout>
      <AutoLayout
        onClick={() => ungroupSelectedItems(isForceMode)}
        fill="#DC3545"
        cornerRadius={8}
        padding={8}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        hoverStyle={{ opacity: 0.9 }}
        width={160}
        height={36}
      >
        <Text fill="#FFFFFF" fontSize={14} fontWeight={600}>Ungroup Selected</Text>
      </AutoLayout>
    </AutoLayout>
  );
}
