
export const isOverlapping = (node: SceneNode, section: SectionNode) => {
  if (!node.absoluteBoundingBox || !section.absoluteBoundingBox) {
    return false;
  }

  const nodeRect = node.absoluteBoundingBox;
  const sectionRect = section.absoluteBoundingBox;

  // Check if there is an overlap on the X axis
  const xOverlap = nodeRect.x <= sectionRect.x + sectionRect.width && 
                 nodeRect.x + nodeRect.width >= sectionRect.x;

  // Check if there is an overlap on the Y axis
  const yOverlap = nodeRect.y <= sectionRect.y + sectionRect.height && 
                 nodeRect.y + nodeRect.height >= sectionRect.y;

  // Overlap exists only if there is an overlap on both axes
  return xOverlap && yOverlap;
};