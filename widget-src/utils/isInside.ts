export const isInside = (node: SceneNode, section: SectionNode) => {
  if (!node.absoluteBoundingBox || !section.absoluteBoundingBox) {
    return false;
  }
  const nodeX = node.absoluteBoundingBox.x;
  const nodeY = node.absoluteBoundingBox.y;
  const nodeWidth = node.absoluteBoundingBox.width;
  const nodeHeight = node.absoluteBoundingBox.height;

  const sectionX = section.absoluteBoundingBox.x;
  const sectionY = section.absoluteBoundingBox.y;
  const sectionWidth = section.absoluteBoundingBox.width;
  const sectionHeight = section.absoluteBoundingBox.height;

  return (
    nodeX >= sectionX &&
    nodeY >= sectionY &&
    nodeX + nodeWidth <= sectionX + sectionWidth &&
    nodeY + nodeHeight <= sectionY + sectionHeight
  );
};