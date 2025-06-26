export const enum Availability {
  Unavailable = '0',
  Available = '1',
  IfNeeded = '2',
}

// this is apparently necessary and i hate it
const allAvailabilityValues: Availability[] = [
  Availability.Unavailable,
  Availability.Available,
  Availability.IfNeeded,
];

export const encodeAvailabilityList = (a: Availability[]): string => {
  return a.join('');
};

export const decodeAvailability = (c: string): Availability => {
  console.assert(c.length == 1, 'invalid argument');
  for (const avail of allAvailabilityValues) {
    if (c === avail) {
      return avail;
    }
  }
  return Availability.Unavailable;
};

export const decodeAvailabilityString = (s: string): Availability[] => {
  return [...s].map(decodeAvailability);
};
