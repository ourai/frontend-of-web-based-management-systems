function pick(obj, keys) {
  if (keys.length === 0) {
    return {};
  }

  const resolved = {};

  Object.keys(obj).forEach(key => {
    if (keys.length === 0) {
      return;
    }

    const idx = keys.indexOf(key);

    if (idx !== -1) {
      resolved[key] = obj[key];

      keys.splice(idx, 1);
    }
  });

  return resolved;
}

function omit(obj, keys) {
  if (keys.length === 0) {
    return obj;
  }

  const resolved = {};

  Object.keys(obj).forEach(key => {
    if (keys.length === 0) {
      resolved[key] = obj[key];
    } else {
      const idx = keys.indexOf(key);

      if (idx === -1) {
        resolved[key] = obj[key];
      } else {
        keys.splice(idx, 1);
      }
    }
  });

  return resolved;
}

export { pick, omit };
