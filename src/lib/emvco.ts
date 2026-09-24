export interface EmvTag {
  id: string;
  length: number;
  value: string;
  name: string;
  subTags?: EmvTag[];
}

export const TAG_NAMES: Record<string, string> = {
  '00': 'Payload Format Indicator',
  '01': 'Point of Initiation Method',
  '26': 'Merchant Account Information',
  '27': 'Merchant Account',
  '28': 'Merchant Account',
  '29': 'Merchant Account',
  '30': 'Merchant Account',
  '51': 'National QRIS Information (NNS)',
  '52': 'Merchant Category Code (MCC)',
  '53': 'Transaction Currency',
  '54': 'Transaction Amount',
  '55': 'Tip or Convenience Indicator',
  '56': 'Value of Convenience Fee Fixed',
  '57': 'Value of Convenience Fee Percentage',
  '58': 'Country Code',
  '59': 'Merchant Name',
  '60': 'Merchant City',
  '61': 'Postal Code',
  '62': 'Additional Data Field Template',
  '63': 'CRC-16 Checksum',
};

export const SUB_TAG_NAMES_62: Record<string, string> = {
  '01': 'Bill Number',
  '02': 'Mobile Number',
  '03': 'Store Label',
  '04': 'Loyalty Number',
  '05': 'Reference Label',
  '06': 'Customer Label',
  '07': 'Terminal Label',
  '08': 'Purpose of Transaction',
  '09': 'Additional Consumer Data Request',
};

export const SUB_TAG_NAMES_ACCOUNT: Record<string, string> = {
  '00': 'Globally Unique Identifier (GUID / Domain)',
  '01': 'Merchant ID / PAN',
  '02': 'Merchant Criteria',
  '03': 'Merchant Criteria UKE',
};

export function parseTlv(raw: string, isSubTag = false): EmvTag[] {
  const tags: EmvTag[] = [];
  let index = 0;

  while (index < raw.length) {
    if (index + 4 > raw.length) break;

    const id = raw.substring(index, index + 2);
    const lenStr = raw.substring(index + 2, index + 4);
    const length = parseInt(lenStr, 10);

    if (isNaN(length)) {
      break;
    }

    const valueStart = index + 4;
    const valueEnd = valueStart + length;

    if (valueEnd > raw.length) {
      break;
    }

    const value = raw.substring(valueStart, valueEnd);
    let name = TAG_NAMES[id] || `Tag ${id}`;

    if (isSubTag) {
      name = SUB_TAG_NAMES_ACCOUNT[id] || SUB_TAG_NAMES_62[id] || `Sub-tag ${id}`;
    }

    const tagObj: EmvTag = {
      id,
      length,
      value,
      name,
    };

    // Parse sub-tags for Tag 26-45, 51, and 62
    if (!isSubTag && ((parseInt(id, 10) >= 26 && parseInt(id, 10) <= 51) || id === '62')) {
      try {
        const sub = parseTlv(value, true);
        if (sub.length > 0) {
          tagObj.subTags = sub;
        }
      } catch {
        // ignore subtag parsing error
      }
    }

    tags.push(tagObj);
    index = valueEnd;
  }

  return tags;
}
