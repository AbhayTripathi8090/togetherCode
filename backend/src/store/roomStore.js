const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { users: new Set() });
  }

  return rooms.get(roomId);
}

export function addUserToRoom(roomId, userName) {
  const room = getOrCreateRoom(roomId);
  room.users.add(userName);
}

export function removeUserFromRoom(roomId, userName) {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  room.users.delete(userName);

  if (room.users.size === 0) {
    rooms.delete(roomId);
  }
}

export function getRoomUsers(roomId) {
  const room = rooms.get(roomId);
  return room ? Array.from(room.users) : [];
}

export function hasRoom(roomId) {
  return rooms.has(roomId);
}
