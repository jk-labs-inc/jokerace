import { artConfig } from "./art/config";
import { debateConfig } from "./debate/config";
import { demoDayConfig } from "./demo-day/config";
import { grantsRoundConfig } from "./grants-round/config";
import { hackathonConfig } from "./hackathon/config";
import { memeConfig } from "./meme/config";
import { TemplateConfig, TemplateType } from "./types";

export const templateConfigs: { [key in TemplateType]: TemplateConfig } = {
  [TemplateType.hackathon]: hackathonConfig,
  [TemplateType.demoDay]: demoDayConfig,
  [TemplateType.debate]: debateConfig,
  [TemplateType.grantsRound]: grantsRoundConfig,
  [TemplateType.memeContest]: memeConfig,
  [TemplateType.artContest]: artConfig,
};

export const displayValueToKeyMapping: { [key: string]: TemplateType } = {
  hackathon: TemplateType.hackathon,
  "demo day": TemplateType.demoDay,
  debate: TemplateType.debate,
  "grants round": TemplateType.grantsRound,
  "meme contest": TemplateType.memeContest,
  "art contest": TemplateType.artContest,
};

export const getTemplateConfigByType = (type: TemplateType) => {
  const enumKey = displayValueToKeyMapping[type];

  return templateConfigs[enumKey];
};
