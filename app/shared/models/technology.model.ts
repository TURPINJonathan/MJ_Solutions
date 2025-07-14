import { Picture } from '#SModels/picture.model';

export type TechnologyType =
  | 'ANALYTICS'
  | 'API'
  | 'ARTIFICIAL_INTELLIGENCE'
  | 'AUTOMATION'
  | 'BACKEND'
  | 'BLOCKCHAIN'
  | 'CLOUD'
  | 'CMS'
  | 'CONTAINERIZATION'
  | 'CYBER_SECURITY'
  | 'DATA_SCIENCE'
  | 'DATABASE'
  | 'DESKTOP'
  | 'DEVOPS'
  | 'ECOMMERCE'
  | 'EMBEDDED'
  | 'FRONTEND'
  | 'FULLSTACK'
  | 'GAME_DEVELOPMENT'
  | 'INFRASTRUCTURE'
  | 'IOT'
  | 'MACHINE_LEARNING'
  | 'MOBILE'
  | 'NETWORKING'
  | 'OPERATING_SYSTEM'
  | 'OTHER'
  | 'SCRIPTING'
  | 'TESTING'
  | 'UI_UX'
  | 'VIRTUALIZATION'
  | 'WEB_SERVER';

export interface Technology {
  id?: number;
  name: string;
  description: string;
  proficiency: number; // 0 à 100
  documentationUrl?: string;
  logo?: Picture | null;
  color?: string;
  types: TechnologyType[];
  isFavorite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}