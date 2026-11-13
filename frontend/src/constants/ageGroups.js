export const AGE_STORAGE_KEY = 'hkids_age_group';

export const AGE_GROUPS = [
  {
    id: '3-5',
    label: 'Ages 3–5',
    shortLabel: '3–5',
    description: 'Simple picture stories for little readers',
    accent: 'age-coral'
  },
  {
    id: '6-8',
    label: 'Ages 6–8',
    shortLabel: '6–8',
    description: 'Fun adventures for growing minds',
    accent: 'age-sun'
  },
  {
    id: '9-12',
    label: 'Ages 9–12',
    shortLabel: '9–12',
    description: 'Exciting stories for curious readers',
    accent: 'age-leaf'
  },
  {
    id: '13-15',
    label: 'Ages 13–15',
    shortLabel: '13–15',
    description: 'Deeper stories for teens',
    accent: 'age-sky'
  },
  {
    id: '16+',
    label: 'Adults +16',
    shortLabel: '+16',
    description: 'Thoughtful reads for adults',
    accent: 'age-ink'
  }
];

export const AGE_GROUP_IDS = AGE_GROUPS.map((group) => group.id);

export const getAgeGroup = (id) => AGE_GROUPS.find((group) => group.id === id) || null;

export const saveSelectedAge = (ageGroup) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AGE_STORAGE_KEY, ageGroup);
};

export const loadSelectedAge = () => {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(AGE_STORAGE_KEY);
  return AGE_GROUP_IDS.includes(value) ? value : null;
};

export const clearSelectedAge = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AGE_STORAGE_KEY);
};
