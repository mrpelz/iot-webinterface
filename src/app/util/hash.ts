const textEncoder = new TextEncoder();

const hexMap: string[] = [];
for (let n = 0; n <= 255; n += 1) {
  const hexOctet = n.toString(16).padStart(2, '0');
  hexMap.push(hexOctet);
}

const hex = (arrayBuffer: ArrayBuffer) => {
  const buf = new Uint8Array(arrayBuffer);
  const hexOctets = [];

  for (const octet of buf.values()) {
    hexOctets.push(hexMap[octet]);
  }

  return hexOctets.join('');
};

export const hash = async (input: string): Promise<string> => {
  return hex(
    (await crypto.subtle.digest('SHA-1', textEncoder.encode(input))).slice(17)
  );
};
