//
import { DOCUMENTS_TYPES } from 'src/common/constants/document.enum';

export interface FileUploadConfig {
  allowedExtensions: string[];
  maxSize: number;
  path: string;
}

export const fileConfigs: Record<string, FileUploadConfig> = {
  [DOCUMENTS_TYPES.PROFILE]: {
    allowedExtensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf','.jpg', '.jpeg', '.png', '.odt', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.html', '.xml'],
    maxSize: 10 * 1024 * 1024, // 10MB
    path: 'uploads/profile',
  },

  [DOCUMENTS_TYPES.INVOICE]: {
    allowedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx','.jpg', '.jpeg', '.png'],
    maxSize: 10 * 1024 * 1024, // 10MB
    path: 'uploads/invoice',
  },

};
