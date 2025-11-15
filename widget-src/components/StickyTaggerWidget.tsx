const { widget } = figma;
const { AutoLayout, Text, SVG } = widget;

import { useStickyTaggerWidget } from '../hooks/useStickyTaggerWidget';
import { StickyTaggerSizeMode, Size } from '../types';
import { getTagIconSvg } from '../utils/icons';
import { sizeConfig } from './PointWidget';

// Helper function to determine dimensions based on size
const getTagButtonDimensions = (size: Size) => {
  const config = sizeConfig[size] || sizeConfig.medium;
  return {
    fontSize: config.fontSize,
    cornerRadius: config.cornerRadius,
    // iconSize is derived from fontSize for visual balance, as it's not in the original PointWidget config
    iconSize: config.fontSize * 0.8,
  };
};

export function StickyTaggerWidget({ stickyTaggerSizeMode }: { stickyTaggerSizeMode: StickyTaggerSizeMode }) {
  const {
    templates,
    showConfirmDelete,
    showConfirmBulkDelete,
    widgetsToDeleteCount,
    handleTemplateClick,
    handleDeleteTemplate,
    confirmDelete,
    cancelDelete,
    handleRegisterTemplate,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    templateToDelete,
    isOverwriteEnabled, // 追加
    setIsOverwriteEnabled, // 追加
  } = useStickyTaggerWidget();

  if (stickyTaggerSizeMode === 'compact') {
    return (
      <AutoLayout
        verticalAlignItems={'center'}
        horizontalAlignItems={'start'}
        spacing={8}
        padding={{ vertical: 12, left: 8, right: 20 }}
        cornerRadius={8}
        fill={'#FFFFFF'}
        stroke={'#E0E0E0'}
        strokeWidth={1}
      >
        <AutoLayout tooltip="Click a tag to apply. Switch to normal mode to manage tags." horizontalAlignItems="center" spacing={4}>
          <SVG src={`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(25 12 12)"><path d="M19.5 10.5L12 3L4.5 10.5V19.5C4.5 20.0523 4.94772 20.5 5.5 20.5H18.5C19.0523 20.5 19.5 20.0523 19.5 19.5V10.5Z" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7.5" r="1.5" fill="#1A1A1A"/></svg>`} width={16} height={16} />
        </AutoLayout>
        {templates.length > 0 ? (
        <AutoLayout direction="horizontal" spacing={8} horizontalAlignItems="start" verticalAlignItems="center" wrap>
          {[...templates].sort((a, b) => a.point - b.point).map((template) => {
            const { iconSize, fontSize, cornerRadius } = getTagButtonDimensions(template.size);
            return (
              <AutoLayout
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                fill={template.backgroundColor || '#007BFF'}
                cornerRadius={cornerRadius}
                padding={{ horizontal: 10, vertical: 5 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
                stroke={'#000000'}
                strokeWidth={1}
                width={template.layoutWidth}
                height={template.layoutHeight}
              >
                <AutoLayout horizontalAlignItems="center" verticalAlignItems="center" spacing={4}>
                  <SVG
                    width={iconSize}
                    height={iconSize}
                    src={getTagIconSvg(template.textColor || '#FFFFFF')}
                  />
                  <Text fill={template.textColor || '#FFFFFF'} fontSize={fontSize} fontWeight={600}>{template.point}</Text>
                </AutoLayout>
              </AutoLayout>
            );
          })}
        </AutoLayout>
      ) : (
        <Text fontSize={14} fill={'#6C757D'}>No templates. Switch to normal mode to add tags.</Text>
      )}
      </AutoLayout>
    )
  }

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      horizontalAlignItems={'center'}
      padding={16}
      cornerRadius={12}
      fill={'#FFFFFF'}
      stroke={'#E0E0E0'}
      strokeWidth={1}
      direction="vertical"
      width={220}
      spacing={8}
      positioning="auto"
    >
      <Text fontSize={24} fontWeight={700} fill={'#1A1A1A'}>Sticky Tagger</Text>

      <AutoLayout direction="vertical" spacing={10} width="fill-parent" horizontalAlignItems="center">

        {/* --- Template Management --- */}
        <AutoLayout spacing={8} verticalAlignItems="center" width="fill-parent" horizontalAlignItems="end">
          <AutoLayout
            onClick={handleRegisterTemplate}
            fill="#28A745"
            cornerRadius={8}
            padding={{ horizontal: 12, vertical: 6 }}
            horizontalAlignItems="center"
            verticalAlignItems="center"
            hoverStyle={{ opacity: 0.9 }}
          >
            <Text fill="#FFFFFF" fontSize={14} fontWeight={600}>Add to Palette</Text>
          </AutoLayout>
          <AutoLayout
            tooltip="Adds selected 'Point' widgets to the palette. You can select multiple widgets or a section."
            width={16}
            height={16}
            cornerRadius={999}
            stroke={'#6C757D'}
            strokeWidth={1}
            horizontalAlignItems="center"
            verticalAlignItems="center"
            hoverStyle={{ stroke: '#1A1A1A' }}
          >
            <Text fontSize={10} fontWeight={700} fill={'#6C757D'} hoverStyle={{ fill: '#1A1A1A' }}>i</Text>
          </AutoLayout>
        </AutoLayout>

        <AutoLayout height={1} width="fill-parent" fill={'#E0E0E0'} />

        {/* --- Apply Tags --- */}
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <AutoLayout spacing={8} verticalAlignItems="center">
            <Text fontSize={16} fontWeight={700}>Tag Palette</Text>
            <AutoLayout
              tooltip="Select one or more sticky notes, then click a tag to apply."
              width={16}
              height={16}
              cornerRadius={999}
              stroke={'#6C757D'}
              strokeWidth={1}
              horizontalAlignItems="center"
              verticalAlignItems="center"
              hoverStyle={{ stroke: '#1A1A1A' }}
            >
              <Text fontSize={10} fontWeight={700} fill={'#6C757D'} hoverStyle={{ fill: '#1A1A1A' }}>i</Text>
            </AutoLayout>
          </AutoLayout>

          {/* --- Overwrite Checkbox --- */}
          <AutoLayout
            spacing={6}
            verticalAlignItems="center"
            onClick={() => setIsOverwriteEnabled(!isOverwriteEnabled)}
            hoverStyle={{ opacity: 0.8 }}
            cornerRadius={4}
            padding={{left: 4, right: 4}}
          >
            <AutoLayout
              width={14}
              height={14}
              stroke={'#888'}
              strokeWidth={1.5}
              cornerRadius={3}
              verticalAlignItems="center"
              horizontalAlignItems="center"
              fill={isOverwriteEnabled ? '#007BFF' : '#FFFFFF'}
            >
              {isOverwriteEnabled && (
                <SVG
                  width={10}
                  height={10}
                  src={`<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>`}
                />
              )}
            </AutoLayout>
            <Text fontSize={12} fill={'#333'}>Overwrite existing tags</Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

      {templates.length > 0 ? (
        <AutoLayout direction="vertical" spacing={8} width="fill-parent" horizontalAlignItems="start" padding={{ left: 8 }}>
          {[...templates].sort((a, b) => a.point - b.point).map((template) => {
            const { iconSize, fontSize, cornerRadius } = getTagButtonDimensions(template.size);
            return (
              <AutoLayout
                key={template.id}
                direction="horizontal"
                verticalAlignItems="center"
                spacing={4}
              >
                <AutoLayout
                  onClick={() => handleTemplateClick(template)}
                  fill={template.backgroundColor || '#007BFF'}
                  cornerRadius={cornerRadius}
                  padding={{ horizontal: 10, vertical: 5 }}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  hoverStyle={{ opacity: 0.9 }}
                  stroke={'#000000'}
                  strokeWidth={1}
                  width={template.layoutWidth}
                  height={template.layoutHeight}
                >
                  <AutoLayout horizontalAlignItems="center" verticalAlignItems="center" spacing={4}>
                    <SVG
                      width={iconSize}
                      height={iconSize}
                      src={getTagIconSvg(template.textColor || '#FFFFFF')}
                    />
                    <Text fill={template.textColor || '#FFFFFF'} fontSize={fontSize} fontWeight={600}>{template.point}</Text>
                  </AutoLayout>
                </AutoLayout>
                <AutoLayout
                  onClick={() => handleDeleteTemplate(template.id)}
                  fill={'#DC3545'}
                  cornerRadius={999}
                  width={20}
                  height={20}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  hoverStyle={{ opacity: 0.9 }}
                >
                  <Text fill={'#FFFFFF'} fontSize={12} fontWeight={600}>X</Text>
                </AutoLayout>
              </AutoLayout>
            );
          })}
        </AutoLayout>
      ) : (
        <Text fontSize={14} fill={'#6C757D'}>No templates registered yet.</Text>
      )}

      <AutoLayout height={4} />

      {/* Separator */}
      <AutoLayout height={1} width="fill-parent" fill={'#E0E0E0'} />

      {/* Bulk Delete Button */}
      <AutoLayout spacing={8} verticalAlignItems="center" horizontalAlignItems="end" width="fill-parent">
        <AutoLayout
          onClick={handleBulkDelete}
          fill={'#DC3545'}
          cornerRadius={8}
          padding={{ horizontal: 12, vertical: 6 }}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          hoverStyle={{ opacity: 0.9 }}
        >
          <Text fill={'#FFFFFF'} fontSize={14} fontWeight={600}>Bulk Delete Tags</Text>
        </AutoLayout>
        <AutoLayout
          tooltip="Deletes all 'Point' widgets found within the current selection."
          width={16}
          height={16}
          cornerRadius={999}
          stroke={'#6C757D'}
          strokeWidth={1}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          hoverStyle={{ stroke: '#1A1A1A' }}
        >
          <Text fontSize={10} fontWeight={700} fill={'#6C757D'} hoverStyle={{ fill: '#1A1A1A' }}>i</Text>
        </AutoLayout>
      </AutoLayout>

      {showConfirmDelete && (
        <AutoLayout
          fill="#00000080" // Semi-transparent overlay
          width={220}
          height={250}
          verticalAlignItems="center"
          horizontalAlignItems="center"
          positioning="absolute"
        >
          <AutoLayout
            fill="#FFFFFF"
            cornerRadius={12}
            padding={20}
            direction="vertical"
            spacing={16}
            horizontalAlignItems="center"
            width={220}
          >
            <Text fontSize={18} fontWeight={700}>Confirm Deletion</Text>
            <Text fontSize={14} width={220} horizontalAlignText="center">{templateToDelete ? `Are you sure you want to delete "${templateToDelete.label}" (${templateToDelete.point} pts)?` : ''}</Text>
            <AutoLayout direction="horizontal" spacing={12}>
              <AutoLayout
                onClick={confirmDelete}
                fill="#DC3545"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>Yes</Text>
              </AutoLayout>
              <AutoLayout
                onClick={cancelDelete}
                fill="#6C757D"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>No</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}

      {showConfirmBulkDelete && (
        <AutoLayout
          fill="#00000080" // Semi-transparent overlay
          width={220}
          height={250}
          verticalAlignItems="center"
          horizontalAlignItems="center"
          positioning="absolute"
        >
          <AutoLayout
            fill="#FFFFFF"
            cornerRadius={12}
            padding={20}
            direction="vertical"
            spacing={16}
            horizontalAlignItems="center"
            width={220}
          >
            <Text fontSize={18} fontWeight={700}>Confirm Bulk Deletion</Text>
            <Text fontSize={14} width={180} horizontalAlignText="center">
              {`Are you sure you want to delete ${widgetsToDeleteCount} 'Point' widget(s) from your selection?`}
            </Text>
            <AutoLayout direction="horizontal" spacing={12}>
              <AutoLayout
                onClick={confirmBulkDelete}
                fill="#DC3545"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>Yes, Delete</Text>
              </AutoLayout>
              <AutoLayout
                onClick={cancelBulkDelete}
                fill="#6C757D"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>Cancel</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  );
}