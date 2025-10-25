// lib/registries.js
// Contains rankRegistry, cosmeticRegistry and helper functions for get/save user
export const rankRegistry = {
  Default: { name: 'Default', resource: 'member' },
  Admin: { name: 'Admin', resource: 'admin' },
  beta: { name: 'beta', resource: 'beta tester' },
  booster: { name: 'Booster', resource: 'booster' },
  Developer: { name: 'Developer', resource: 'dev' },
  Helper: { name: 'Helper', resource: 'Helper' },
  Manager: { name: 'Manager', resource: 'manager' },
  Partner: { name: 'Partner', resource: 'partner' },
  SrMod: { name: 'SrMod', resource: 'sr mod' },
  Support: { name: 'Support', resource: 'support' },
  Youtube: { name: 'Youtube', resource: 'yt' }
};

export const cosmeticRegistry = {
  n1t: { id: 'n1t', name: 'Notro Cape', type: 'cape', resourceLocation: 'notro', isAnimated: false, selected: false },
  a1t: { id: 'a1t', name: 'Animated Notro Cape', type: 'cape', resourceLocation: 'notro', isAnimated: true, selected: false },
  b1t: { id: 'b1t', name: 'Dragon Wings', type: 'wings', resourceLocation: 'wings', isAnimated: false, selected: true }
};

/**
 * Convert DB document to user object shape used by APIs
 */
export function docToUser(doc) {
  if (!doc) return null;
  const cosmetics = (doc.cosmetics || []).map(c => ({
    ...(cosmeticRegistry[c.id] || { id: c.id, name: c.id, type: 'unknown', resourceLocation: c.id }),
    selected: !!c.selected
  }));
  return {
    mcName: doc.mcName,
    isUser: !!doc.isUser,
    rank: rankRegistry[doc.rank] || rankRegistry.Default,
    cosmetics
  };
}

/**
 * Prepare a user object for saving to DB
 * user: { mcName, isUser, rank: { name }, cosmetics: [{id, selected}] }
 */
export function userToDoc(user) {
  return {
    mcName: user.mcName,
    isUser: !!user.isUser,
    rank: (user.rank && user.rank.name) || 'Default',
    cosmetics: (user.cosmetics || []).map(c => ({ id: c.id, selected: !!c.selected }))
  };
}
