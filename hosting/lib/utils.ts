import { SemanticCOLORS } from "semantic-ui-react";

export function getColorByInfluenceFactor(factor) {
  let color = "" as SemanticCOLORS;
  switch (factor) {
    case "강한긍정":
      color = "red";
      break;
    case "긍정":
      color = "orange";
      break;
    case "약한긍정":
      color = "yellow";
      break;
    case "중립":
      color = "green";
      break;
    case "약한부정":
      color = "teal";
      break;
    case "부정":
      color = "blue";
      break;
    case "강한부정":
      color = "violet";
      break;
    default:
      break;
  }
  return color;
}
